"use client";

import * as yup from "yup";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeChapterBody } from "@/redux/chapter/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FieldArray,
  Form,
  Formik,
  FormikProps,
  getIn,
  useFormik,
} from "formik";
import Toast from "@/components/common/Toast";
import { AddCircleOutline, Close } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionService from "@/api/Managements/QuestionService";
import Cookies from "js-cookie";
import { ITypeQuestion } from "@/redux/question/type";
import ChapterService from "@/api/Managements/ChapterService";

type Props = {};

const chapterObj = {
  chapter_name: "",
  chapter_pre_description: "",
  chapter_description: "",
  pre_test: {
    name: "",
    description: "",
    test_id: 0,
  },
  post_test: {
    name: "",
    description: "",
    test_id: 0,
  },
  video: {
    name: "",
    description: "",
    link: [
      {
        name: "",
        description: "",
        link: "",
      },
    ],
  },
};

const linkObj = {
  name: "",
  description: "",
  link: "",
};

const initialValues: ITypeChapterBody = {
  lesson_id: 0,
  homework: {
    name: "",
    description: "",
  },
  chapters: [
    {
      chapter_name: "",
      chapter_pre_description: "",
      chapter_description: "",
      pre_test: {
        name: "",
        description: "",
        test_id: 0,
      },
      post_test: {
        name: "",
        description: "",
        test_id: 0,
      },
      video: {
        name: "",
        description: "",
        link: [
          {
            name: "",
            description: "",
            link: "",
          },
        ],
      },
    },
  ],
};

const CreateChaptersPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [questionList, setQuestionList] = useState<ITypeQuestion[]>([]);

  useEffect(() => {
    getQuestionList();
  }, []);

  async function getQuestionList() {
    let respons = await QuestionService.getQuestionList().then(
      (res: any) => res
    );
    if (respons.status) {
      respons = respons.result.sort((a: ITypeQuestion, b: ITypeQuestion) => {
        return a.id - b.id;
      });
    } else {
      alert("Token Expire");
      Cookies.set("token", "");
      router.push("/auth");
    }
    setQuestionList(respons);
  }

  const validationSchema = yup.object({
    lesson_id: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
    homework: yup.object({
      name: yup.string().required("โปรดระบุ"),
      description: yup.string().required("โปรดระบุ"),
    }),
    chapters: yup.array().of(
      yup.object({
        chapter_name: yup.string().required("โปรดระบุ"),
        chapter_pre_description: yup.string().required("โปรดระบุ"),
        chapter_description: yup.string().required("โปรดระบุ"),
        pre_test: yup.object({
          name: yup.string().required("โปรดระบุ"),
          description: yup.string().required("โปรดระบุ"),
          test_id: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
        }),
        post_test: yup.object({
          name: yup.string().required("โปรดระบุ"),
          description: yup.string().required("โปรดระบุ"),
          test_id: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
        }),
        video: yup.object({
          name: yup.string().required("โปรดระบุ"),
          description: yup.string().required("โปรดระบุ"),
          link: yup.array().of(
            yup.object({
              name: yup.string().required("โปรดระบุ"),
              description: yup.string().required("โปรดระบุ"),
              link: yup.string().required("โปรดระบุ"),
            })
          ),
        }),
      })
    ),
  });

  return (
    <div>
      <HeaderText title="Create Chapter" />
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            ChapterService.postChapter(values).then((res: any) => {
              if (res.msg === "success") {
                setOpenToast(true);
                setToastData({ msg: res.msg, status: true });
                let id = searchParams.get("id");
                setTimeout(() => {
                  router.push(`/managements/chapter/?id=${id}`);
                }, 1000);
              } else {
                setOpenToast(true);
                setToastData({ msg: res.msg, status: false });
              }
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            getFieldProps,
            setFieldValue,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (searchParams) {
                let id = searchParams.get("id");
                if (id) {
                  setFieldValue(`lesson_id`, parseInt(id));
                }
              }
            }, []);

            return (
              <Form>
                <Box sx={{ minHeight: "70vh", paddingBottom: 30 }}>
                  <FieldArray name={`chapters`}>
                    {(arrayHelpers) => {
                      function errorFields(name: string) {
                        const error = getIn(errors, name);
                        const touch = getIn(touched, name);
                        return touch && error ? error : null;
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
                                  <TitleText>Chapter Header</TitleText>
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
                                    บทเรียน
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <Stack spacing={2}>
                                    <TextField
                                      label="บทเรียน"
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      disabled
                                      {...getFieldProps(`lesson_id`)}
                                      error={errorFields(`lesson_id`)}
                                      helperText={errorFields(`lesson_id`)}
                                    />
                                  </Stack>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
                                  alignItems={"start"}
                                >
                                  <TitleTextField>
                                    การบ้าน
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <Stack spacing={2}>
                                    <TextField
                                      label="หัวข้อ"
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      {...getFieldProps(`homework.name`)}
                                      error={errorFields(`homework.name`)}
                                      helperText={errorFields(`homework.name`)}
                                    />
                                    <TextField
                                      label="รายละเอียด"
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      {...getFieldProps(`homework.description`)}
                                      error={errorFields(
                                        `homework.description`
                                      )}
                                      helperText={errorFields(
                                        `homework.description`
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
                          {values.chapters.map((i, idx) => {
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
                                      <TitleText>Chapter {idx + 1}</TitleText>
                                    </Box>
                                    <IconButton
                                      style={{
                                        display: idx === 0 ? "none" : "block",
                                      }}
                                      onClick={() => arrayHelpers.remove(idx)}
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
                                        หัวข้อบท
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="หัวข้อบท"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.chapter_name`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.chapter_name`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.chapter_name`
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
                                        รายละเอียดบทโดยย่อ
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="รายละเอียดบทโดยย่อ"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.chapter_pre_description`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.chapter_pre_description`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.chapter_pre_description`
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
                                        รายละเอียดบท
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="รายละเอียดบท"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.chapter_description`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.chapter_description`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.chapter_description`
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
                                        แบบทดสอบก่อนเรียน
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="หัวข้อ"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.pre_test.name`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.pre_test.name`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.pre_test.name`
                                          )}
                                        />
                                        <TextField
                                          label="รายละเอียด"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.pre_test.description`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.pre_test.description`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.pre_test.description`
                                          )}
                                        />
                                        <TextField
                                          select
                                          label="แบบทดสอบ"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.pre_test.test_id`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.pre_test.test_id`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.pre_test.test_id`
                                          )}
                                        >
                                          {questionList.map((x) => (
                                            <MenuItem key={x.id} value={x.id}>
                                              {x.name}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </Stack>
                                    </Stack>
                                    <Stack
                                      direction={"row"}
                                      justifyContent={"space-between"}
                                      alignItems={"start"}
                                    >
                                      <TitleTextField>
                                        แบบทดสอบหลังเรียน
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="หัวข้อ"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.post_test.name`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.post_test.name`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.post_test.name`
                                          )}
                                        />
                                        <TextField
                                          label="รายละเอียด"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.post_test.description`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.post_test.description`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.post_test.description`
                                          )}
                                        />
                                        <TextField
                                          select
                                          label="แบบทดสอบ"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.post_test.test_id`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.post_test.test_id`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.post_test.test_id`
                                          )}
                                        >
                                          {questionList.map((x) => (
                                            <MenuItem key={x.id} value={x.id}>
                                              {x.name}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </Stack>
                                    </Stack>
                                    <Stack
                                      direction={"row"}
                                      justifyContent={"space-between"}
                                      alignItems={"start"}
                                    >
                                      <TitleTextField>
                                        วิดีโอ
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="หัวข้อ"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.video.name`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.video.name`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.video.name`
                                          )}
                                        />
                                        <TextField
                                          label="รายละเอียด"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `chapters.${idx}.video.description`
                                          )}
                                          error={errorFields(
                                            `chapters.${idx}.video.description`
                                          )}
                                          helperText={errorFields(
                                            `chapters.${idx}.video.description`
                                          )}
                                        />
                                        <FieldArray
                                          name={`chapters.${idx}.video.link`}
                                        >
                                          {(arrayHelpers2) => (
                                            <div>
                                              <Stack spacing={2}>
                                                {i.video.link.map((j, idx2) => {
                                                  return (
                                                    <div key={idx2}>
                                                      <Stack
                                                        direction={"row"}
                                                        justifyContent={
                                                          "space-between"
                                                        }
                                                        alignItems={"center"}
                                                        mb={2}
                                                      >
                                                        <Typography
                                                          fontWeight={600}
                                                        >
                                                          Video {idx2 + 1}:
                                                        </Typography>
                                                        <IconButton
                                                          sx={{
                                                            display:
                                                              idx2 === 0
                                                                ? "none"
                                                                : "flex",
                                                          }}
                                                          onClick={() =>
                                                            arrayHelpers2.remove(
                                                              idx2
                                                            )
                                                          }
                                                        >
                                                          <Close />
                                                        </IconButton>
                                                      </Stack>
                                                      <Stack spacing={2}>
                                                        <TextField
                                                          label="หัวข้อ"
                                                          sx={{ width: 345 }}
                                                          fullWidth
                                                          size="small"
                                                          {...getFieldProps(
                                                            `chapters.${idx}.video.link.${idx2}.name`
                                                          )}
                                                          error={errorFields(
                                                            `chapters.${idx}.video.link.${idx2}.name`
                                                          )}
                                                          helperText={errorFields(
                                                            `chapters.${idx}.video.link.${idx2}.name`
                                                          )}
                                                        />
                                                        <TextField
                                                          label="รายละเอียด"
                                                          sx={{ width: 345 }}
                                                          fullWidth
                                                          size="small"
                                                          {...getFieldProps(
                                                            `chapters.${idx}.video.link.${idx2}.description`
                                                          )}
                                                          error={errorFields(
                                                            `chapters.${idx}.video.link.${idx2}.description`
                                                          )}
                                                          helperText={errorFields(
                                                            `chapters.${idx}.video.link.${idx2}.description`
                                                          )}
                                                        />
                                                        <TextField
                                                          label="ลิ้งค์"
                                                          sx={{ width: 345 }}
                                                          fullWidth
                                                          size="small"
                                                          {...getFieldProps(
                                                            `chapters.${idx}.video.link.${idx2}.link`
                                                          )}
                                                          error={errorFields(
                                                            `chapters.${idx}.video.link.${idx2}.link`
                                                          )}
                                                          helperText={errorFields(
                                                            `chapters.${idx}.video.link.${idx2}.link`
                                                          )}
                                                        />
                                                      </Stack>
                                                    </div>
                                                  );
                                                })}
                                                <Button
                                                  variant="outlined"
                                                  onClick={() =>
                                                    arrayHelpers2.push(linkObj)
                                                  }
                                                >
                                                  +
                                                </Button>
                                              </Stack>
                                            </div>
                                          )}
                                        </FieldArray>
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
                            onClick={() => arrayHelpers.push(chapterObj)}
                          >
                            <AddCircleOutline color="info" />
                          </Button>
                        </Stack>
                      );
                    }}
                  </FieldArray>
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
            );
          }}
        </Formik>
      </Box>
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </div>
  );
};

export default CreateChaptersPage;

const TitleText = styled(Typography)({
  fontWeight: 600,
  fontSize: 24,
});

const TitleTextField = styled(Typography)({
  fontWeight: 600,
  fontSize: 18,
});
