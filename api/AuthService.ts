import { ITypeAuth } from "./../redux/auth/types";
import api from "./https_request";

const AuthService = {
  login(data: ITypeAuth) {
    return api.post({
      path: `/login`,
      body: data,
    });
  },
  logout() {
    return api.get({
      path: `/logout`,
    });
  },
};

export default AuthService;
