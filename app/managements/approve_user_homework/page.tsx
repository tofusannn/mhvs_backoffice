"use client";

import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import { Edit, Delete, Visibility, ErrorOutline } from "@mui/icons-material";
import {
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Grid,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ITypeApprove, ITypeApproveParams } from "@/redux/approve/types";
import ApproveService from "@/api/Managements/ApproveService";
import ApproveModal from "@/components/modal/ApproveModal";
import Image from "next/image";
import dayjs from "dayjs";

const headCells = [
  {
    id: "user_id",
    label: "ID",
  },
  {
    id: "first_name",
    label: "Name",
  },
  {
    id: "lesson_name",
    label: "Lesson Name",
  },
  {
    id: "register_datetime",
    label: "Register Date",
  },
  {
    id: "create_datetime",
    label: "Question Date",
  },
];

const initialValues: ITypeApprove = {
  user_id: 0,
  first_name: "",
  lesson_id: 0,
  lesson_name: "",
  chapter_homework_id: 0,
  chapter_user_homework_id: 0,
  create_datetime: "",
  register_datetime: "",
  user_lesson_id: 0,
  description: "",
  link_photo1: "",
  link_photo2: "",
  link_photo3: "",
};

const languageList = [
  { label: "Thai", value: "th" },
  { label: "Myanmar", value: "mm" },
  { label: "Cambodia", value: "cd" },
  { label: "Laos", value: "ls" },
];

const ApproveUserHomeworkPage = () => {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [dataSearchList, setDataSearchList] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [detailsHomework, setDetailsHomework] =
    useState<ITypeApprove>(initialValues);
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [search, setSearch] = useState("th");
  const [searchParams, setSearchParams] = useState<ITypeApproveParams>({
    name: "",
    start_date: "",
    end_date: "",
  });
  async function getApproveUserHomeworkList(
    language: string,
    params?: ITypeApproveParams
  ) {
    let respons = await ApproveService.getApproveUserHomework(
      language,
      params
    ).then((res: any) => res);
    if (respons.status) {
      respons = respons.result.sort((a: ITypeApprove, b: ITypeApprove) => {
        return a.user_id - b.user_id;
      });
    }

    setDataList(respons);
    setDataSearchList(respons);
  }

  function openDialog(rows: any) {
    setDetailsHomework(rows);
    setOpen(true);
  }

  async function handleClick(type: string, id: number) {
    if (type === "approve") {
      let res = await ApproveService.approveCertificate({
        user_lesson_id: id,
      }).then((res: any) => res);
      if (res.status) {
        setOpen(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
    if (type === "notApprove") {
      let res = await ApproveService.newHomeworkAgain({
        chapter_user_homework_id: id,
      }).then((res: any) => res);
      if (res.status) {
        setOpen(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
  }

  useEffect(() => {
    const dataSlice = dataList.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setVisibleRows(dataSlice);
    setEmptyRows(
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0
    );
  }, [dataList, dataSearchList, page, rowsPerPage]);

  useEffect(() => {
    searchName({ target: { name: "language", value: "th" } });
  }, []);

  function searchName(e: any, nameDate?: string) {
    let name;
    let value;
    let obj = searchParams;
    let lg = search;
    if (e && e.target) {
      name = e.target.name;
      value = e.target.value;
      if (name === "search_name") {
        obj.name = value;
      } else {
        setSearch(e.target.value);
        lg = e.target.value;
      }
    } else {
      name = nameDate;
      value = e ? dayjs(e).format("YYYY-MM-DD") : "";
      if (name === "start_date") {
        obj.start_date = value;
      } else {
        obj.end_date = value;
      }
    }
    setSearchParams(obj);
    getApproveUserHomeworkList(lg, searchParams);
  }

  return (
    <div>
      <HeaderText title="Approve User Homework" />
      <DataTable
        countData={dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchFunction={searchName}
        type={"approve"}
        languageList={languageList}
        searchValue={search}
        type2={"approve"}
      >
        <TableBody>
          {visibleRows.map((row: ITypeApprove, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.user_id}>
                <TableCell>{row.user_id}</TableCell>
                <TableCell>{row.first_name}</TableCell>
                <TableCell>{row.lesson_name}</TableCell>
                <TableCell>
                  {dayjs(row.register_datetime).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {dayjs(row.create_datetime).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Button
                    sx={{ boxShadow: "none" }}
                    variant="contained"
                    onClick={() => openDialog(row)}
                  >
                    ตรวจการบ้าน
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 53 * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </DataTable>
      <ApproveModal open={open} setOpen={setOpen}>
        <Grid sx={{ marginBottom: 3 }}>
          <Typography sx={{ marginBottom: 3 }} fontSize={24} fontWeight={500}>
            บทเรียน: {detailsHomework.lesson_name}
          </Typography>
          <Typography sx={{ marginBottom: 3 }} fontSize={24} fontWeight={500}>
            ชื่อจริง: {detailsHomework.first_name}
          </Typography>
          <Stack direction={"row"} spacing={3} my={5}>
            <Typography sx={{ marginBottom: 3 }} fontSize={24} fontWeight={500}>
              รูปที่ 1:
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: 700,
                height: 500,
              }}
            >
              <Image
                objectFit="contain"
                src={detailsHomework.link_photo1}
                alt={""}
                fill
              />
            </Box>
          </Stack>
          <Stack direction={"row"} spacing={3} my={5}>
            <Typography sx={{ marginBottom: 3 }} fontSize={24} fontWeight={500}>
              รูปที่ 2:
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: 700,
                height: 500,
              }}
            >
              <Image
                objectFit="contain"
                src={detailsHomework.link_photo2}
                alt={""}
                fill
              />
            </Box>
          </Stack>
          <Stack direction={"row"} spacing={3} my={5}>
            <Typography sx={{ marginBottom: 3 }} fontSize={24} fontWeight={500}>
              รูปที่ 3:
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: 700,
                height: 500,
              }}
            >
              <Image
                objectFit="contain"
                src={detailsHomework.link_photo3}
                alt={""}
                fill
              />
            </Box>
          </Stack>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                handleClick(
                  "notApprove",
                  detailsHomework.chapter_user_homework_id
                );
              }}
            >
              ยังไม่ผ่าน
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                handleClick("approve", detailsHomework.user_lesson_id);
              }}
            >
              ผ่านแล้ว
            </Button>
          </Grid>
        </Grid>
      </ApproveModal>
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </div>
  );
};

export default ApproveUserHomeworkPage;
