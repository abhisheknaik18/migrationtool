import { useState, useEffect } from 'react';
import { novatabApi } from '../lib/api';
import type { NovaTabConfig } from '../types';
import { X, Plus, Trash2, TestTube, Save } from 'lucide-react';

interface NovaTabSettingsProps {
  onClose: () => void;
}

export default function NovaTabSettings({ onClose }: NovaTabSettingsProps) {
  const [configs, setConfigs] = useState<NovaTabConfig[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    configName: '',
    apiEndpoint: 'https://restaurant.novatab.com/api',
    apiKey: '',
    fieldMappings: {} as Record<string, string>,
  });
  const [mappingFields, setMappingFields] = useState<Array<{ source: string; dest: string }>>([
    { source: '', dest: '' },
  ]);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const data = await novatabApi.getConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Failed to load configs:', error);
    }
  };

  const handleAddMapping = () => {
    setMappingFields([...mappingFields, { source: '', dest: '' }]);
  };

  const handleRemoveMapping = (index: number) => {
    setMappingFields(mappingFields.filter((_, i) => i !== index));
  };

  const handleMappingChange = (index: number, field: 'source' | 'dest', value: string) => {
    const newMappings = [...mappingFields];
    newMappings[index][field] = value;
    setMappingFields(newMappings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert mappings array to object
    const mappings: Record<string, string> = {};
    mappingFields.forEach((mapping) => {
      if (mapping.source && mapping.dest) {
        mappings[mapping.dest] = mapping.source;
      }
    });

    try {
      await novatabApi.createConfig({
        ...formData,
        fieldMappings: mappings,
      });
      setShowForm(false);
      setFormData({
        configName: '',
        apiEndpoint: 'https://restaurant.novatab.com/api',
        apiKey: '',
        fieldMappings: {},
      });
      setMappingFields([{ source: '', dest: '' }]);
      loadConfigs();
    } catch (error) {
      console.error('Failed to create config:', error);
      alert('Failed to create configuration');
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;

    try {
      await novatabApi.deleteConfig(id);
      loadConfigs();
    } catch (error) {
      console.error('Failed to delete config:', error);
    }
  };

  const handleTestConnection = async (id: string) => {
    try {
      const result = await novatabApi.testConnection(id);
      alert(result.message);
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('Connection test failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>NovaTab Settings</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {!showForm ? (
            <>
              <div className="content-header">
                <h3>Saved Configurations</h3>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  <Plus size={20} />
                  New Configuration
                </button>
              </div>

              {configs.length === 0 ? (
                <div className="empty-state">
                  <p>No NovaTab configurations yet</p>
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Create Your First Configuration
                  </button>
                </div>
              ) : (
                <div className="config-list">
                  {configs.map((config) => (
                    <div key={config.id} className="config-card">
                      <div className="config-header">
                        <h4>{config.configName}</h4>
                        <div className="config-actions">
                          <button
                            onClick={() => handleTestConnection(config.id)}
                            className="btn-icon"
                            title="Test Connection"
                          >
                            <TestTube size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="btn-icon error"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="config-info">
                        <p>
                          <strong>Endpoint:</strong> {config.apiEndpoint}
                        </p>
                        <p>
                          <strong>Fields:</strong>{' '}
                          {Object.keys(config.fieldMappings).length} mapped
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="config-form">
              <h3>New NovaTab Configuration</h3>

              <div className="form-group">
                <label htmlFor="configName">Configuration Name</label>
                <input
                  type="text"
                  id="configName"
                  value={formData.configName}
                  onChange={(e) =>
                    setFormData({ ...formData, configName: e.target.value })
                  }
                  placeholder="My NovaTab Config"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apiEndpoint">API Endpoint</label>
                <input
                  type="url"
                  id="apiEndpoint"
                  value={formData.apiEndpoint}
                  onChange={(e) =>
                    setFormData({ ...formData, apiEndpoint: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apiKey">API Key</label>
                <input
                  type="text"
                  id="apiKey"
                  value={formData.apiKey}
                  onChange={(e) =>
                    setFormData({ ...formData, apiKey: e.target.value })
                  }
                  placeholder="Your NovaTab API Key"
                  required
                />
              </div>

              <div className="form-group">
                <label>Field Mappings (NovaTab Field → Source Field)</label>
                <div className="mappings-list">
                  {mappingFields.map((mapping, index) => (
                    <div key={index} className="mapping-input-row">
                      <input
                        type="text"
                        value={mapping.dest}
                        onChange={(e) =>
                          handleMappingChange(index, 'dest', e.target.value)
                        }
                        placeholder="NovaTab field (e.g., customer_name)"
                      />
                      <span>→</span>
                      <input
                        type="text"
                        value={mapping.source}
                        onChange={(e) =>
                          handleMappingChange(index, 'source', e.target.value)
                        }
                        placeholder="Source field"
                      />
                      {mappingFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMapping(index)}
                          className="btn-icon error"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddMapping}
                  className="btn-secondary small"
                >
                  <Plus size={16} />
                  Add Mapping
                </button>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={20} />
                  Save Configuration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

