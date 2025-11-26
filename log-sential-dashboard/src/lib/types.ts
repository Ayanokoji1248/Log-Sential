
export interface LogEvent {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'CRITICAL';
  source: 'EXPRESS' | 'MONGO' | 'REACT' | 'SYSTEM';
  message: string;
}

export interface ChartDataPoint {
  time: string;
  requests: number;
  threats: number;
}

export interface Project {
  id: string;
  name: string;
  apiKey: string;
  createdAt: string;
  status: 'active' | 'inactive';
}