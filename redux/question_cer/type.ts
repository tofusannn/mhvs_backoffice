export type ITypeQuestionCer = {
  id: number;
  name: string;
  description: string;
};

export type ITypeQuestionCerBody = {
  questionnaire_cer_id: number;
  name: string;
  description: string;
  question: {
    question: string;
    answer: {
      choice: string;
      is_input: boolean;
    }[];
  }[];
};
