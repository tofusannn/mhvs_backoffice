export type ITypeChapter = {
  index: number;
  lesson_id: number;
  chapter_name: string;
  chapter_pre_description: string;
  chapter_description: string;
  display: true;
  practical: false;
  pre_test: number;
  post_test: number;
  video: number;
  file: number;
  homework: number;
};

export type ITypePreTest = {
  name: string;
  description: string;
  test_id: number;
  test_type: string;
  display: true;
};

export type ITypePostTest = {
  name: string;
  description: string;
  test_id: number;
  test_type: string;
  display: true;
};

export type ITypeVideo = {
  name: string;
  description: string;
  display: true;
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
  name: string;
  description: string;
  display: false;
  file: [];
};

export type ITypeHomework = {
  name: string;
  description: string;
  display: false;
};
