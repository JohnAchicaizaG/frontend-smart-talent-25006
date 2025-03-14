export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt?: string;
}


export enum TaskFilter {
  All = 'all',
  Completed = 'completed',
  Pending = 'pending'
}
