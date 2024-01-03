import { ITypeQuestionCerBody } from "@/redux/question_cer/type";
import api from "../https_request";
import Cookies from "js-cookie";

const QuestionCerService = {
  getQuestionCerList() {
    const token = Cookies.get("token");
    return api.get({
      path: `/questionnaire_cer`,
      headers: { token: token },
    });
  },
  postQuestionCer(data: ITypeQuestionCerBody) {
    const token = Cookies.get("token");
    return api.post({
      path: `/questionnaire_cer`,
      body: data,
      headers: { token: token },
    });
  },
  deleteQuestionCer(id: number) {
    const token = Cookies.get("token");
    return api.delete({
      path: `/questionnaire_cer/${id}`,
      headers: { token: token },
    });
  },
};

export default QuestionCerService;
