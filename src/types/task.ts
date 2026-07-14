export type Priority= "low" | "medium" | "high";


export type Task = {
  _id: string; 
  title: string;
  completed: boolean;
  priority: Priority;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type FetchState =  {
  loading: boolean; 
  error: string | null;
}

