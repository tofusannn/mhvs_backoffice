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

type Props = {
  children: React.ReactNode;
  countData: number;
  headCells: { id: string; label: string }[];
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  openDialog: (type: string) => void;
  searchFunction: (e: any) => void;
  type?: string;
  lessonList?: ITypeLesson[];
  languageList?: { label: string; value: string }[];
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
  lessonList,
  languageList,
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
        <Button
          sx={{ display: type === "approve" ? "none" : "flex" }}
          variant="contained"
          onClick={() => openDialog("create")}
        >
          Create
        </Button>
      </Grid>
      <Paper sx={{ width: "100%", boxShadow: "none" }}>
        <Stack direction={"row"}>
          <Box sx={{ padding: 2 }}>
            <TextField
              name="search_name"
              size="small"
              placeholder="Search Firstname"
              onChange={searchFunction}
            />
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
              value={type === "approve" && "th"}
              onChange={searchFunction}
              helperText={
                countData === 0 && (
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
              {type === "approve" &&
                languageList?.map((i) => (
                  <MenuItem key={i.value} value={i.value}>
                    {i.label}
                  </MenuItem>
                ))}
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
