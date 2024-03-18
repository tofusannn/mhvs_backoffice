import { ITypeApproveParams } from "@/redux/approve/types";
import api from "../https_request";
import Cookies from "js-cookie";

const ApproveService = {
  getApproveUserHomework(
    language: string,
    params: ITypeApproveParams | undefined
  ) {
    const token = Cookies.get("token");

    if (params) {
      return api.get({
        path: `/approve_user_homework/${language}?name=${params.name}&start_date=${params.start_date}&end_date=${params.end_date}`,
        headers: { token: token },
      });
    } else {
      return api.get({
        path: `/approve_user_homework/${language}`,
        headers: { token: token },
      });
    }
  },
  approveCertificate(data: { user_lesson_id: number }) {
    const token = Cookies.get("token");

    return api.post({
      path: `/approve_certificate`,
      body: data,
      headers: { token: token },
    });
  },
  newHomeworkAgain(data: { chapter_user_homework_id: number }) {
    const token = Cookies.get("token");

    return api.post({
      path: `/submit_new_homework`,
      body: data,
      headers: { token: token },
    });
  },
};

export default ApproveService;
