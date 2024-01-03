"use client";

import Toast from "@/components/common/Toast";
import DModal from "@/components/modal/DModal";
import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import { Delete } from "@mui/icons-material";
import { TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ITypeQuestionCer } from "@/redux/question_cer/type";
import Cookies from "js-cookie";
import QuestionCerService from "@/api/Managements/QuestionCer";

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

const QuestionnaireManagementsPage = (props: Props) => {
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
    getAllQuestionnaireList();
  }, []);

  async function getAllQuestionnaireList() {
    let respons = await QuestionCerService.getQuestionCerList().then(
      (res: any) => res
    );
    if (respons.status) {
      respons = respons.result.sort(
        (a: ITypeQuestionCer, b: ITypeQuestionCer) => {
          return a.id - b.id;
        }
      );
    } else {
      alert("Token Expire");
      Cookies.set("token", "");
      router.push("/auth");
    }
    setDataList(respons);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else {
      router.push(`/managements/question_cer/create`);
    }
  }

  function deleteQuestionCer() {
    QuestionCerService.deleteQuestionCer(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        getAllQuestionnaireList();
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
    const newData = dataList.filter((i: ITypeQuestionCer) =>
      i.name.startsWith(name)
    );
    setSearch(name);
    setDataSearchList(newData);
  }

  return (
    <div>
      <HeaderText title="Questionnaire Managements" />
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
          {visibleRows.map((row: ITypeQuestionCer, index: number) => {
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
                  {/* <IconButton onClick={() => openDialog("edit", row)}>
                    <Edit />
                  </IconButton> */}
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
        confirm={deleteQuestionCer}
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

export default QuestionnaireManagementsPage;
