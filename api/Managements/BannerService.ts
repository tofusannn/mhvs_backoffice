import { ITypeBannerBody } from "@/redux/banner/types";
import api from "../https_request";
import Cookies from "js-cookie";

const BannerService = {
  postBanner(data: ITypeBannerBody) {
    const token = Cookies.get("token");

    return api.post({
      path: `/banner`,
      body: data,
      headers: { token: token },
    });
  },
  putBanner(id: number, data: ITypeBannerBody) {
    const token = Cookies.get("token");

    return api.put({
      path: `/banner/active/${id}`,
      body: { active: data.active },
      headers: { token: token },
    });
  },
  getAllBanner(lg: string) {
    const token = Cookies.get("token");

    return api.get({
      path: `/all_banner/${lg}`,
      headers: { token: token },
    });
  },
  getBannerById(id: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/banner/${id}`,
      headers: { token: token },
    });
  },
  deleteBanner(id: number) {
    const token = Cookies.get("token");

    return api.delete({
      path: `/banner/${id}`,
      headers: { token: token },
    });
  },
};

export default BannerService;
