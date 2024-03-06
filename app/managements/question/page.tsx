"use client";

import Toast from "@/components/common/Toast";
import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import { Delete, Edit } from "@mui/icons-material";
import { TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DModal from "@/components/modal/DModal";
import QuestionService from "@/api/Managements/QuestionService";
import { ITypeQuestion } from "@/redux/question/type";

type Props = {};

const headCells = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "name",
    label: "Name",
  },
  {
    id: "description",
    label: "Description",
  },
];

const QuestionManagementsPage = (props: Props) => {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [dataSearchList, setDataSearchList] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [type, setType] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllQuestionList();
  }, []);

  async function getAllQuestionList() {
    let respons = await QuestionService.getQuestionList().then(
      (res: any) => res
    );
    if (respons.status) {
      respons = respons.result.sort((a: ITypeQuestion, b: ITypeQuestion) => {
        return a.id - b.id;
      });
    }
    setDataList(respons);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else if (params === "edit") {
      router.push(`/managements/question/create/?id=${rows.id}`);
    } else {
      router.push(`/managements/question/create`);
    }
  }

  function deleteQuestion() {
    QuestionService.deleteQuestion(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        getAllQuestionList();
        // location.reload();
      } else {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  useEffect(() => {
    if (search != "") {
      const dataSlice = dataSearchList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setVisibleRows(dataSlice);
      setEmptyRows(
        page > 0
          ? Math.max(0, (1 + page) * rowsPerPage - dataSearchList.length)
          : 0
      );
    } else {
      const dataSlice = dataList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setVisibleRows(dataSlice);
      setEmptyRows(
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0
      );
    }
  }, [dataList, dataSearchList, page, rowsPerPage, search]);

  function searchName(e: any) {
    const name = e.target.value;
    const newData = dataList.filter((i: ITypeQuestion) =>
      i.name.startsWith(name)
    );
    setSearch(name);
    setDataSearchList(newData);
  }

  return (
    <div>
      <HeaderText title="Question Managements" />
      <DataTable
        countData={search != "" ? dataSearchList.length : dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchFunction={searchName}
      >
        <TableBody>
          {visibleRows.map((row: ITypeQuestion, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.description}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => openDialog("edit", row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => openDialog("delete", row)}>
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
      </DataTable>
      <DModal
        open={openDelete}
        setOpen={setOpenDelete}
        confirm={deleteQuestion}
      />
      <Toast
        open={openToast}
        setOpen={setOpenToast}
        msg={toastData.msg}
        status={toastData.status}
      />
    </div>
  );
};

export default QuestionManagementsPage;
