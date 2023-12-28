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
};

export default QuestionService;
