export type ITypeLesson = {
  id: number;
  lesson_name: string;
  lesson_description: string;
  language: string;
  prominent_point: ITypeProminentPoint;
};

export type ITypeProminentPoint = [
  {
    index: number;
    name: string;
    description: string;
    img_id: number;
  }
];
