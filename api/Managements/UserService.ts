import { ITypeUser } from "./../../redux/user/types";
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
  getUserList() {
    const token = Cookies.get("token");

    return api.get({
      path: `/user`,
      headers: { token: token },
    });
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
};

export default UserService;
