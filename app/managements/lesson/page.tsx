"use client";

import * as yup from "yup";
import LessonService from "@/api/Managements/LessonService";
import Toast from "@/components/common/Toast";
import DModal from "@/components/modal/DModal";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeLesson, ITypeLessonBody } from "@/redux/lesson/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DataTable from "@/components/table/DataTable";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import CUModal from "@/components/modal/CUModal";

const headCells = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "lesson_name",
    label: "Name",
  },
  {
    id: "lesson_description",
    label: "Description",
  },
  {
    id: "language",
    label: "Language",
  },
];

const initialValues: ITypeLessonBody = {
  lesson_id: 0,
  lesson_name: "",
  lesson_description: "",
  language: "",
  questionnaire_cer_id: 0,
  prominent_point: [],
  active: false,
};

const languageItems = [
  { value: "th", label: "Thai" },
  { value: "mm", label: "Myanmar" },
  { value: "cd", label: "Cambodia" },
  { value: "ls", label: "Laos" },
];

const LessonManagementsPage = () => {
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

  useEffect(() => {
    getAllLessonList();
  }, []);

  async function getAllLessonList() {
    let respons = await LessonService.getLessonList().then((res: any) => res);
    if (respons.status) {
      respons = respons.result.sort((a: ITypeLesson, b: ITypeLesson) => {
        return a.id - b.id;
      });
    }

    setDataList(respons);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else if (params === "edit") {
      const fields = [
        "lesson_name",
        "lesson_description",
        "language",
        "active",
      ];
      fields.forEach((field) => setFieldValue("lesson_id", rows["id"], false));
      fields.forEach((field) => setFieldValue(field, rows[field], false));
      setType(params);
      setOpen(true);
    } else {
      setType(params);
      setOpen(true);
    }
  }

  function deleteLesson() {
    LessonService.deleteLessonById(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        getAllLessonList();
        // location.reload();
      } else {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  const validationSchema = yup.object({
    lesson_name: yup.string().required("โปรดระบุ"),
    lesson_description: yup.string().required("โปรดระบุ"),
    language: yup.string().required("โปรดระบุ"),
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
        console.log(values);

        LessonService.putLessonById(values.lesson_id, values).then(
          (res: any) => {
            if (res.msg === "success") {
              setOpen(false);
              setOpenToast(true);
              setToastData({ msg: res.msg, status: true });
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              setOpenToast(true);
              setToastData({ msg: res.msg, status: false });
            }
          }
        );
      } else {
        LessonService.postLesson(values).then((res: any) => {
          if (res.msg === "success") {
            setOpen(false);
            setOpenToast(true);
            setToastData({ msg: res.msg, status: true });
            setTimeout(() => {
              location.reload();
            }, 1000);
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

  function searchName(e: any) {
    const name = e.target.value;
    const newData = dataList.filter((i: ITypeLesson) =>
      i.lesson_name.startsWith(name)
    );
    setSearch(name);
    setDataSearchList(newData);
  }

  function getLanguage(lg: string) {
    let newLanguage;
    switch (lg) {
      case "th":
        newLanguage = "Thai";
        break;
      case "mm":
        newLanguage = "Myanmar";
        break;
      case "cd":
        newLanguage = "Cambodia";
        break;
      case "ls":
        newLanguage = "Laos";
        break;
    }
    return newLanguage;
  }

  return (
    <div>
      <HeaderText title="Lesson Managements" />
      <DataTable
        countData={search != "" ? dataSearchList.length : dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchFunction={searchName}
      >
        <TableBody>
          {visibleRows.map((row: ITypeLesson, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.lesson_name}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.lesson_description}
                </TableCell>
                <TableCell>{getLanguage(row.language)}</TableCell>
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
        title={"Lesson"}
        resetForm={resetForm}
      >
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container gap={2}>
              <Grid container justifyContent={"space-between"}>
                <TextField
                  sx={{ display: "none" }}
                  id="lesson_id"
                  name="lesson_id"
                  value={values.lesson_id}
                  onChange={handleChange}
                ></TextField>
                <Typography>
                  ชื่อบทเรียน<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="lesson_name"
                  name="lesson_name"
                  sx={{ width: "50%" }}
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={values.lesson_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lesson_name && Boolean(errors.lesson_name)}
                  helperText={
                    touched.lesson_name &&
                    Boolean(errors.lesson_name) &&
                    errors.lesson_name
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  รายละเอียด<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="lesson_description"
                  name="lesson_description"
                  sx={{ width: "50%" }}
                  multiline
                  rows={10}
                  fullWidth
                  size="small"
                  value={values.lesson_description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.lesson_description &&
                    Boolean(errors.lesson_description)
                  }
                  helperText={
                    touched.lesson_description &&
                    Boolean(errors.lesson_description) &&
                    errors.lesson_description
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  ภาษา<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  select
                  id="language"
                  name="language"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.language}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.language && Boolean(errors.language)}
                  helperText={
                    touched.language &&
                    Boolean(errors.language) &&
                    errors.language
                  }
                >
                  {languageItems.map(
                    (option: { value: string; label: string }) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  สถานะ<span style={{ color: "red" }}>*</span>
                </Typography>
                <Box display={"flex"} alignItems={"center"}>
                  <Typography fontWeight={values.active ? "500" : "800"}>
                    InActive
                  </Typography>
                  <Switch
                    id="active"
                    checked={values.active}
                    value={values.active}
                    onChange={handleChange}
                  ></Switch>
                  <Typography fontWeight={values.active ? "800" : "500"}>
                    Active
                  </Typography>
                </Box>
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
        confirm={deleteLesson}
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

export default LessonManagementsPage;
