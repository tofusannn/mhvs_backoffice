import api from "./https_request";
import Cookies from "js-cookie";

const FileService = {
  uploadFile(data: any) {
    const token = Cookies.get("token");
    return api.upload({
      path: `/file`,
      body: data,
      headers: { token: token },
    });
  },
  getFileById(fileId: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/file/${fileId}`,
      headers: { token: token },
    });
  },
  downloadFileById(fileId: number) {
    const token = Cookies.get("token");

    return api.get({
      path: `/download_file/${fileId}`,
      headers: { token: token },
    });
  },
};

export default FileService;
