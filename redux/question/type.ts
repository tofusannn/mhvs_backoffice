export type ITypeQuestion = {
  id: number;
  name: string;
  description: string;
};

export type ITypeQuestionBody = {
  name: string;
  description: string;
  estimate_score_pre: number;
  estimate_score_quiz: number;
  question: {
    question: string;
    answer: {
      choice: string;
      score: number;
      is_true: boolean;
      is_input: boolean;
    }[];
  }[];
};
