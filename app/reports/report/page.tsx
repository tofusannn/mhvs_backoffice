"use client";

import ReportsService from "@/api/ReportsService";
import HeaderText from "@/components/typography/HeaderText";
import {
  ITypeUser,
  ITypeUserAns,
  ITypeUserLesson,
  ITypeUserQus,
} from "@/redux/reports/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LessonService from "@/api/Managements/LessonService";
import { ITypeLesson } from "@/redux/lesson/types";
import { useRouter } from "next/navigation";

type Props = {};

const dataUser: ITypeUser = {
  start_date: "",
  end_date: "",
};

const dataAns: ITypeUserAns = {
  start_date: "",
  end_date: "",
  quiz_type: "",
  lesson_id: "",
};

const dataLesson: ITypeUserLesson = {
  start_date: "",
  end_date: "",
  lesson_id: "",
};

const dataQus: ITypeUserQus = {
  start_date: "",
  end_date: "",
  lesson_id: "",
};

const quizList = [
  { name: "Pre", value: "pre" },
  { name: "Quiz", value: "quiz" },
];

function downloadCSV(res: any) {
  const url = window.URL.createObjectURL(new Blob([res]));
  const link = document.createElement("a");
  link.href = url;
  const fileName = `downloaded Report ${dayjs(new Date()).format(
    "DD MMM YY"
  )}.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const ReportPage = (props: Props) => {
  const router = useRouter();
  const [paramsUser, setParamsUser] = useState(dataUser);
  const [paramsAns, setParamsAns] = useState(dataAns);
  const [paramsLesson, setParamsLesson] = useState(dataLesson);
  const [paramsQus, setParamsQus] = useState(dataQus);
  const [lessonList, setLessonList] = useState<ITypeLesson[]>([]);

  useEffect(() => {
    getAllLessonList();
  }, []);

  async function getAllLessonList() {
    let respons = await LessonService.getLessonList().then((res: any) => res);
    if (respons.status) {
      respons = respons.result.sort((a: ITypeLesson, b: ITypeLesson) => {
        return a.id - b.id;
      });
    }
    setLessonList(respons);
  }

  function downloadFile(type: string) {
    switch (type) {
      case "user":
        ReportsService.downloadFileUser(paramsUser).then((res: any) => {
          downloadCSV(res);
        });
        break;
      case "ans":
        ReportsService.downloadFileUserAns(paramsAns).then((res: any) => {
          downloadCSV(res);
        });
        break;
      case "lesson":
        ReportsService.downloadFileUserLesson(paramsLesson).then((res: any) => {
          downloadCSV(res);
        });
        break;
      case "qus":
        ReportsService.downloadFileUserQus(paramsQus).then((res: any) => {
          downloadCSV(res);
        });
        break;
    }
  }

  function setParams(e: any, name: string, type: string) {
    let value: any;
    if (e.target) {
      value = e.target.value;
    } else {
      value = dayjs(e).format("YYYY-MM-DD");
    }
    switch (type) {
      case "user":
        setParamsUser((i) => ({ ...i, [name]: value }));
        break;
      case "ans":
        setParamsAns((i) => ({ ...i, [name]: value }));
        break;
      case "lesson":
        setParamsLesson((i) => ({ ...i, [name]: value }));
        break;
      case "qus":
        setParamsQus((i) => ({ ...i, [name]: value }));
        break;
    }
  }

  return (
    <div>
      <HeaderText title="Report" />
      <Card sx={{ boxShadow: "none", marginTop: 3 }}>
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <Title>User</Title>
            <Grid container columnGap={2} my={2}>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="Start Date"
                  onChange={(e) => setParams(e, "start_date", "user")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="End Date"
                  onChange={(e) => setParams(e, "end_date", "user")}
                />
              </Grid>
            </Grid>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              onClick={() => downloadFile("user")}
            >
              Submit
            </Button>


            <Title>User Answer</Title>
            <Grid container columnGap={2} my={2}>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="Start Date"
                  onChange={(e) => setParams(e, "start_date", "ans")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="End Date"
                  onChange={(e) => setParams(e, "end_date", "ans")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  select
                  fullWidth
                  label="Quiz Type"
                  onChange={(e) => setParams(e, "quiz_type", "ans")}
                >
                  {quizList.map((i, index) => (
                    <MenuItem key={index} value={i.value}>
                      {i.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  select
                  fullWidth
                  label="Lesson"
                  onChange={(e) => setParams(e, "lesson_id", "ans")}
                >
                  {lessonList.map((i, index) => (
                    <MenuItem key={index} value={i.id}>
                      {i.lesson_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              onClick={() => downloadFile("ans")}
            >
              Submit
            </Button>
            <Title>User Lesson</Title>
            <Grid container columnGap={2} my={2}>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="Start Date"
                  onChange={(e) => setParams(e, "start_date", "lesson")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="End Date"
                  onChange={(e) => setParams(e, "end_date", "lesson")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  select
                  fullWidth
                  label="Lesson"
                  onChange={(e) => setParams(e, "lesson_id", "lesson")}
                >
                  {lessonList.map((i, index) => (
                    <MenuItem key={index} value={i.id}>
                      {i.lesson_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              onClick={() => downloadFile("lesson")}
            >
              Submit
            </Button>
            <Title>User Questionnaire</Title>
            <Grid container columnGap={2} my={2}>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="Start Date"
                  onChange={(e) => setParams(e, "start_date", "qus")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  label="End Date"
                  onChange={(e) => setParams(e, "end_date", "qus")}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  select
                  fullWidth
                  label="Lesson"
                  onChange={(e) => setParams(e, "lesson_id", "qus")}
                >
                  {lessonList.map((i, index) => (
                    <MenuItem key={index} value={i.id}>
                      {i.lesson_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              onClick={() => downloadFile("qus")}
            >
              Submit
            </Button>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
}));
