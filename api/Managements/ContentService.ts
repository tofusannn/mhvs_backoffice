import { ITypeContent } from "@/redux/content/types";
import api from "../https_request";
import Cookies from "js-cookie";

const ContentService = {
  postContent(data: ITypeContent) {
    const token = Cookies.get("token");

    return api.post({
      path: `/content`,
      body: data,
      headers: { token: token },
    });
  },
};

export default ContentService;
