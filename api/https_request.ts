var axios = require("axios");
const url = "http://116.204.182.19:8000/admin/v1";

type ITypeApi = {
  path: string;
  headers?: any;
  body?: any;
};

const api = {
  async post({ path, headers, body }: ITypeApi) {
    var config = {
      method: "post",
      url: `${url}${path}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      data: body,
    };
    let payload;
    await axios(config)
      .then(function (response: { data: any }) {
        payload = response.data;
      })
      .catch(function (error: any) {
        console.log(error);
      });
    return payload;
  },

  async get({ path, headers, body }: ITypeApi) {
    var config = {
      method: "get",
      url: `${url}${path}`,
      headers: { accept: "application/json", ...headers },
      data: body,
    };
    let payload;
    await axios(config)
      .then(function (response: { data: any }) {
        payload = response.data;
      })
      .catch(function (error: any) {
        console.log(error);
      });
    return payload;
  },

  async put({ path, headers, body }: ITypeApi) {
    var config = {
      method: "put",
      url: `${url}${path}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      data: body,
    };
    let payload;
    await axios(config)
      .then(function (response: { data: any }) {
        payload = response.data;
      })
      .catch(function (error: any) {
        console.log(error);
      });
    return payload;
  },

  async delete({ path, headers, body }: ITypeApi) {
    var config = {
      method: "delete",
      url: `${url}${path}`,
      headers: { accept: "application/json", ...headers },
      data: body,
    };
    let payload;
    await axios(config)
      .then(function (response: { data: any }) {
        payload = response.data;
      })
      .catch(function (error: any) {
        console.log(error);
      });
    return payload;
  },

  async upload({ path, headers, body }: ITypeApi) {
    var formData = new FormData();
    formData.append("file", body);
    var config = {
      method: "post",
      url: `${url}${path}`,
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      data: formData,
    };
    let payload;
    await axios(config)
      .then(function (response: { data: any }) {
        payload = response.data;
      })
      .catch(function (error: any) {
        console.log(error);
      });
    return payload;
  },
};

export default api;
