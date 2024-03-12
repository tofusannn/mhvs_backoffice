export type ITypeLesson = {
  id: number;
  lesson_name: string;
  lesson_description: string;
  language: string;
  questionnaire_cer_id: number;
  prominent_point: ITypeProminentPoint;
};

export type ITypeProminentPoint = [];

export type ITypeLessonBody = {
  lesson_id: number;
  lesson_name: string;
  lesson_description: string;
  language: string;
  questionnaire_cer_id: number;
  prominent_point: ITypeProminentPoint;
};
