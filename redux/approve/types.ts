export type ITypeApprove = {
  user_id: number;
  first_name: string;
  lesson_id: number;
  lesson_name: string;
  chapter_homework_id: number;
  chapter_user_homework_id: number;
  create_datetime: string;
  register_datetime: string;
  user_lesson_id: number;
  description: string;
  link_photo1: string;
  link_photo2: string;
  link_photo3: string;
};

export type ITypeApproveParams = {
  name: string;
  start_date: string;
  end_date: string;
};
