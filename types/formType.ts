export type FormType = {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  questions: {
    id: number;
    label: string;
    type: 'text' | 'radio' | 'checkbox';
    options?: {
      id: number;
      text: string;
    }[];
  }[];
  responses: {
    id: number;
    submittedAt: string;
    answers: {
      id: number;
      responseId: number;
      questionId: number;
      optionId: number;
      text: string;
    }[];
  }[]
}