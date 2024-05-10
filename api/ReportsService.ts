import {
  ITypeUser,
  ITypeUserAns,
  ITypeUserLesson,
  ITypeUserQus,
} from "@/redux/reports/types";
import api from "./https_request";
import Cookies from "js-cookie";

const ReportsService = {
  downloadFileUser(query: ITypeUser) {
    const token = Cookies.get("token");

    return api.get({
      path: `/download_file_user?start_date=${query.start_date}&end_date=${query.end_date}`,
      headers: { token: token },
    });
  },
  downloadFileUserAns(query: ITypeUserAns) {
    const token = Cookies.get("token");

    return api.get({
      path: `/download_file_user_answer?start_date=${query.start_date}&end_date=${query.end_date}&quiz_type=${query.quiz_type}&lesson_id=${query.lesson_id}`,
      headers: { token: token },
    });
  },
  downloadFileUserLesson(query: ITypeUserLesson) {
    const token = Cookies.get("token");

    return api.get({
      path: `/download_file_user_lesson?start_date=${query.start_date}&end_date=${query.end_date}&lesson_id=${query.lesson_id}`,
      headers: { token: token },
    });
  },
  downloadFileUserQus(query: ITypeUserQus) {
    const token = Cookies.get("token");

    return api.get({
      path: `/download_file_user_questionnaire?start_date=${query.start_date}&end_date=${query.end_date}&lesson_id=${query.lesson_id}`,
      headers: { token: token },
    });
  },
};

export default ReportsService;
