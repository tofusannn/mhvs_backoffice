export type ITypeLesson = {
  id: number;
  img_id: number;
  lesson_name: string;
  lesson_description: string;
  language: string;
  questionnaire_cer_id: number;
  prominent_point: ITypeProminentPoint;
  active: boolean;
  file_path: string;
};

export type ITypeProminentPoint = {
  index: number;
  name: string;
  description: string;
  img_id?: number;
  file_path?: string;
}[];

export type ITypeLessonBody = {
  img_id: number;
  lesson_id: number;
  lesson_name: string;
  lesson_description: string;
  language: string;
  questionnaire_cer_id: number;
  prominent_point: ITypeProminentPoint;
  active: boolean;
};
