"use client";

import * as yup from "yup";
import Toast from "@/components/common/Toast";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeQuestionBody } from "@/redux/question/type";
import styled from "@emotion/styled";
import { AddCircleOutline, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import QuestionService from "@/api/Managements/QuestionService";

type Props = {};

const initialValues: ITypeQuestionBody = {
  name: "",
  description: "",
  estimate_score_pre: 0,
  estimate_score_quiz: 0,
  question: [
    {
      question: "",
      answer: [
        {
          choice: "",
          score: 0,
          is_true: false,
          is_input: false,
        },
      ],
    },
  ],
};

const questionObj = {
  question: "",
  answer: [
    {
      choice: "",
      score: 0,
      is_true: false,
      is_input: false,
    },
  ],
};

const CreateQuestionPage = (props: Props) => {
  const router = useRouter();
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });

  const validationSchema = yup.object({
    name: yup.string().required("โปรดระบุ"),
    description: yup.string().required("โปรดระบุ"),
    estimate_score_pre: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
    estimate_score_quiz: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
    question: yup
      .array()
      .of(
        yup.object({
          question: yup.string().required("โปรดระบุ"),
          //   answer: yup
          //     .array()
          //     .of(
          //       yup.object({
          //         choice: yup.string().required("โปรดระบุ"),
          //         score: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
          //         is_true: yup.boolean(),
          //         is_input: yup.boolean(),
          //       })
          //     )
          //     .required("โปรดระบุ"),
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
      QuestionService.postQuestion(values).then((res: any) => {
        if (res.msg === "success") {
          router.push("/managements/question");
        } else {
          setOpenToast(true);
          setToastData({ msg: res.msg, status: false });
        }
      });
    },
  });

  function addQuestion() {
    let newArr = [];
    values.question.map((i) => {
      newArr.push(i);
    });
    newArr.push(questionObj);
    setFieldValue("question", newArr);
  }

  function deleteQuestion(index: number) {
    let newArr: any[] = [];
    values.question.map((i) => {
      newArr.push(i);
    });
    newArr.splice(index, 1);
    const fields = [`question[${index}].question`];
    // values.question.map((i, idx1) => {
    //   if (idx1 === index) {
    //     i.answer.map((j, idx) => {
    //       fields.push(`question[${index}].answer[${idx}].choice`);
    //       fields.push(`question[${index}].answer[${idx}].score`);
    //     });
    //   }
    // });
    fields.forEach((field) => setFieldTouched(field, false, false));
    setFieldValue("question", newArr);
  }

  function addAnswer(idx: number) {
    let newArr = [];
    values.question.map((i, j) => {
      if (j === idx) {
        i.answer.map((k) => {
          newArr.push(k);
        });
      }
    });
    newArr.push({
      choice: "",
      score: 0,
      is_true: false,
      is_input: false,
    });
    setFieldValue(`question[${idx}].answer`, newArr);
  }

  function deleteAnswer(idx: number, idx2: number) {
    let newArr: any[] = [];
    values.question.map((i, j) => {
      if (j === idx) {
        i.answer.map((k) => {
          newArr.push(k);
        });
      }
    });
    newArr.splice(idx2, 1);

    // setFieldTouched(
    //   `question[${idx}].answer[${idx2 + 1}].choice`,
    //   false,
    //   false
    // );
    // setFieldTouched(`question[${idx}].answer[${idx2 + 1}].score`, false, false);
    setFieldValue(`question[${idx}].answer`, newArr);
  }

  function errorField(idx1: number, n1: string, idx2?: number) {
    let newTouched;
    let newErrors;
    if (touched.question) {
      touched.question.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          if (n1 === "question") {
            let a = i[n1 as keyof typeof i];
            newTouched = a;
          }
          //   else {
          //     i.answer?.map((k, l) => {
          //       if (l === idx2) {
          //         if (k === undefined) {
          //           return;
          //         }
          //         let b = k[n1 as keyof typeof k];
          //         newTouched = b;
          //       }
          //     });
          //   }
        }
      });
    }
    if (errors.question && typeof errors.question != "string") {
      errors.question.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          if (n1 === "question") {
            let a = i[n1 as keyof typeof i];
            newErrors = a;
          }
          //   else {
          //     if (typeof i != "string" && typeof i.answer != "string") {
          //       i.answer?.map((k, l) => {
          //         if (l === idx2) {
          //           if (k === undefined) {
          //             return;
          //           }
          //           let b = k[n1 as keyof typeof k];

          //           newErrors = b;
          //         }
          //       });
          //     }
          //   }
        }
      });
    }
    return newTouched && Boolean(newErrors);
  }

  function helperTextField(idx1: number, n1: string, idx2?: number) {
    let newTouched;
    let newErrors;
    if (touched.question) {
      touched.question.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          if (n1 === "question") {
            let a = i[n1 as keyof typeof i];
            newTouched = a;
          }
          //   else {
          //     i.answer?.map((k, l) => {
          //       if (l === idx2) {
          //         if (k === undefined) {
          //           return;
          //         }
          //         let b = k[n1 as keyof typeof k];
          //         newTouched = b;
          //       }
          //     });
          //   }
        }
      });
    }
    if (errors.question && typeof errors.question != "string") {
      errors.question.map((i, j) => {
        if (j === idx1) {
          if (i === undefined) {
            return;
          }
          if (n1 === "question") {
            let a = i[n1 as keyof typeof i];
            newErrors = a;
          }
          //   else {
          //     if (typeof i != "string" && typeof i.answer != "string") {
          //       i.answer?.map((k, l) => {
          //         if (l === idx2) {
          //           if (k === undefined) {
          //             return;
          //           }
          //           let b = k[n1 as keyof typeof k];

          //           newErrors = b;
          //         }
          //       });
          //     }
          //   }
        }
      });
    }
    return newTouched && Boolean(newErrors) && newErrors;
  }

  return (
    <div>
      <HeaderText title="Create Question" />
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
                      <TitleText>Question Header</TitleText>
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
                        หัวข้อ<span style={{ color: "red" }}>*</span>
                      </TitleTextField>
                      <Stack spacing={2}>
                        <TextField
                          label="หัวข้อ"
                          id="name"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && Boolean(errors.name)}
                          helperText={
                            touched.name && Boolean(errors.name) && errors.name
                          }
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"start"}
                    >
                      <TitleTextField>
                        รายละเอียด<span style={{ color: "red" }}>*</span>
                      </TitleTextField>
                      <Stack spacing={2}>
                        <TextField
                          label="รายละเอียด"
                          name="description"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.description && Boolean(errors.description)
                          }
                          helperText={
                            touched.description &&
                            Boolean(errors.description) &&
                            errors.description
                          }
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"start"}
                    >
                      <TitleTextField>
                        estimate_score_pre
                        <span style={{ color: "red" }}>*</span>
                      </TitleTextField>
                      <Stack spacing={2}>
                        <TextField
                          label="estimate_score_pre"
                          name="estimate_score_pre"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          type="number"
                          value={values.estimate_score_pre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.estimate_score_pre &&
                            Boolean(errors.estimate_score_pre)
                          }
                          helperText={
                            touched.estimate_score_pre &&
                            Boolean(errors.estimate_score_pre) &&
                            errors.estimate_score_pre
                          }
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"start"}
                    >
                      <TitleTextField>
                        estimate_score_quiz
                        <span style={{ color: "red" }}>*</span>
                      </TitleTextField>
                      <Stack spacing={2}>
                        <TextField
                          label="estimate_score_quiz"
                          name="estimate_score_quiz"
                          sx={{ width: 345 }}
                          fullWidth
                          size="small"
                          type="number"
                          value={values.estimate_score_quiz}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.estimate_score_quiz &&
                            Boolean(errors.estimate_score_quiz)
                          }
                          helperText={
                            touched.estimate_score_quiz &&
                            Boolean(errors.estimate_score_quiz) &&
                            errors.estimate_score_quiz
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
              {values.question.map((i, idx) => {
                const fieldName = `question[${idx}]`;
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
                          <TitleText>Question {idx + 1}</TitleText>
                        </Box>
                        <IconButton
                          style={{ display: idx === 0 ? "none" : "block" }}
                          onClick={() => deleteQuestion(idx)}
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
                            คำถาม<span style={{ color: "red" }}>*</span>
                          </TitleTextField>
                          <Stack spacing={2}>
                            <TextField
                              label="คำถาม"
                              id={`${fieldName}.question`}
                              sx={{ width: 345 }}
                              fullWidth
                              size="small"
                              value={i.question}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errorField(idx, "question")}
                              helperText={helperTextField(idx, "question")}
                            />
                          </Stack>
                        </Stack>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          alignItems={"start"}
                        >
                          <TitleTextField>
                            คำตอบ<span style={{ color: "red" }}>*</span>
                          </TitleTextField>
                          <Stack spacing={2}>
                            {i.answer.map((j, idx2) => {
                              const fieldName2 = `${fieldName}.answer[${idx2}]`;
                              return (
                                <div key={idx2}>
                                  <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    mb={2}
                                  >
                                    <Typography fontWeight={600}>
                                      คำตอบ {idx2 + 1}:
                                    </Typography>
                                    <IconButton
                                      sx={{
                                        display: idx2 === 0 ? "none" : "block",
                                      }}
                                      onClick={() => deleteAnswer(idx, idx2)}
                                    >
                                      <Close />
                                    </IconButton>
                                  </Stack>
                                  <Stack spacing={2}>
                                    <TextField
                                      label="คำตอบ"
                                      id={`${fieldName2}.choice`}
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      value={j.choice}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      //   error={errorField(idx, "choice", idx2)}
                                      //   helperText={helperTextField(
                                      //     idx,
                                      //     "choice",
                                      //     idx2
                                      //   )}
                                    />
                                    <TextField
                                      label="คะแนน"
                                      id={`${fieldName2}.score`}
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      type="number"
                                      value={j.score}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      //   error={errorField(idx, "score", idx2)}
                                      //   helperText={helperTextField(
                                      //     idx,
                                      //     "score",
                                      //     idx2
                                      //   )}
                                    />
                                    <FormGroup sx={{ alignItems: "start" }} row>
                                      <FormControlLabel
                                        componentsProps={{
                                          typography: {
                                            fontWeight: 600,
                                            fontSize: 16,
                                          },
                                        }}
                                        labelPlacement="start"
                                        control={
                                          <Switch
                                            id={`${fieldName2}.is_true`}
                                            value={j.is_true}
                                            onChange={handleChange}
                                          />
                                        }
                                        label="is_true"
                                      />
                                      <Divider
                                        sx={{ marginLeft: "16px" }}
                                        orientation="vertical"
                                        flexItem
                                      ></Divider>
                                      <FormControlLabel
                                        componentsProps={{
                                          typography: {
                                            fontWeight: 600,
                                            fontSize: 16,
                                          },
                                        }}
                                        labelPlacement="start"
                                        control={
                                          <Switch
                                            id={`${fieldName2}.is_input`}
                                            value={j.is_input}
                                            onChange={handleChange}
                                          />
                                        }
                                        label="is_input"
                                      />
                                    </FormGroup>
                                  </Stack>
                                </div>
                              );
                            })}
                            <Button
                              variant="outlined"
                              onClick={() => addAnswer(idx)}
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
                onClick={() => addQuestion()}
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

export default CreateQuestionPage;

const TitleText = styled(Typography)({
  fontWeight: 600,
  fontSize: 24,
});

const TitleTextField = styled(Typography)({
  fontWeight: 600,
  fontSize: 18,
});
