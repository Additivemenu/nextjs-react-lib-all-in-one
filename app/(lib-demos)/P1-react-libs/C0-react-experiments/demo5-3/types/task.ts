// src/types/task.ts
export interface Task {
    id: string;
    status: string;
    created_at: string;
}

export interface TaskEvent {
    task_id: string;
    subtask_name: string;
    status: string;
    progress?: number;
    message?: string;
}