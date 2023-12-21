"use client";

import * as yup from "yup";
import ChapterService from "@/api/Managements/ChapterService";
import Toast from "@/components/common/Toast";
import DModal from "@/components/modal/DModal";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeChapter } from "@/redux/chapter/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DataTable from "@/components/table/DataTable";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import CUModal from "@/components/modal/CUModal";
import { ITypeLesson } from "@/redux/lesson/types";
import LessonService from "@/api/Managements/LessonService";

const headCells = [
  {
    id: "index",
    label: "ID",
  },
  {
    id: "chapter_name",
    label: "Name",
  },
  {
    id: "chapter_pre_description",
    label: "Description",
  },
  {
    id: "lesson_id",
    label: "Lesson Id",
  },
];

const initialValues: ITypeChapter = {
  index: 0,
  chapter_name: "",
  chapter_description: "",
  lesson_id: 0,
  chapter_pre_description: "",
  display: true,
  practical: false,
  pre_test: 0,
  post_test: 0,
  video: 0,
  file: 0,
  homework: 0,
};

const ChapterManagementsPage = () => {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [dataSearchList, setDataSearchList] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [type, setType] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [search, setSearch] = useState("");
  const [lessonList, setLessonList] = useState([]);

  useEffect(() => {
    getAllLessonList();
  }, []);

  async function getAllLessonList() {
    let respons = await LessonService.getLessonList().then((res: any) => res);
    if (respons.status) {
      respons = respons.result.sort((a: ITypeLesson, b: ITypeLesson) => {
        return a.id - b.id;
      });
    } else {
      alert("Token Expire");
      Cookies.set("token", "");
      router.push("/auth");
    }
    setLessonList(respons);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else if (params === "edit") {
      const fields = [
        "id",
        "chapter_name",
        "chapter_pre_description",
        "lesson_id",
      ];
      fields.forEach((field) => setFieldValue(field, rows[field], false));
      setType(params);
      setOpen(true);
    } else {
      setType(params);
      setOpen(true);
    }
  }

  function deleteChapter() {
    ChapterService.deleteChapterById(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        location.reload();
      } else {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  const validationSchema = yup.object({
    chapter_name: yup.string().required("Chapter Name is required"),
    chapter_description: yup
      .string()
      .required("Chapter Description is required"),
    lesson_id: yup.string().required("Lesson Id is required"),
    pre_test: yup.string().required("pre_test Id is required"),
    post_test: yup.string().required("post_test Id is required"),
    video: yup.string().required("video Id is required"),
    file: yup.string().required("file Id is required"),
    homework: yup.string().required("homework Id is required"),
  });

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (type === "edit") {
        ChapterService.putChapterById(values.index, values).then((res: any) => {
          if (res.msg === "success") {
            setOpen(false);
            setOpenToast(true);
            setToastData({ msg: res.msg, status: true });
            location.reload();
          } else {
            setOpenToast(true);
            setToastData({ msg: res.msg, status: false });
          }
        });
      } else {
        ChapterService.postChapter(values).then((res: any) => {
          if (res.msg === "success") {
            setOpen(false);
            setOpenToast(true);
            setToastData({ msg: res.msg, status: true });
            location.reload();
          } else {
            setOpenToast(true);
            setToastData({ msg: res.msg, status: false });
          }
        });
      }
    },
  });

  useEffect(() => {
    if (search != "") {
      const dataSlice = dataSearchList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setVisibleRows(dataSlice);
      setEmptyRows(
        page > 0
          ? Math.max(0, (1 + page) * rowsPerPage - dataSearchList.length)
          : 0
      );
    } else {
      const dataSlice = dataList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setVisibleRows(dataSlice);
      setEmptyRows(
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0
      );
    }
  }, [dataList, dataSearchList, page, rowsPerPage, search]);

  async function searchName(e: any) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "search_name") {
      const newData = dataList.filter((i: ITypeChapter) =>
        i.chapter_name.startsWith(value)
      );
      setDataSearchList(newData);
    } else {
      let respons = await ChapterService.getChapterByLessonId(value).then(
        (res: any) => res
      );
      if (respons.status) {
        respons = respons.result.sort((a: ITypeLesson, b: ITypeLesson) => {
          return a.id - b.id;
        });
      } else {
        alert("Token Expire");
        Cookies.set("token", "");
        router.push("/auth");
      }
      setDataList(respons);
      setDataSearchList(respons);
    }
    setSearch(value);
  }

  return (
    <div>
      <HeaderText title="Chapter Managements" />
      <DataTable
        countData={search != "" ? dataSearchList.length : dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchFunction={searchName}
        type={"chapter"}
        lessonList={lessonList}
      >
        <TableBody>
          {visibleRows.map((row: ITypeChapter, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.index}>
                <TableCell>{row.index}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.chapter_name}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.chapter_pre_description}
                </TableCell>
                <TableCell>{row.lesson_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openDialog("edit", row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => openDialog("delete", row)}>
                    <Delete />
                  </IconButton>
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
      <CUModal
        open={open}
        setOpen={setOpen}
        type={type}
        title={"Chapter"}
        resetForm={resetForm}
      >
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container gap={2}>
              <Grid container justifyContent={"space-between"}>
                <TextField
                  sx={{ display: "none" }}
                  id="id"
                  name="id"
                  value={values.index}
                  onChange={handleChange}
                ></TextField>
                <Typography>
                  ชื่อบท<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="chapter_name"
                  name="chapter_name"
                  sx={{ width: "50%" }}
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={values.chapter_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.chapter_name && Boolean(errors.chapter_name)}
                  helperText={
                    touched.chapter_name &&
                    Boolean(errors.chapter_name) &&
                    errors.chapter_name
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  รายละเอียด<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="chapter_pre_description"
                  name="chapter_pre_description"
                  sx={{ width: "50%" }}
                  multiline
                  rows={10}
                  fullWidth
                  size="small"
                  value={values.chapter_pre_description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.chapter_pre_description &&
                    Boolean(errors.chapter_pre_description)
                  }
                  helperText={
                    touched.chapter_pre_description &&
                    Boolean(errors.chapter_pre_description) &&
                    errors.chapter_pre_description
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  บทเรียน<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="lesson_id"
                  name="lesson_id"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.lesson_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lesson_id && Boolean(errors.lesson_id)}
                  helperText={
                    touched.lesson_id &&
                    Boolean(errors.lesson_id) &&
                    errors.lesson_id
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  pre_test<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="pre_test"
                  name="pre_test"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.pre_test}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.pre_test && Boolean(errors.pre_test)}
                  helperText={
                    touched.pre_test &&
                    Boolean(errors.pre_test) &&
                    errors.pre_test
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  post_test<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="post_test"
                  name="post_test"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.post_test}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.post_test && Boolean(errors.post_test)}
                  helperText={
                    touched.post_test &&
                    Boolean(errors.post_test) &&
                    errors.post_test
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  video<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="lesson_id"
                  name="lesson_id"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.lesson_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lesson_id && Boolean(errors.lesson_id)}
                  helperText={
                    touched.lesson_id &&
                    Boolean(errors.lesson_id) &&
                    errors.lesson_id
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  file<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="lesson_id"
                  name="lesson_id"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.lesson_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lesson_id && Boolean(errors.lesson_id)}
                  helperText={
                    touched.lesson_id &&
                    Boolean(errors.lesson_id) &&
                    errors.lesson_id
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  homework<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="lesson_id"
                  name="lesson_id"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.lesson_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lesson_id && Boolean(errors.lesson_id)}
                  helperText={
                    touched.lesson_id &&
                    Boolean(errors.lesson_id) &&
                    errors.lesson_id
                  }
                ></TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", paddingY: 3 }}>
            <Button type="submit" variant="contained" sx={{ width: 345 }}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </CUModal>
      <DModal
        open={openDelete}
        setOpen={setOpenDelete}
        confirm={deleteChapter}
      />
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </div>
  );
};

export default ChapterManagementsPage;
