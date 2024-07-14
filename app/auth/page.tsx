"use client";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
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

type Props = {};

const LoginPage = (props: Props) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });

  const validationSchema = yup.object({
    phone: yup.string().required("Phone is required"),
    password: yup.string(),
  });
  const { values, touched, errors, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        phone: "",
        password: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        AuthService.login(values).then((res: any) => {
          if (res.msg === "success") {
            Cookies.set("phone", values.phone);
            Cookies.set("token", res.result.token);
            Cookies.set("token_expire", res.result.token_expire);
            router.push("/dashboard");
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
              Login
            </Typography>
            <Grid sx={{ marginTop: "24px" }}>
              <TextField
                id="phone"
                fullWidth
                size="small"
                label="Phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={errors.phone}
              ></TextField>
            </Grid>
            <Grid sx={{ marginTop: "10px" }}>
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel
                  size="small"
                  htmlFor="password"
                  error={touched.password && Boolean(errors.password)}
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
                  error={touched.password && Boolean(errors.password)}
                />
                <FormHelperText
                  error={touched.password && Boolean(errors.password)}
                >
                  {errors.password}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Button
              type="submit"
              sx={{ marginTop: "auto" }}
              variant="contained"
              fullWidth
            >
              Submit
            </Button>
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

export default LoginPage;

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
  height: 375,
}));
