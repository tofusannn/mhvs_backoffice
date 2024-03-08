import { ITypeContentBody } from "@/redux/content/types";
import api from "../https_request";
import Cookies from "js-cookie";

const ContentService = {
  postContent(data: ITypeContentBody) {
    const token = Cookies.get("token");

    return api.post({
      path: `/content`,
      body: data,
      headers: { token: token },
    });
  },
  putContent(id: number, data: ITypeContentBody) {
    const token = Cookies.get("token");

    return api.put({
      path: `/content/${id}`,
      body: data,
      headers: { token: token },
    });
  },
  getAllContent(lg: string) {
    const token = Cookies.get("token");

    return api.get({
      path: `/all_content/${lg}`,
      headers: { token: token },
    });
  },
  getContentById(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/content/${id}`,
      headers: { token: token },
    });
  },
  deleteContent(id: number) {
    const token = Cookies.get("token");

    return api.delete({
      path: `/content/${id}`,
      headers: { token: token },
    });
  },
};

export default ContentService;
