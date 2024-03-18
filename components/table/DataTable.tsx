"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import CUModal from "../modal/CUModal";
import { ITypeLesson } from "@/redux/lesson/types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Props = {
  children: React.ReactNode;
  countData: number;
  headCells: { id: string; label: string }[];
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  openDialog: (type: string, rows?: string) => void;
  searchFunction: (e: any, name?: string) => void;
  type?: string;
  type2?: string;
  lessonList?: ITypeLesson[];
  languageList?: { label: string; value: string }[];
  searchValue?: string;
};

export default function DataTable({
  children,
  countData,
  headCells,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  openDialog,
  searchFunction,
  type,
  type2,
  lessonList,
  languageList,
  searchValue,
}: Props) {
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container justifyContent={"end"} mb={2}>
        {type === "chapter" ? (
          countData > 0 ? (
            <div />
          ) : (
            searchValue != "" && (
              <Button variant="contained" onClick={() => openDialog("create")}>
                Create
              </Button>
            )
          )
        ) : (
          <Button
            sx={{ display: type === "approve" ? "none" : "flex" }}
            variant="contained"
            onClick={() => openDialog("create")}
          >
            Create
          </Button>
        )}
      </Grid>
      <Paper sx={{ width: "100%", boxShadow: "none" }}>
        <Stack direction={"row"}>
          <Box
            sx={{
              padding: "16px 0px 16px 16px",
              gap: 2,
              display: type === "banner" ? "none" : "flex",
            }}
          >
            <TextField
              name="search_name"
              size="small"
              placeholder="Search Name"
              onChange={searchFunction}
            />
            <TextField
              sx={{ display: type2 === "user" ? "block" : "none" }}
              name="search_phone"
              size="small"
              placeholder="Search Phone"
              onChange={searchFunction}
            />
            <Box display={"flex"} gap={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="search_start_date"
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  sx={{
                    width: "100%",
                    display:
                      type2 === "user" || type2 === "approve"
                        ? "block"
                        : "none",
                  }}
                  format="DD/MM/YYYY"
                  label="Start Date"
                  onChange={(e) => searchFunction(e, "start_date")}
                />
                <DatePicker
                  name="search_end_date"
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  sx={{
                    width: "100%",
                    display:
                      type2 === "user" || type2 === "approve"
                        ? "block"
                        : "none",
                  }}
                  format="DD/MM/YYYY"
                  label="End Date"
                  onChange={(e) => searchFunction(e, "end_date")}
                />
              </LocalizationProvider>
            </Box>
          </Box>
          <Box
            sx={{ width: "20%", padding: 2, display: type ? "block" : "none" }}
          >
            <TextField
              name={type === "chapter" ? "lesson_id" : "language"}
              select
              fullWidth
              size="small"
              placeholder={
                type === "chapter" ? "Search Lesson" : "Search Language"
              }
              value={
                type === "approve" || type === "banner"
                  ? searchValue
                  : type === "chapter"
                    ? searchValue
                    : ""
              }
              onChange={searchFunction}
              helperText={
                searchValue === "" && (
                  <span style={{ color: "red" }}>
                    {type === "chapter" && "*กรุณาเลือกบทเรียน"}
                    {type === "approve" && "*กรุณาเลือกภาษา"}
                  </span>
                )
              }
            >
              {type === "chapter" &&
                lessonList?.map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.lesson_name}
                  </MenuItem>
                ))}
              {type === "approve" || type === "banner" ? (
                languageList?.map((i) => (
                  <MenuItem key={i.value} value={i.value}>
                    {i.label}
                  </MenuItem>
                ))
              ) : (
                <div />
              )}
            </TextField>
          </Box>
        </Stack>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {headCells.map((row, index) => {
                  return <TableCell key={row.id}>{row.label}</TableCell>;
                })}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {children}
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 50, 100]}
          count={countData}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        ></TablePagination>
      </Paper>
    </Box>
  );
}
