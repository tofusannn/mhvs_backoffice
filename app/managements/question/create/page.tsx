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
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  getIn,
  useFormik,
} from "formik";
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

const answerObj = {
  choice: "",
  score: 0,
  is_true: false,
  is_input: false,
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
    question: yup.array().of(
      yup.object().shape({
        question: yup.string().required("โปรดระบุ"),
        answer: yup.array().of(
          yup.object().shape({
            choice: yup.string().required("โปรดระบุ"),
            score: yup.number().min(1, "โปรดระบุ").required("โปรดระบุ"),
          })
        ),
      })
    ),
  });

  return (
    <div>
      <HeaderText title="Create Question" />
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            QuestionService.postQuestion(values).then((res: any) => {
              if (res.msg === "success") {
                setOpenToast(true);
                setToastData({ msg: res.msg, status: true });
                setTimeout(() => {
                  router.push("/managements/question");
                }, 1000);
              } else {
                setOpenToast(true);
                setToastData({ msg: res.msg, status: false });
              }
            });
          }}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            getFieldProps,
          }) => (
            <Form>
              <Box sx={{ minHeight: "70vh", paddingBottom: 30 }}>
                <FieldArray
                  name={`question`}
                  render={(arrayHelpers) => {
                    function errorFields(name: string) {
                      const error = getIn(errors, name);
                      const touch = getIn(touched, name);
                      return touch && error ? error : null;
                    }
                    return (
                      <div>
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
                                    หัวข้อ
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <Stack spacing={2}>
                                    <TextField
                                      label="หัวข้อ"
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      {...getFieldProps(`name`)}
                                      error={errorFields(`name`)}
                                      helperText={errorFields(`name`)}
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
                                      label="รายละเอียด"
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      {...getFieldProps(`description`)}
                                      error={errorFields(`description`)}
                                      helperText={errorFields(`description`)}
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
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      type="number"
                                      {...getFieldProps(`estimate_score_pre`)}
                                      error={errorFields(`estimate_score_pre`)}
                                      helperText={errorFields(
                                        `estimate_score_pre`
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
                                    estimate_score_quiz
                                    <span style={{ color: "red" }}>*</span>
                                  </TitleTextField>
                                  <Stack spacing={2}>
                                    <TextField
                                      label="estimate_score_quiz"
                                      sx={{ width: 345 }}
                                      fullWidth
                                      size="small"
                                      type="number"
                                      {...getFieldProps(`estimate_score_quiz`)}
                                      error={errorFields(`estimate_score_quiz`)}
                                      helperText={errorFields(
                                        `estimate_score_quiz`
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
                          {values.question.map((i, idx) => {
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
                                        คำถาม
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <Stack spacing={2}>
                                        <TextField
                                          label="คำถาม"
                                          sx={{ width: 345 }}
                                          fullWidth
                                          size="small"
                                          {...getFieldProps(
                                            `question.${idx}.question`
                                          )}
                                          error={errorFields(
                                            `question.${idx}.question`
                                          )}
                                          helperText={errorFields(
                                            `question.${idx}.question`
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
                                        คำตอบ
                                        <span style={{ color: "red" }}>*</span>
                                      </TitleTextField>
                                      <FieldArray
                                        name={`question.${idx}.answer`}
                                        render={(arrayHelpers2) => (
                                          <div>
                                            <Stack spacing={2}>
                                              {i.answer.map((j, idx2) => {
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
                                                        คำตอบ {idx2 + 1}:
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
                                                        label="คำตอบ"
                                                        sx={{ width: 345 }}
                                                        fullWidth
                                                        size="small"
                                                        {...getFieldProps(
                                                          `question.${idx}.answer.${idx2}.choice`
                                                        )}
                                                        error={errorFields(
                                                          `question.${idx}.answer.${idx2}.choice`
                                                        )}
                                                        helperText={errorFields(
                                                          `question.${idx}.answer.${idx2}.choice`
                                                        )}
                                                      />
                                                      <TextField
                                                        label="คะแนน"
                                                        sx={{ width: 345 }}
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        {...getFieldProps(
                                                          `question.${idx}.answer.${idx2}.score`
                                                        )}
                                                        error={errorFields(
                                                          `question.${idx}.answer.${idx2}.score`
                                                        )}
                                                        helperText={errorFields(
                                                          `question.${idx}.answer.${idx2}.score`
                                                        )}
                                                      />
                                                      <FormGroup
                                                        sx={{
                                                          alignItems: "start",
                                                        }}
                                                        row
                                                      >
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
                                                              {...getFieldProps(
                                                                `question.${idx}.answer.${idx2}.is_true`
                                                              )}
                                                              onChange={
                                                                handleChange
                                                              }
                                                            />
                                                          }
                                                          label="is_true"
                                                        />
                                                        <Divider
                                                          sx={{
                                                            marginLeft: "16px",
                                                          }}
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
                                                              {...getFieldProps(
                                                                `question.${idx}.answer.${idx2}.is_input`
                                                              )}
                                                              onChange={
                                                                handleChange
                                                              }
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
                                                onClick={() =>
                                                  arrayHelpers2.push(answerObj)
                                                }
                                              >
                                                +
                                              </Button>
                                            </Stack>
                                          </div>
                                        )}
                                      ></FieldArray>
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
                            onClick={() => arrayHelpers.push(questionObj)}
                          >
                            <AddCircleOutline color="info" />
                          </Button>
                        </Stack>
                      </div>
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
