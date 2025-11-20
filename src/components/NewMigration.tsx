import { useState } from 'react';
import { migrationApi, novatabApi } from '../lib/api';
import Papa from 'papaparse';
import { X, Upload, ArrowRight, CheckCircle } from 'lucide-react';
import type { NovaTabConfig } from '../types';
import { useEffect } from 'react';

interface NewMigrationProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewMigration({ onClose, onSuccess }: NewMigrationProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [novaTabConfigs, setNovaTabConfigs] = useState<NovaTabConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNovaTabConfigs();
  }, []);

  const loadNovaTabConfigs = async () => {
    try {
      const configs = await novatabApi.getConfigs();
      setNovaTabConfigs(configs);
    } catch (error) {
      console.error('Failed to load NovaTab configs:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          const dataArray = Array.isArray(data) ? data : [data];
          setSourceData(dataArray);
          if (dataArray.length > 0) {
            setSourceFields(Object.keys(dataArray[0]));
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setSourceData(results.data as any[]);
          if (results.data.length > 0) {
            setSourceFields(Object.keys(results.data[0]));
          }
        },
        error: () => {
          alert('Invalid CSV file');
        },
      });
    } else {
      alert('Please upload a JSON or CSV file');
    }
  };

  const handleSubmit = async () => {
    if (!name || sourceData.length === 0 || !selectedConfig) {
      alert('Please complete all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const config = novaTabConfigs.find((c) => c.id === selectedConfig);
      if (!config) {
        alert('Invalid configuration selected');
        return;
      }

      await migrationApi.createJob({
        name,
        sourceType: 'CSV/JSON',
        sourceData,
        destinationConfig: {
          type: 'novatab',
          endpoint: config.apiEndpoint,
          apiKey: config.apiKey,
        },
        mappingConfig: mappings,
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to create migration:', error);
      alert('Failed to create migration job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="migration-step">
      <h3>Step 1: Basic Information</h3>
      <div className="form-group">
        <label htmlFor="migrationName">Migration Name</label>
        <input
          type="text"
          id="migrationName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Data Migration"
          required
        />
      </div>
      <button
        onClick={() => setStep(2)}
        className="btn-primary"
        disabled={!name}
      >
        Next <ArrowRight size={20} />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="migration-step">
      <h3>Step 2: Upload Data</h3>
      <div className="upload-section">
        <Upload size={48} />
        <p>Upload your CSV or JSON file</p>
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          className="file-input"
        />
        {sourceData.length > 0 && (
          <div className="upload-success">
            <CheckCircle size={24} />
            <p>{sourceData.length} records loaded</p>
          </div>
        )}
      </div>
      <div className="step-actions">
        <button onClick={() => setStep(1)} className="btn-secondary">
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="btn-primary"
          disabled={sourceData.length === 0}
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedConfigData = novaTabConfigs.find((c) => c.id === selectedConfig);
    const destinationFields = selectedConfigData
      ? Object.keys(selectedConfigData.fieldMappings)
      : [];

    return (
      <div className="migration-step">
        <h3>Step 3: Configure Mapping</h3>

        <div className="form-group">
          <label htmlFor="novatab-config">Select NovaTab Configuration</label>
          <select
            id="novatab-config"
            value={selectedConfig}
            onChange={(e) => {
              setSelectedConfig(e.target.value);
              const config = novaTabConfigs.find((c) => c.id === e.target.value);
              if (config) {
                setMappings(config.fieldMappings);
              }
            }}
          >
            <option value="">Choose a configuration...</option>
            {novaTabConfigs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.configName}
              </option>
            ))}
          </select>
        </div>

        {selectedConfig && (
          <div className="mapping-section">
            <h4>Field Mappings</h4>
            <div className="mapping-grid">
              {destinationFields.map((destField) => (
                <div key={destField} className="mapping-row">
                  <span className="dest-field">{destField}</span>
                  <ArrowRight size={20} />
                  <select
                    value={mappings[destField] || ''}
                    onChange={(e) =>
                      setMappings({ ...mappings, [destField]: e.target.value })
                    }
                  >
                    <option value="">Select source field...</option>
                    {sourceFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="step-actions">
          <button onClick={() => setStep(2)} className="btn-secondary">
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isSubmitting || !selectedConfig}
          >
            {isSubmitting ? 'Creating...' : 'Create Migration'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Migration</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="stepper">
          <div className={`stepper-item ${step >= 1 ? 'active' : ''}`}>
            <div className="stepper-number">1</div>
            <span>Basic Info</span>
          </div>
          <div className={`stepper-item ${step >= 2 ? 'active' : ''}`}>
            <div className="stepper-number">2</div>
            <span>Upload Data</span>
          </div>
          <div className={`stepper-item ${step >= 3 ? 'active' : ''}`}>
            <div className="stepper-number">3</div>
            <span>Mapping</span>
          </div>
        </div>

        <div className="modal-body">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}

