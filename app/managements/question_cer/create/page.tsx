"use client";

import * as yup from "yup";
import HeaderText from "@/components/typography/HeaderText";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ITypeQuestionCerBody } from "@/redux/question_cer/type";
import Toast from "@/components/common/Toast";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import QuestionService from "@/api/Managements/QuestionService";
import { Close, AddCircleOutline } from "@mui/icons-material";
import { Formik, Form, FieldArray, getIn } from "formik";
import QuestionCerService from "@/api/Managements/QuestionCer";

type Props = {};

const initialValues: ITypeQuestionCerBody = {
  name: "",
  description: "",
  question: [
    {
      question: "",
      answer: [
        {
          choice: "",
          is_input: false,
        },
      ],
    },
  ],
};

const questionCerObj = {
  question: "",
  answer: [
    {
      choice: "",
      is_input: false,
    },
  ],
};

const answerObj = {
  choice: "",
  is_input: false,
};

const CreateQuestionnairePage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [dataForm, setDataForm] = useState(initialValues);
  const id = searchParams.get("id");
  const [reloadPage, setReloadPage] = useState(true);
  setTimeout(() => setReloadPage(false), 1000);
  useEffect(() => {
    if (id) {
      getQuestionCerById(parseInt(id));
    }
  }, []);

  function getQuestionCerById(id: number) {
    QuestionCerService.getQuestionCerById(id).then((res: any) => {
      if (res.msg === "success") {
        setDataForm(res.result);
      } else {
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  const validationSchema = yup.object({
    name: yup.string().required("โปรดระบุ"),
    description: yup.string().required("โปรดระบุ"),
    question: yup.array().of(
      yup.object().shape({
        question: yup.string().required("โปรดระบุ"),
        answer: yup.array().of(
          yup.object().shape({
            choice: yup.string().required("โปรดระบุ"),
          })
        ),
      })
    ),
  });

  return (
    <div>
      <HeaderText title="Create Questionnaire" />
      {reloadPage ? (
        <Main>
          <CircularProgress />
        </Main>
      ) : (
        <Box sx={{ position: "relative", marginTop: 3 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              QuestionCerService.postQuestionCer(values).then((res: any) => {
                if (res.msg === "success") {
                  setOpenToast(true);
                  setToastData({ msg: res.msg, status: true });
                  setTimeout(() => {
                    router.push("/managements/question_cer");
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
                                    <TitleText>Questionnaire Header</TitleText>
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
                                        <TitleText>
                                          Questionnaire {idx + 1}
                                        </TitleText>
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
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
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
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
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
                                                    arrayHelpers2.push(
                                                      answerObj
                                                    )
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
                              onClick={() => arrayHelpers.push(questionCerObj)}
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

export default CreateQuestionnairePage;

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
