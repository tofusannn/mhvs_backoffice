"use client";

import * as yup from "yup";
import UserService from "@/api/Managements/UserService";
import CUModal from "@/components/modal/CUModal";
import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeUser, ITypeUserParams } from "@/redux/user/types";
import { Delete, Edit, ErrorOutline } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Toast from "@/components/common/Toast";
import DModal from "@/components/modal/DModal";
import dayjs from "dayjs";
const mainUser = Cookies.get("phone");
const headCells = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "pre_name",
    label: "Name",
  },
  {
    id: "nationality",
    label: "Nationality",
  },
  {
    id: "gender",
    label: "Gender",
  },
  {
    id: "phone",
    label: "Phone Number",
  },
  {
    id: "create_datetime",
    label: "Register Date",
  },
  {
    id: "role",
    label: "บทบาท",
  },
];

const initialValues: ITypeUser = {
  id: 0,
  username: "",
  password: "",
  email: "",
  phone: "",
  gender: "",
  nationality: "",
  pre_name: "",
  first_name: "",
  last_name: "",
  idcard: "",
  date_of_birth: "2023-12-01",
  img_id: 0,
  create_datetime: "",
  role: "user",
};

const nationalityList = [
  { label: "Thai", value: "thai" },
  { label: "Myanmar", value: "myanmar" },
  { label: "Cambodia", value: "cambodia" },
  { label: "Laos", value: "laos" },
];

const genderList = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const preNameList = [
  { label: "Mr.", value: "mr" },
  { label: "Ms.", value: "ms" },
];

const UserManagementsPage = () => {
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
  const [searchParams, setSearchParams] = useState<ITypeUserParams>({
    name: "",
    phone: "",
    start_date: "",
    end_date: "",
    user_role: "user",
  });

  useEffect(() => {
    getAllUserList();
  }, []);

  async function getAllUserList(params?: ITypeUserParams) {
    let respons = await UserService.getUserList(params).then((res: any) => res);
    if (respons.status) {
      respons = respons.result.sort((a: ITypeUser, b: ITypeUser) => {
        if (!a.id || !b.id) return;
        return a.id - b.id;
      });
    }

    setDataList(respons);
  }

  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0;

  // const visibleRows = useMemo(
  //   () => dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [dataList, page, rowsPerPage]
  // );

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else if (params === "edit") {
      const fields = [
        "id",
        "pre_name",
        "first_name",
        "last_name",
        "nationality",
        "gender",
        "phone",
        "role",
      ];
      fields.forEach((field) => setFieldValue(field, rows[field], false));
      setType(params);
      setOpen(true);
    } else {
      setType(params);
      setOpen(true);
    }
  }

  function deleteUser() {
    UserService.deleteUserById(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        getAllUserList();
      } else {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  const validationSchema = yup.object({
    pre_name: yup.string().required("โปรดระบุ"),
    first_name: yup.string().required("โปรดระบุ"),
    last_name: yup.string(),
    nationality: yup.string().required("โปรดระบุ"),
    gender: yup.string().required("โปรดระบุ"),
    phone: yup
      .string()
      .min(10, "โปรดระบุอย่างน้อย 10 ตัว")
      .max(10, "โปรดระบุไม่เกิน 10 ตัว")
      .required("โปรดระบุ"),
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
        if (!values.id) return;
        UserService.putUserById(values.id, values).then((res: any) => {
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
        UserService.postUser(values).then((res: any) => {
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
    const dataSlice = dataList.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setVisibleRows(dataSlice);
    setEmptyRows(
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0
    );
  }, [dataList, dataSearchList, page, rowsPerPage]);

  function searchName(e: any, nameDate?: string) {
    let name;
    let value;
    let obj = searchParams;
    if (e && e.target) {
      name = e.target.name;
      value = e.target.value;
      if (name === "search_phone") {
        obj.phone = value;
      } else if (name === "search_name") {
        obj.name = value;
      } else {
        obj.user_role = value;
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
    getAllUserList(searchParams);
  }

  function checkRoleUser(role?: string) {
    switch (role) {
      case "user":
        return "User";
      case "admin":
        return "Admin";
      case "super_admin":
        return "Super Admin";
      case "admin_not_approve":
        return "Admin Not Approve";
    }
  }

  return (
    <div>
      <HeaderText title="User Managements" />
      <DataTable
        countData={dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchFunction={searchName}
        type2={"user"}
      >
        <TableBody>
          {visibleRows.map((row: ITypeUser, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  {row.pre_name === "mr" ? "นาย" : "นางสาว"} {row.first_name}{" "}
                  {row.last_name}
                </TableCell>
                <TableCell>
                  {row.nationality === null
                    ? "-"
                    : row.nationality.charAt(0).toUpperCase() +
                      row.nationality.slice(1)}
                </TableCell>
                <TableCell>
                  {row.gender === null
                    ? "-"
                    : row.gender.charAt(0).toUpperCase() + row.gender.slice(1)}
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  {dayjs(row.create_datetime).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{checkRoleUser(row.role)}</TableCell>
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
        title={"User"}
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
                  value={values.id}
                  onChange={handleChange}
                ></TextField>
                <Typography>
                  คำนำหน้า<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  select
                  id="pre_name"
                  name="pre_name"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.pre_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.pre_name && Boolean(errors.pre_name)}
                  helperText={
                    touched.pre_name &&
                    Boolean(errors.pre_name) &&
                    errors.pre_name
                  }
                >
                  {preNameList.map((i) => (
                    <MenuItem key={i.value} value={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  ชื่อจริง<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="first_name"
                  name="first_name"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.first_name && Boolean(errors.first_name)}
                  helperText={
                    touched.first_name &&
                    Boolean(errors.first_name) &&
                    errors.first_name
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>นามสกุล</Typography>
                <TextField
                  id="last_name"
                  name="last_name"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.last_name && Boolean(errors.last_name)}
                  helperText={
                    touched.last_name &&
                    Boolean(errors.last_name) &&
                    errors.last_name
                  }
                ></TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  เชื้อชาติ<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  select
                  id="nationality"
                  name="nationality"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.nationality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.nationality && Boolean(errors.nationality)}
                  helperText={
                    touched.nationality &&
                    Boolean(errors.nationality) &&
                    errors.nationality
                  }
                >
                  {nationalityList.map((i) => (
                    <MenuItem key={i.value} value={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  เพศ<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  select
                  id="gender"
                  name="gender"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.gender && Boolean(errors.gender)}
                  helperText={
                    touched.gender && Boolean(errors.gender) && errors.gender
                  }
                >
                  {genderList.map((i) => (
                    <MenuItem key={i.value} value={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Typography>
                  เบอร์โทรศัพท์<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="phone"
                  name="phone"
                  sx={{ width: "50%" }}
                  fullWidth
                  size="small"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={
                    touched.phone && Boolean(errors.phone) && errors.phone
                  }
                ></TextField>
              </Grid>
              <Grid
                container
                justifyContent={"space-between"}
                display={
                  type === "edit" && mainUser === values.phone ? "none" : "flex"
                }
              >
                <Typography>บทบาท</Typography>
                {/* {console.log(values.role)} */}
                <Stack direction={"row"} alignItems={"center"}>
                  <Typography>User</Typography>
                  <Switch
                    id="role"
                    name="role"
                    checked={values.role === "admin"}
                    onChange={() =>
                      setFieldValue(
                        "role",
                        values.role === "user" ? "admin" : "user",
                        false
                      )
                    }
                  />

                  <Typography>Admin</Typography>
                </Stack>
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
      <DModal open={openDelete} setOpen={setOpenDelete} confirm={deleteUser} />
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </div>
  );
};

export default UserManagementsPage;
