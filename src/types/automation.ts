
export interface AutomationConfig {
  enabled: boolean;
  interval: number;
  tasks: AutomationTask[];
}

export interface AutomationTask {
  name: string;
  type: 'security' | 'performance' | 'quality' | 'dependencies';
  schedule: string;
  enabled: boolean;
}

export interface AutomationResult {
  success: boolean;
  message: string;
  timestamp: Date;
  details?: any;
}
