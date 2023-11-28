"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  SetStateAction,
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useMemo,
  useState,
} from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import CUModal from "../modal/CUModal";
import { ITypeUser } from "@/redux/user/types";

type Props = {
  dataList: any;
};

const headCells = [
  {
    id: "index",
    label: "No.",
  },
  {
    id: "img_id",
    label: "Image",
  },
  {
    id: "pre_name",
    label: "Fullname",
  },
  {
    id: "nationality",
    label: "Nationality",
  },
  {
    id: "gender",
    label: "Gender",
  },
  {
    id: "phone",
    label: "Phone Number",
  },
];

export default function DataTable(props: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [data, setData] = useState({});

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - props.dataList.length)
      : 0;

  const visibleRows = useMemo(
    () =>
      props.dataList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [props.dataList, page, rowsPerPage]
  );

  function openDialog(params: string) {
    if (params === "delete") {
      return;
    } else if (params === "edit") {
      setType(params);
      setOpen(true);
    } else {
      setType(params);
      setOpen(true);
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container justifyContent={"end"} mb={2}>
        <Button variant="contained" onClick={() => openDialog("create")}>
          Create
        </Button>
      </Grid>
      <Paper sx={{ width: "100%", boxShadow: "none" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((row, index) => {
                  return <TableCell key={row.id}>{row.label}</TableCell>;
                })}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row: ITypeUser, index: number) => {
                return (
                  <TableRow tabIndex={-1} key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.image}</TableCell>
                    <TableCell>
                      {row.pre_name === "mr" ? "นาย" : "นางสาว"}{" "}
                      {row.first_name} {row.last_name}
                    </TableCell>
                    <TableCell>
                      {row.nationality.charAt(0).toUpperCase() +
                        row.nationality.slice(1)}
                    </TableCell>
                    <TableCell>
                      {row.gender.charAt(0).toUpperCase() + row.gender.slice(1)}
                    </TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openDialog("edit")}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => openDialog("delete")}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 50, 100]}
          count={props.dataList.length}
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
      <CUModal open={open} setOpen={setOpen} type={type} data={data} />
    </Box>
  );
}
