export type ITypeUser = {
  id?: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  gender: string;
  nationality: string;
  pre_name: string;
  first_name: string;
  last_name: string;
  idcard: string;
  date_of_birth: string;
  img_id: number;
  create_datetime?: string;
  role?: string;
};

export type ITypeUserParams = {
  name: string;
  phone: string;
  start_date: string;
  end_date: string;
};
