import { ITypeAuth } from "./../redux/auth/types";
import api from "./https_request";
import Cookies from "js-cookie";

const AuthService = {
  login(data: ITypeAuth) {
    const token = Cookies.get("token");

    return api.post({
      path: `/login`,
      body: data,
      headers: { token: token },
    });
  },
  logout() {
    const token = Cookies.get("token");

    return api.get({
      path: `/logout`,
      headers: { token: token },
    });
  },
};

export default AuthService;
