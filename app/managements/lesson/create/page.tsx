"use client";

import * as yup from "yup";

import Toast from "@/components/common/Toast";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeLessonBody, ITypeProminentPoint } from "@/redux/lesson/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Skeleton,
  Stack,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, getIn } from "formik";
import LessonService from "@/api/Managements/LessonService";
import {
  Close,
  AddCircleOutline,
  CloudUpload,
  Delete,
} from "@mui/icons-material";
import { type } from "os";
import FileService from "@/api/FileService";
import Image from "next/image";

type Props = {};

const prominentPoint = {
  index: 0,
  name: "",
  description: "",
  img_id: 0,
};

const prominentPointArray: ITypeProminentPoint = [prominentPoint];

const initialValues: ITypeLessonBody = {
  img_id: 0,
  lesson_id: 0,
  lesson_name: "",
  lesson_description: "",
  language: "",
  questionnaire_cer_id: 0,
  prominent_point: prominentPointArray,
  active: false,
};

const languageItems = [
  { value: "th", label: "Thai" },
  { value: "mm", label: "Myanmar" },
  { value: "cd", label: "Cambodia" },
  { value: "ls", label: "Laos" },
];

const CreateLessonPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [dataForm, setDataForm] = useState(initialValues);
  const [imageExam, setImageExam] = useState("");
  const [imageExam2, setImageExam2] = useState<
    { index: number; path: string }[]
  >([]);
  const [reloadPage, setReloadPage] = useState(true);
  setTimeout(() => setReloadPage(false), 1000);
  const id = parseInt(searchParams.get("id") || "");

  useEffect(() => {
    if (id) {
      getLessonById(id);
    }
  }, []);

  function deleteImageExam2(idx: number) {
    let newArr: { index: number; path: string }[] = [];
    imageExam2.map((i) => {
      newArr.push(i);
    });
    const index = newArr.findIndex((e) => e.index === idx);
    newArr.splice(index, 1);
    setImageExam2(newArr);
  }

  function getLessonById(id: number) {
    LessonService.getLessonById(id).then((res: any) => {
      if (res.msg === "success") {
        let newArr: { index: number; path: string }[] = [];
        res.result.prominent_point.map((i: any) => {
          newArr.push({ index: i.index, path: i.file_path });
        });
        setImageExam(res.result.file_path);
        setImageExam2(newArr);
        setDataForm(res.result);
      } else {
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  const validationSchema = yup.object({
    img_id: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
    lesson_name: yup.string().required("โปรดระบุ"),
    lesson_description: yup.string().required("โปรดระบุ"),
    language: yup.string().required("โปรดระบุ"),
    prominent_point: yup.array().of(
      yup.object().shape({
        img_id: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
        name: yup.string().required("โปรดระบุ"),
        description: yup.string().required("โปรดระบุ"),
      })
    ),
  });

  return (
    <div>
      <HeaderText title={id ? "Edit Lesson" : "Create Lesson"} />
      {reloadPage ? (
        <Main>
          <CircularProgress />
        </Main>
      ) : (
        <Box sx={{ position: "relative", marginTop: 3 }}>
          <Formik
            initialValues={dataForm}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (id) {
                LessonService.putLessonById(id, values).then((res: any) => {
                  if (res.msg === "success") {
                    setOpenToast(true);
                    setToastData({ msg: res.msg, status: true });
                    setTimeout(() => {
                      router.push("/managements/lesson");
                      1;
                    }, 1000);
                  } else {
                    setOpenToast(true);
                    setToastData({ msg: res.msg, status: false });
                  }
                });
              } else {
                LessonService.postLesson(values).then((res: any) => {
                  if (res.msg === "success") {
                    setOpenToast(true);
                    setToastData({ msg: res.msg, status: true });
                    setTimeout(() => {
                      router.push("/managements/lesson");
                      1;
                    }, 1000);
                  } else {
                    setOpenToast(true);
                    setToastData({ msg: res.msg, status: false });
                  }
                });
              }
            }}
            render={({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              getFieldProps,
              setFieldValue,
            }) => (
              <Form>
                <Box sx={{ minHeight: "70vh", paddingBottom: 30 }}>
                  <FieldArray
                    name={`prominent_point`}
                    render={(arrayHelpers) => {
                      function errorFields(name: string) {
                        const error = getIn(errors, name);
                        const touch = getIn(touched, name);
                        return touch && error ? error : null;
                      }
                      async function handleUploadClick(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) {
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
                      return (
                        <Stack spacing={3}>
                          <Card>
                            <CardContent>
                              <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                              >
                                <Box
                                  sx={{
                                    padding: "8px 24px",
                                    borderRadius: 1,
                                    backgroundColor: "skyblue",
                                  }}
                                >
                                  <TitleText>Lesson Header</TitleText>
                                </Box>
                              </Stack>
                            </CardContent>
                            <CardContent>
                              <Divider />
                            </CardContent>
                            <CardContent>
                              <Stack padding={3} spacing={3}>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
                                  alignItems={"start"}
                                >
                                  <TitleTextField>
                                    รูปภาพ
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                </Stack>
                                <Grid
                                  container
                                  sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: 250,
                                  }}
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
                                <Stack>
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
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
                                  alignItems={"start"}
                                >
                                  <TitleTextField>
                                    ชื่อบทเรียน
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <TextField
                                    multiline
                                    rows={2}
                                    sx={{ width: "70%" }}
                                    fullWidth
                                    size="small"
                                    {...getFieldProps(`lesson_name`)}
                                    error={errorFields(`lesson_name`)}
                                    helperText={errorFields(`lesson_name`)}
                                  ></TextField>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
                                  alignItems={"start"}
                                >
                                  <TitleTextField>
                                    รายละเอียด
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <TextField
                                    multiline
                                    rows={10}
                                    sx={{ width: "70%" }}
                                    fullWidth
                                    size="small"
                                    {...getFieldProps(`lesson_description`)}
                                    error={errorFields(`lesson_description`)}
                                    helperText={errorFields(
                                      `lesson_description`
                                    )}
                                  ></TextField>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
                                  alignItems={"start"}
                                >
                                  <TitleTextField>
                                    ภาษา<span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <TextField
                                    select
                                    sx={{ width: "345px" }}
                                    fullWidth
                                    size="small"
                                    {...getFieldProps(`language`)}
                                    error={errorFields(`language`)}
                                    helperText={errorFields(`language`)}
                                  >
                                    {languageItems.map(
                                      (option: {
                                        value: string;
                                        label: string;
                                      }) => (
                                        <MenuItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </MenuItem>
                                      )
                                    )}
                                  </TextField>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
                                  alignItems={"start"}
                                >
                                  <TitleTextField>
                                    สถานะ<span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <Box display={"flex"} alignItems={"center"}>
                                    <Typography
                                      fontWeight={values.active ? "500" : "800"}
                                    >
                                      InActive
                                    </Typography>
                                    <Switch
                                      id="active"
                                      checked={values.active}
                                      value={values.active}
                                      onChange={handleChange}
                                    ></Switch>
                                    <Typography
                                      fontWeight={values.active ? "800" : "500"}
                                    >
                                      Active
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Stack>
                            </CardContent>
                            <CardContent>
                              <Divider />
                            </CardContent>
                          </Card>
                          {values.prominent_point.map((i, idx) => {
                            const imageExam2Obj = imageExam2.find(
                              (e) => e.index === idx
                            );
                            async function handleUploadClick2(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) {
                              if (!event.target.files) return;
                              var file = event.target.files[0];
                              let newArr: { index: number; path: string }[] =
                                [];
                              imageExam2.map((i) => {
                                newArr.push(i);
                              });
                              await FileService.uploadFile(file).then(
                                (res: any) => {
                                  if (res.msg === "success") {
                                    newArr.push({
                                      index: idx,
                                      path: res.result.file_path,
                                    });
                                    setImageExam2(newArr);
                                    setFieldValue(
                                      `prominent_point.${idx}.img_id`,
                                      res.result.id,
                                      false
                                    );
                                  } else {
                                    setOpenToast(true);
                                    setToastData({
                                      msg: res.msg,
                                      status: false,
                                    });
                                  }
                                }
                              );
                            }
                            return (
                              <Card key={idx}>
                                <CardContent>
                                  <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                  >
                                    <Box
                                      sx={{
                                        padding: "8px 24px",
                                        borderRadius: 1,
                                        backgroundColor: "skyblue",
                                      }}
                                    >
                                      <TitleText>
                                        Prominent Point {idx + 1}
                                      </TitleText>
                                    </Box>
                                    <IconButton
                                      style={{
                                        display: idx === 0 ? "none" : "block",
                                      }}
                                      onClick={() => {
                                        arrayHelpers.remove(idx);
                                        deleteImageExam2(idx);
                                      }}
                                    >
                                      <Close />
                                    </IconButton>
                                  </Stack>
                                </CardContent>
                                <CardContent>
                                  <Divider />
                                </CardContent>
                                <CardContent>
                                  <Stack padding={3} spacing={3}>
                                    <Stack
                                      direction={"row"}
                                      justifyContent={"space-between"}
                                      alignItems={"start"}
                                    >
                                      <TitleTextField>
                                        รูปภาพ
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Grid
                                        container
                                        sx={{
                                          justifyContent: "end",
                                          position: "relative",
                                          width: "50%",
                                          height: 250,
                                        }}
                                      >
                                        {imageExam2Obj ? (
                                          <Image
                                            src={`https://public.aorsortor.online${imageExam2Obj.path}`}
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
                                    </Stack>
                                    <Stack textAlign={"end"} alignItems={"end"}>
                                      {imageExam2Obj ? (
                                        <Button
                                          sx={{ width: 345 }}
                                          color="error"
                                          variant="contained"
                                          startIcon={<Delete />}
                                          onClick={() => deleteImageExam2(idx)}
                                        >
                                          Delete Image
                                        </Button>
                                      ) : (
                                        <Button
                                          sx={{ width: 345 }}
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
                                            onChange={handleUploadClick2}
                                          />
                                        </Button>
                                      )}
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          color: "red",
                                          marginTop: 1,
                                          display: imageExam2Obj
                                            ? "none"
                                            : "block",
                                        }}
                                      >
                                        *กรุณาเลือกรูปภาพ
                                      </Typography>
                                    </Stack>
                                    <Stack
                                      direction={"row"}
                                      justifyContent={"space-between"}
                                      alignItems={"start"}
                                    >
                                      <TitleTextField>
                                        ชื่อ
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `prominent_point.${idx}.name`
                                          )}
                                          error={errorFields(
                                            `prominent_point.${idx}.name`
                                          )}
                                          helperText={errorFields(
                                            `prominent_point.${idx}.name`
                                          )}
                                        />
                                      </Stack>
                                    </Stack>
                                    <Stack
                                      direction={"row"}
                                      justifyContent={"space-between"}
                                      alignItems={"start"}
                                    >
                                      <TitleTextField>
                                        รายละเอียด
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `prominent_point.${idx}.description`
                                          )}
                                          error={errorFields(
                                            `prominent_point.${idx}.description`
                                          )}
                                          helperText={errorFields(
                                            `prominent_point.${idx}.description`
                                          )}
                                        />
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                </CardContent>
                                <CardContent>
                                  <Divider />
                                </CardContent>
                              </Card>
                            );
                          })}
                          <Button
                            sx={{
                              color: "black",
                              backgroundColor: "#fff",
                              "&:hover": { backgroundColor: "#fff" },
                              padding: "10px 0px",
                            }}
                            fullWidth
                            variant="contained"
                            onClick={() => {
                              arrayHelpers.push({
                                ...prominentPoint,
                                index:
                                  values.prominent_point.length === 1
                                    ? 1
                                    : values.prominent_point.length + 1,
                              });
                            }}
                          >
                            <AddCircleOutline color="info" />
                          </Button>
                        </Stack>
                      );
                    }}
                  ></FieldArray>
                </Box>
                <Stack
                  bottom={0}
                  left={"30%"}
                  right={"30%"}
                  position={"absolute"}
                  direction={"row"}
                  justifyContent={"center"}
                  my={2}
                >
                  <Button type="submit" variant="contained" sx={{ width: 345 }}>
                    Submit
                  </Button>
                </Stack>
              </Form>
            )}
          ></Formik>
        </Box>
      )}
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </div>
  );
};

export default CreateLessonPage;

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

const TitleText = styled(Typography)({
  fontWeight: 600,
  fontSize: 24,
});

const TitleTextField = styled(Typography)({
  fontWeight: 600,
  fontSize: 18,
});

const Main = styled("div")(({ theme }) => ({
  display: "flex",
  maxWidth: "100%",
  margin: "0 10%",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
}));
