import { ITypeUser, ITypeUserParams } from "./../../redux/user/types";
import api from "../https_request";
import Cookies from "js-cookie";

const UserService = {
  postUser(data: ITypeUser) {
    const token = Cookies.get("token");

    return api.post({
      path: `/user`,
      body: data,
      headers: { token: token },
    });
  },
  getUserList(params: ITypeUserParams | undefined) {
    const token = Cookies.get("token");

    if (params) {
      return api.get({
        path: `/user?name=${params.name}&phone=${params.phone}&start_date=${params.start_date}&end_date=${params.end_date}`,
        headers: { token: token },
      });
    } else {
      return api.get({
        path: `/user`,
        headers: { token: token },
      });
    }
  },
  getUserById(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/user/${id}`,
      headers: { token: token },
    });
  },
  putUserById(id: number, data: ITypeUser) {
    const token = Cookies.get("token");

    return api.put({
      path: `/user/${id}`,
      body: data,
      headers: { token: token },
    });
  },
  deleteUserById(id: number) {
    const token = Cookies.get("token");

    return api.delete({
      path: `/user/${id}`,
      headers: { token: token },
    });
  },

  postUserAdmin(data: { phone: string; password: string }) {
    return api.post({
      path: `/user`,
      body: data,
    });
  },
};

export default UserService;
