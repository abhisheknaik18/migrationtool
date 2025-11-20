export interface User {
  id: string;
  email: string;
  fullName: string;
  company?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MigrationJob {
  id: string;
  name: string;
  sourceType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  createdAt: string;
  completedAt?: string;
}

export interface MigrationJobDetail extends MigrationJob {
  sourceData: any[];
  destinationConfig: {
    type: string;
    endpoint?: string;
    apiKey?: string;
  };
  mappingConfig: Record<string, string>;
  errorLog?: string;
}

export interface NovaTabConfig {
  id: string;
  configName: string;
  apiEndpoint: string;
  apiKey?: string;
  fieldMappings: Record<string, string>;
  isActive: boolean;
  createdAt: string;
}

