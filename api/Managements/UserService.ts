import { ITypeUser } from "./../../redux/user/types";
import api from "../https_request";

const UserService = {
  postUser(data: ITypeUser) {
    return api.post({
      path: `/user`,
      body: data,
    });
  },
  getUserList() {
    return api.get({
      path: `/user`,
    });
  },
  getUserById(id: string) {
    return api.get({
      path: `/user/${id}`,
    });
  },
  putUserById(id: string, data: ITypeUser) {
    return api.put({
      path: `/user/${id}`,
      body: data,
    });
  },
  deleteUserById(id: string) {
    return api.delete({
      path: `/user/${id}`,
    });
  },
};

export default UserService;
