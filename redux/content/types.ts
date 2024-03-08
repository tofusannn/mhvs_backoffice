export type ITypeContent = {
  id: number;
  index: number;
  content_name: string;
  content_detail: string;
  youtube_link: string;
  datetime: string;
  language: string;
  file_path: string;
};

export type ITypeContentBody = {
  content_name: string;
  content_detail: string;
  youtube_link: string;
  img_id: number;
  language: string;
};
