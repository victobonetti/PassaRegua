export interface FeedbackProps {
    feedback: (isErr: boolean, text: string) => void;
    loading: (active: boolean) => void;
  }