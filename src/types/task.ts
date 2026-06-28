export type Task = {
  id: number;
  title: string;
  completed: boolean;
}

export type FetchState =  {
  loading: boolean; 
  error: string | null;
}