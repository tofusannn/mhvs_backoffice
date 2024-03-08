"use client";

import * as yup from "yup";
import BannerService from "@/api/Managements/BannerService";
import { ITypeBanner, ITypeBannerBody } from "@/redux/banner/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Toast from "@/components/common/Toast";
import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import {
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Grid,
  Box,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField,
  Typography,
  Switch,
  styled,
  Stack,
  Skeleton,
} from "@mui/material";
import { Edit, Delete, CloudUpload } from "@mui/icons-material";
import Image from "next/image";
import CUModal from "@/components/modal/CUModal";
import DModal from "@/components/modal/DModal";
import FileService from "@/api/FileService";

type Props = {};

const headCells = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "file_path",
    label: "Image",
  },
  {
    id: "language",
    label: "Language",
  },
  {
    id: "active",
    label: "Status",
  },
];

const initialValues: ITypeBannerBody = {
  img_id: 0,
  active: false,
  language: "",
};

const languageList = [
  { label: "Thai", value: "th" },
  { label: "Myanmar", value: "mm" },
  { label: "Cambodia", value: "cd" },
  { label: "Laos", value: "ls" },
];

const BannerManagementPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dataList, setDataList] = useState([]);
  const [dataSearchList, setDataSearchList] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [idEdit, setIdEdit] = useState(0);
  const [type, setType] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [search, setSearch] = useState("th");
  const lg = searchParams.get("lg");
  const [imageExam, setImageExam] = useState("");

  async function getAllBannerList(language: string) {
    let respons = await BannerService.getAllBanner(language).then(
      (res: any) => res
    );
    if (respons.status) {
      respons = respons.result.sort((a: ITypeBanner, b: ITypeBanner) => {
        return a.id - b.id;
      });
    }
    setDataList(respons);
    setDataSearchList(respons);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else if (params === "edit") {
      setIdEdit(rows.id);
      setImageExam(rows.file_path);
      setFieldValue("img_id", 1, false);
      const fields = ["active", "language"];
      fields.forEach((field) => setFieldValue(field, rows[field], false));
      setType(params);
      setOpen(true);
    } else {
      setType(params);
      setOpen(true);
    }
  }

  function deleteBanner() {
    BannerService.deleteBanner(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        getAllBannerList(lg || "th");
      } else {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  const validationSchema = yup.object({
    img_id: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
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
        BannerService.putBanner(idEdit, values).then((res: any) => {
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
      } else {
        BannerService.postBanner(values).then((res: any) => {
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

  useEffect(() => {
    searchName({ target: { name: "", value: "th" } });
  }, []);

  function searchName(e: any) {
    const name = e.target.name;
    const value = e.target.value;
    router.push(`/managements/banner/?lg=${value}`);
    if (name === "search_name") {
      const newData = dataList.filter((i: ITypeBanner) =>
        i.language.startsWith(value)
      );
      setDataSearchList(newData);
    } else {
      getAllBannerList(value);
    }
    setSearch(value);
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

  async function handleUploadClick(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    var file = event.target.files[0];
    await FileService.uploadFile(file).then((res: any) => {
      if (res.msg === "success") {
        setImageExam(res.result.file_path);
        setFieldValue("img_id", res.result.id, false);
      } else {
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  useEffect(() => {
    if (open === false) {
      setImageExam("");
    }
  }, [open]);

  return (
    <div>
      <HeaderText title="Banner Managements" />
      <DataTable
        countData={search != "" ? dataSearchList.length : dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchFunction={searchName}
        type={"banner"}
        languageList={languageList}
        searchValue={search}
      >
        <TableBody>
          {visibleRows.map((row: ITypeBanner, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ position: "relative" }}>
                  <Image
                    src={`https://public.aorsortor.online${row.file_path}`}
                    alt={"banner"}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </TableCell>
                <TableCell>{getLanguage(row.language)}</TableCell>
                <TableCell>{row.active ? "Active" : "InActive"}</TableCell>
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
        title={"Banner"}
        resetForm={resetForm}
      >
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container gap={2}>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  รูปภาพ<span style={{ color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid
                container
                sx={{ position: "relative", width: "100%", height: 250 }}
              >
                {imageExam ? (
                  <Image
                    src={`https://public.aorsortor.online${imageExam}`}
                    alt={"image"}
                    style={{ objectFit: "contain" }}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <Skeleton
                    variant="rounded"
                    width={"100%"}
                    height={250}
                    animation={false}
                  />
                )}
              </Grid>
              <Grid
                sx={{ display: type === "edit" ? "none" : "block" }}
                item
                xs={12}
                textAlign={"end"}
              >
                {imageExam ? (
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<Delete />}
                    onClick={() => setImageExam("")}
                  >
                    Delete Image
                  </Button>
                ) : (
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                  >
                    Upload Image
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleUploadClick}
                    />
                  </Button>
                )}
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "red",
                    marginTop: 1,
                    display: imageExam ? "none" : "block",
                  }}
                >
                  *กรุณาเลือกรูปภาพ
                </Typography>
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
                  disabled={type === "edit"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.language && Boolean(errors.language)}
                  helperText={
                    touched.language &&
                    Boolean(errors.language) &&
                    errors.language
                  }
                >
                  {languageList.map((i) => (
                    <MenuItem key={i.value} value={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
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
        confirm={deleteBanner}
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

export default BannerManagementPage;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
