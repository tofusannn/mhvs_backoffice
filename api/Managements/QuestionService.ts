import { ITypeQuestionBody } from "@/redux/question/type";
import api from "../https_request";
import Cookies from "js-cookie";

const QuestionService = {
  getQuestionList() {
    const token = Cookies.get("token");
    return api.get({
      path: `/question_detail`,
      headers: { token: token },
    });
  },
  postQuestion(data: ITypeQuestionBody) {
    const token = Cookies.get("token");
    return api.post({
      path: `/question`,
      body: data,
      headers: { token: token },
    });
  },
  deleteQuestion(id: number) {
    const token = Cookies.get("token");
    return api.delete({
      path: `/question_detail/${id}`,
      headers: { token: token },
    });
  },
};

export default QuestionService;
