import { ITypeChapter } from "@/redux/chapter/types";
import api from "../https_request";
import Cookies from "js-cookie";

const ChapterService = {
  postChapter(data: ITypeChapter) {
    const token = Cookies.get("token");

    return api.post({
      path: `/chapter`,
      body: data,
      headers: { token: token },
    });
  },
  getChapterByLessonId(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/chapter/${id}`,
      headers: { token: token },
    });
  },
  getChapterById(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/chapter/${id}`,
      headers: { token: token },
    });
  },
  putChapterById(id: number, data: ITypeChapter) {
    const token = Cookies.get("token");

    return api.put({
      path: `/chapter/${id}`,
      body: data,
      headers: { token: token },
    });
  },
  deleteChapterById(id: number) {
    const token = Cookies.get("token");

    return api.delete({
      path: `/chapter/${id}`,
      headers: { token: token },
    });
  },
};

export default ChapterService;
