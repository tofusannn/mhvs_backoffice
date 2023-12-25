import api from "./https_request";
import Cookies from "js-cookie";

const DashboardService = {
  waitApprove() {
    const token = Cookies.get("token");
    return api.get({
      path: `/dashboard_wait_approve`,
      headers: { token: token },
    });
  },
  approveCer() {
    const token = Cookies.get("token");
    return api.get({
      path: `/dashboard_approved_certificate`,
      headers: { token: token },
    });
  },
  visitingWeb() {
    const token = Cookies.get("token");
    return api.get({
      path: `/dashboard_visiting_web`,
      headers: { token: token },
    });
  },
};

export default DashboardService;
