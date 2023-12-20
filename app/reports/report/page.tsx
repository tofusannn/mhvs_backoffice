"use client";

import ReportsService from "@/api/ReportsService";
import HeaderText from "@/components/typography/HeaderText";
import {
  ITypeUserAns,
  ITypeUserLesson,
  ITypeUserQus,
} from "@/redux/reports/types";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState } from "react";

type Props = {};

let dataAns: ITypeUserAns = {
  start_date: "",
  end_date: "",
  quiz_type: "",
  lesson_id: "",
};

let dataLesson: ITypeUserLesson = {
  start_date: "",
  end_date: "",
  lesson_id: "",
};

let dataQus: ITypeUserQus = {
  start_date: "",
  end_date: "",
  lesson_id: "",
};

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
  const [paramsAns, setParamsAns] = useState(dataAns);
  const [paramsLesson, setParamsLesson] = useState(dataLesson);
  const [paramsQus, setParamsQus] = useState(dataQus);

  function downloadFile(type: string) {
    switch (type) {
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
            <Title>User Answer</Title>
            <Stack direction={"row"} spacing={2} my={2}>
              <DatePicker
                format="YYYY-MM-DD"
                label="Start Date"
                onChange={(e) => setParams(e, "start_date", "ans")}
              />
              <DatePicker
                format="YYYY-MM-DD"
                label="End Date"
                onChange={(e) => setParams(e, "end_date", "ans")}
              />
              <TextField
                label="Quiz Type"
                onChange={(e) => setParams(e, "quiz_type", "ans")}
              ></TextField>
              <TextField
                label="Lesson ID"
                onChange={(e) => setParams(e, "lesson_id", "ans")}
              ></TextField>
            </Stack>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              onClick={() => downloadFile("ans")}
            >
              Submit
            </Button>
            <Title>User Lesson</Title>
            <Stack direction={"row"} spacing={2} my={2}>
              <DatePicker
                format="YYYY-MM-DD"
                label="Start Date"
                onChange={(e) => setParams(e, "start_date", "lesson")}
              />
              <DatePicker
                format="YYYY-MM-DD"
                label="End Date"
                onChange={(e) => setParams(e, "end_date", "lesson")}
              />
              <TextField
                label="Lesson ID"
                onChange={(e) => setParams(e, "lesson_id", "lesson")}
              ></TextField>
            </Stack>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              onClick={() => downloadFile("lesson")}
            >
              Submit
            </Button>
            <Title>User Questionnaire</Title>
            <Stack direction={"row"} spacing={2} my={2}>
              <DatePicker
                format="YYYY-MM-DD"
                label="Start Date"
                onChange={(e) => setParams(e, "start_date", "qus")}
              />
              <DatePicker
                format="YYYY-MM-DD"
                label="End Date"
                onChange={(e) => setParams(e, "end_date", "qus")}
              />
              <TextField
                label="Lesson ID"
                onChange={(e) => setParams(e, "lesson_id", "qus")}
              ></TextField>
            </Stack>
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
