export type ITypeChapter = {
  index: number;
  lesson_id: number;
  chapter_name: string;
  chapter_pre_description: string;
  chapter_description: string;
  display: true;
  practical: false;
  pre_test: ITypePreTest;
  post_test: ITypePostTest;
  video: ITypeVideo;
  // file: ITypeFile;
  homework: ITypeHomework;
};

export type ITypePreTest = {
  id: number;
  name: string;
  description: string;
  test_id: number;
  test_type: string;
  display: boolean;
  user_action: boolean;
};

export type ITypePostTest = {
  id: number;
  name: string;
  description: string;
  test_id: number;
  test_type: string;
  display: boolean;
  user_action: boolean;
};

export type ITypeVideo = {
  id: number;
  name: string;
  description: string;
  display: boolean;
  user_action: boolean;
  link: [
    {
      index: number;
      name: string;
      description: string;
      link: string;
    }
  ];
};

export type ITypeFile = {
  id: number;
  name: string;
  description: string;
  display: boolean;
  user_action: boolean;
  file: [];
};

export type ITypeHomework = {
  id: number;
  name: string;
  description: string;
  display: boolean;
  user_action: boolean;
};
