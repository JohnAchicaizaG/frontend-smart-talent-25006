export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt?: string;
}
