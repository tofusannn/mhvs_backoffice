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
import { useFormik } from "formik";
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
    if (searchParams) {
      getQuestionList();
      let id = searchParams.get("id");
      if (id) {
        setFieldValue(`lesson_id`, parseInt(id));
      }
    }
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
    chapters: yup
      .array()
      .of(
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
            // link: yup
            //   .array()
            //   .of(
            //     yup.object({
            //       name: yup.string().required("โปรดระบุ"),
            //       description: yup.string().required("โปรดระบุ"),
            //       link: yup.string().required("โปรดระบุ"),
            //     })
            //   )
            //   .required("โปรดระบุ"),
          }),
        })
      )
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
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      ChapterService.postChapter(values).then((res: any) => {
        if (res.msg === "success") {
          router.push("/managements/chapter");
        } else {
          setOpenToast(true);
          setToastData({ msg: res.msg, status: false });
        }
      });
    },
  });

  function addChapter() {
    let newArr = [];
    values.chapters.map((i) => {
      newArr.push(i);
    });
    newArr.push(chapterObj);
    setFieldValue("chapters", newArr);
  }

  function deleteChapter(index: number) {
    let newArr: any[] = [];
    values.chapters.map((i) => {
      newArr.push(i);
    });
    newArr.splice(index, 1);
    const fields = [
      `chapters[${index}].chapter_name`,
      `chapters[${index}].chapter_pre_description`,
      `chapters[${index}].chapter_description`,
      `chapters[${index}].pre_test.name`,
      `chapters[${index}].pre_test.description`,
      `chapters[${index}].pre_test.test_id`,
      `chapters[${index}].post_test.name`,
      `chapters[${index}].post_test.description`,
      `chapters[${index}].post_test.test_id`,
      `chapters[${index}].video.name`,
      `chapters[${index}].video.description`,
    ];
    fields.forEach((field) => setFieldTouched(field, false, false));
    setFieldValue("chapters", newArr);
  }

  function addVideo(index: number) {
    let newArr = [];
    values.chapters.map((i, idx) => {
      if (idx === index) {
        i.video.link.map((j) => {
          newArr.push(j);
        });
      }
    });
    newArr.push({
      name: "",
      description: "",
      link: "",
    });
    setFieldValue(`chapters[${index}].video.link`, newArr);
  }

  function deleteVideo(index: number, idx: number) {
    let newArr: any[] = [];
    values.chapters.map((i, idx) => {
      if (idx === index) {
        i.video.link.map((j) => {
          newArr.push(j);
        });
      }
    });
    newArr.splice(idx, 1);

    setFieldTouched(`chapters[${index}].video.link[${idx}].name`, false, false);
    setFieldTouched(
      `chapters[${index}].video.link[${idx}].description`,
      false,
      false
    );
    setFieldTouched(`chapters[${index}].video.link[${idx}].link`, false, false);
    setFieldValue(`chapters[${index}].video.link`, newArr);
  }

  // function errorAndHelpText(
  //   index: number,
  //   idx: number,
  //   obj1?: string,
  //   obj2?: string,
  //   obj3?: string
  // ) {
  //   let v1;
  //   touched.chapters?.map((i, j) => {
  //     if (j === index) {
  //       let a = i[obj1 as keyof typeof i];
  //       a[obj2 as keyof typeof a].map((k, l) => {
  //         if (l === idx) {
  //           v1 = k[obj3 as keyof typeof k];
  //         }
  //       });
  //     }
  //   });
  //   let v2;
  //   if (errors.chapters?.length && typeof errors.chapters != "string") {
  //     errors.chapters?.map((i, j) => {
  //       let a = i[obj1 as keyof typeof i];
  //       if (j === index && typeof i != "string" && typeof a?.link != "string") {
  //         a[obj2 as keyof typeof a].map((k, l) => {
  //           if (l === idx && typeof k != "string") {
  //             if (k && k[obj3 as keyof typeof k]) {
  //               v2 = k[obj3 as keyof typeof k];
  //             }
  //           }
  //         });
  //       }
  //     });
  //   }

  //   return v1 && v2;
  // }

  function errorField(idx1: number, n1: string, n2?: string) {
    let newTouched;
    let newErrors;
    if (touched.chapters) {
      touched.chapters.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          let a = i[n1 as keyof typeof i];
          if (a && n2) {
            let b = a[n2 as keyof typeof a];
            newTouched = b;
          } else {
            newTouched = a;
          }
        }
      });
    }
    if (errors.chapters && typeof errors.chapters != "string") {
      errors.chapters.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          let a = i[n1 as keyof typeof i];
          if (a && n2) {
            let b = a[n2 as keyof typeof a];
            newErrors = b;
          } else {
            newErrors = a;
          }
        }
      });
    }
    return newTouched && Boolean(newErrors);
  }

  function helperTextField(idx1: number, n1: string, n2?: string) {
    let newTouched;
    let newErrors;
    if (touched.chapters) {
      touched.chapters.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          let a = i[n1 as keyof typeof i];
          if (a && n2) {
            let b = a[n2 as keyof typeof a];
            newTouched = b;
          } else {
            newTouched = a;
          }
        }
      });
    }
    if (errors.chapters && typeof errors.chapters != "string") {
      errors.chapters.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          let a = i[n1 as keyof typeof i];
          if (a && n2) {
            let b = a[n2 as keyof typeof a];
            newErrors = b;
          } else {
            newErrors = a;
          }
        }
      });
    }
    return newTouched && Boolean(newErrors) && newErrors;
  }

  return (
    <div>
      <HeaderText title="Create Chapter" />
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ minHeight: "70vh", paddingBottom: 30 }}>
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
                        บทเรียน<span style={{ color: "red" }}>*</span>
                      </TitleTextField>
                      <Stack spacing={2}>
                        <TextField
                          label="บทเรียน"
                          id="lesson_id"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          disabled
                          value={values.lesson_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"start"}
                    >
                      <TitleTextField>
                        การบ้าน<span style={{ color: "red" }}>*</span>
                      </TitleTextField>
                      <Stack spacing={2}>
                        <TextField
                          label="หัวข้อ"
                          name="homework.name"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          value={values.homework?.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.homework?.name &&
                            Boolean(errors.homework?.name)
                          }
                          helperText={
                            touched.homework?.name &&
                            Boolean(errors.homework?.name) &&
                            errors.homework?.name
                          }
                        />
                        <TextField
                          label="รายละเอียด"
                          name="homework.description"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          value={values.homework?.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.homework?.description &&
                            Boolean(errors.homework?.description)
                          }
                          helperText={
                            touched.homework?.description &&
                            Boolean(errors.homework?.description) &&
                            errors.homework?.description
                          }
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardContent>
                  <Divider />
                </CardContent>
              </Card>
              {values.chapters.map((i, index) => {
                const fieldName = `chapters[${index}]`;
                return (
                  <Card key={index}>
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
                          <TitleText>Chapter {index + 1}</TitleText>
                        </Box>
                        <IconButton
                          style={{ display: index === 0 ? "none" : "block" }}
                          onClick={() => deleteChapter(index)}
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
                            หัวข้อบท<span style={{ color: "red" }}>*</span>
                          </TitleTextField>
                          <Stack spacing={2}>
                            <TextField
                              label="หัวข้อบท"
                              id={`${fieldName}.chapter_name`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.chapter_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "chapter_name")}
                              helperText={helperTextField(
                                index,
                                "chapter_name"
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
                              id={`${fieldName}.chapter_pre_description`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.chapter_pre_description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(
                                index,
                                "chapter_pre_description"
                              )}
                              helperText={helperTextField(
                                index,
                                "chapter_pre_description"
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
                            รายละเอียดบท<span style={{ color: "red" }}>*</span>
                          </TitleTextField>
                          <Stack spacing={2}>
                            <TextField
                              label="รายละเอียดบท"
                              id={`${fieldName}.chapter_description`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.chapter_description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "chapter_description")}
                              helperText={helperTextField(
                                index,
                                "chapter_description"
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
                              name={`${fieldName}.pre_test.name`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.pre_test.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "pre_test", "name")}
                              helperText={helperTextField(
                                index,
                                "pre_test",
                                "name"
                              )}
                            />
                            <TextField
                              label="รายละเอียด"
                              name={`${fieldName}.pre_test.description`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.pre_test.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(
                                index,
                                "pre_test",
                                "description"
                              )}
                              helperText={helperTextField(
                                index,
                                "pre_test",
                                "description"
                              )}
                            />
                            <TextField
                              select
                              label="แบบทดสอบ"
                              name={`${fieldName}.pre_test.test_id`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.pre_test.test_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "pre_test", "test_id")}
                              helperText={helperTextField(
                                index,
                                "pre_test",
                                "test_id"
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
                              name={`${fieldName}.post_test.name`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.post_test.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "post_test", "name")}
                              helperText={helperTextField(
                                index,
                                "post_test",
                                "name"
                              )}
                            />
                            <TextField
                              label="รายละเอียด"
                              name={`${fieldName}.post_test.description`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.post_test.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(
                                index,
                                "post_test",
                                "description"
                              )}
                              helperText={helperTextField(
                                index,
                                "post_test",
                                "description"
                              )}
                            />
                            <TextField
                              select
                              label="แบบทดสอบ"
                              name={`${fieldName}.post_test.test_id`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.post_test.test_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "post_test", "test_id")}
                              helperText={helperTextField(
                                index,
                                "post_test",
                                "test_id"
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
                            วิดีโอ<span style={{ color: "red" }}>*</span>
                          </TitleTextField>
                          <Stack spacing={2}>
                            <TextField
                              label="หัวข้อ"
                              name={`${fieldName}.video.name`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.video.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "video", "name")}
                              helperText={helperTextField(
                                index,
                                "video",
                                "name"
                              )}
                            />
                            <TextField
                              label="รายละเอียด"
                              name={`${fieldName}.video.description`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.video.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(index, "video", "description")}
                              helperText={helperTextField(
                                index,
                                "video",
                                "description"
                              )}
                            />
                            {i.video.link.map((j, idx) => {
                              const fieldName2 = `link[${idx}]`;
                              return (
                                <div key={idx}>
                                  <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    mb={2}
                                  >
                                    <Typography fontWeight={600}>
                                      Video {idx + 1}:
                                    </Typography>
                                    <IconButton
                                      sx={{
                                        display: idx === 0 ? "none" : "block",
                                      }}
                                      onClick={() => deleteVideo(index, idx)}
                                    >
                                      <Close />
                                    </IconButton>
                                  </Stack>
                                  <Stack spacing={2}>
                                    <TextField
                                      label="หัวข้อ"
                                      name={`${fieldName}.video.${fieldName2}.name`}
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      value={j.name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <TextField
                                      label="รายละเอียด"
                                      name={`${fieldName}.video.${fieldName2}.description`}
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      value={j.description}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <TextField
                                      label="ลิ้งค์"
                                      name={`${fieldName}.video.${fieldName2}.link`}
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      value={j.link}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Stack>
                                </div>
                              );
                            })}
                            <Button
                              variant="outlined"
                              onClick={() => addVideo(index)}
                            >
                              +
                            </Button>
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
                onClick={() => addChapter()}
              >
                <AddCircleOutline color="info" />
              </Button>
            </Stack>
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
        </form>
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
