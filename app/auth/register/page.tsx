"use client";
import * as yup from "yup";
import { getIn, useFormik } from "formik";
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AuthService from "@/api/AuthService";
import Cookies from "js-cookie";
import Toast from "@/components/common/Toast";
import UserService from "@/api/Managements/UserService";

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

type Props = {};

const RegisterPage = (props: Props) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });

  const validationSchema = yup.object({
    // pre_name: yup.string().required("โปรดระบุ"),
    // first_name: yup.string().required("โปรดระบุ"),
    // last_name: yup.string().required("โปรดระบุ"),
    phone: yup
      .string()
      .min(10, "minimum 10 characters")
      .max(10, "maximum 10 characters")
      .required("Phone is required"),
    password: yup.string().required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Password not match")
      .required("Confirm Password is required"),
    // gender: yup.string().required("โปรดระบุ"),
    // nationality: yup.string().required("โปรดระบุ"),
  });
  const { values, touched, errors, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        // username: "",
        password: "",
        // email: "",
        phone: "",
        // gender: "",
        // nationality: "",
        // pre_name: "",
        // first_name: "",
        // last_name: "",
        // idcard: "",
        // date_of_birth: "",
        // img_id: 0,
        confirm_password: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        UserService.postUserAdmin(values).then((res: any) => {
          if (res.msg === "success") {
            setOpenToast(true);
            setToastData({ msg: res.msg, status: true });
            setTimeout(() => {
              router.push("/auth");
            }, 1000);
          } else {
            setOpenToast(true);
            setToastData({ msg: res.msg, status: false });
          }
        });
      },
    });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  function errorFields(name: string) {
    const error = getIn(errors, name);
    const touch = getIn(touched, name);
    return touch && error ? error : null;
  }

  return (
    <Main>
      <From onSubmit={handleSubmit}>
        <Card sx={{ width: "100%", borderRadius: "10px" }}>
          <CardContent
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography fontSize={48} fontWeight={700}>
              Register
            </Typography>
            <Stack
              marginTop={"48px"}
              gap={2}
              textAlign={"start"}
              marginBottom={"48px"}
            >
              {/* <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    id="pre_name"
                    name="pre_name"
                    fullWidth
                    size="small"
                    label="คำนำหน้า"
                    value={values.pre_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errorFields("pre_name"))}
                    helperText={errorFields("pre_name")}
                  >
                    {preNameList.map((i) => (
                      <MenuItem key={i.value} value={i.value}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs></Grid>
                <Grid item xs={6}>
                  <TextField
                    id="first_name"
                    fullWidth
                    size="small"
                    label="ชื่อจริง"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errorFields("first_name"))}
                    helperText={errorFields("first_name")}
                  ></TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="last_name"
                    fullWidth
                    size="small"
                    label="นามสกุล"
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errorFields("last_name"))}
                    helperText={errorFields("last_name")}
                  ></TextField>
                </Grid>
              </Grid> */}
              <TextField
                id="phone"
                fullWidth
                size="small"
                label="Phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errorFields("phone"))}
                helperText={errorFields("phone")}
              ></TextField>

              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel
                  size="small"
                  htmlFor="password"
                  error={Boolean(errorFields("password"))}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  fullWidth
                  size="small"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errorFields("password"))}
                />
                <FormHelperText error={Boolean(errorFields("password"))}>
                  {errorFields("password")}
                </FormHelperText>
              </FormControl>
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel
                  size="small"
                  htmlFor="confirm_password"
                  error={Boolean(errorFields("confirm_password"))}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirm_password"
                  fullWidth
                  size="small"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errorFields("confirm_password"))}
                />
                <FormHelperText
                  error={Boolean(errorFields("confirm_password"))}
                >
                  {errorFields("confirm_password")}
                </FormHelperText>
              </FormControl>
              {/* <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    id="gender"
                    name="gender"
                    fullWidth
                    size="small"
                    label="เพศ"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errorFields("gender"))}
                    helperText={errorFields("gender")}
                  >
                    {genderList.map((i) => (
                      <MenuItem key={i.value} value={i.value}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    id="nationality"
                    name="nationality"
                    fullWidth
                    size="small"
                    label="สัญชาติ"
                    value={values.nationality}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errorFields("nationality"))}
                    helperText={errorFields("nationality")}
                  >
                    {nationalityList.map((i) => (
                      <MenuItem key={i.value} value={i.value}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid> */}
            </Stack>
            <Grid marginTop={"auto"} container gap={2}>
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </From>
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </Main>
  );
};

export default RegisterPage;

const Main = styled("div")(({ theme }) => ({
  display: "flex",
  maxWidth: "100%",
  margin: "0 10%",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
}));

const From = styled("form")(({ theme }) => ({
  display: "flex",
  margin: "0 auto",
  width: 375,
}));
