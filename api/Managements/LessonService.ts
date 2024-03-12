import { ITypeLesson, ITypeLessonBody } from "@/redux/lesson/types";
import api from "../https_request";
import Cookies from "js-cookie";

const LessonService = {
  postLesson(data: ITypeLessonBody) {
    const token = Cookies.get("token");

    return api.post({
      path: `/lesson`,
      body: data,
      headers: { token: token },
    });
  },
  getLessonList() {
    const token = Cookies.get("token");

    return api.get({
      path: `/lesson`,
      headers: { token: token },
    });
  },
  getLessonById(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/lesson/${id}`,
      headers: { token: token },
    });
  },
  putLessonById(id: number, data: ITypeLessonBody) {
    const token = Cookies.get("token");

    return api.put({
      path: `/lesson`,
      body: data,
      headers: { token: token },
    });
  },
  deleteLessonById(id: number) {
    const token = Cookies.get("token");

    return api.delete({
      path: `/lesson/${id}`,
      headers: { token: token },
    });
  },
  getProminentPoint(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/prominent-point`,
      headers: { token: token },
    });
  },
};

export default LessonService;
