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
import { Button, Grid, TextField, Toolbar } from "@mui/material";
import CUModal from "../modal/CUModal";

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
        <Button variant="contained" onClick={() => openDialog("create")}>
          Create
        </Button>
      </Grid>
      <Paper sx={{ width: "100%", boxShadow: "none" }}>
        <Box sx={{ padding: 2 }}>
          <TextField
            size="small"
            placeholder="Search Firstname"
            onChange={searchFunction}
          />
        </Box>
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
