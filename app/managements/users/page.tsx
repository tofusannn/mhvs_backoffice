"use client";

import UserService from "@/api/Managements/UserService";
import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import React, { useEffect, useState } from "react";

const UserManagementsPage = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getAllUserList();
  }, []);

  function getAllUserList() {
    UserService.getUserList().then((res: any) => {
      if (res.msg === "success") {
        setDataList(res.result);
      }
    });
  }

  return (
    <div>
      <HeaderText title="UserManagements" />
      <DataTable dataList={dataList} />
    </div>
  );
};

export default UserManagementsPage;
