"use client";

import LessonService from "@/api/Managements/LessonService";
import { ITypeChapter, ITypeChapterBody } from "@/redux/chapter/types";
import { ITypeLesson } from "@/redux/lesson/types";
import router from "next/router";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import ChapterService from "@/api/Managements/ChapterService";
import Toast from "@/components/common/Toast";
import DModal from "@/components/modal/DModal";
import DataTable from "@/components/table/DataTable";
import HeaderText from "@/components/typography/HeaderText";
import { Delete, Edit } from "@mui/icons-material";
import { TableBody, TableRow, TableCell, IconButton } from "@mui/material";

const headCells = [
  {
    id: "index",
    label: "No.",
  },
  {
    id: "chapter_name",
    label: "Name",
  },
  {
    id: "chapter_pre_description",
    label: "Description",
  },
  {
    id: "lesson_id",
    label: "Lesson Id",
  },
];

const ChapterManagementsPage = () => {
  const router = useRouter();
  const [lessonList, setLessonList] = useState<ITypeLesson[]>([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [dataList, setDataList] = useState([]);
  const [dataSearchList, setDataSearchList] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    getAllLessonList();
    if (searchParams) {
      let id = searchParams.get("id");
      if (id) {
        searchName({ target: { name: "", value: id } });
      }
    }
  }, []);

  async function getAllLessonList() {
    let respons = await LessonService.getLessonList().then((res: any) => res);
    if (respons.status) {
      respons = respons.result.sort((a: ITypeLesson, b: ITypeLesson) => {
        return a.id - b.id;
      });
    } else {
      alert("Token Expire");
      Cookies.set("token", "");
      router.push("/auth");
    }
    setLessonList(respons);
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

  async function searchName(e: any) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "search_name") {
      const newData = dataList.filter((i: ITypeChapter) =>
        i.chapter_name.startsWith(value)
      );
      setDataSearchList(newData);
    } else {
      let respons = await ChapterService.getChapterByLessonId(value).then(
        (res: any) => res
      );
      if (respons.status) {
        respons = respons.result.sort((a: ITypeChapter, b: ITypeChapter) => {
          return a.index - b.index;
        });
      } else {
        alert("Token Expire");
        Cookies.set("token", "");
        router.push("/auth");
      }
      setDataList(respons);
      setDataSearchList(respons);
      router.replace(`/managements/chapter/?id=${value}`);
    }
    setSearch(value);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.index);
    } else {
      router.push(`/managements/chapter/create/?id=${search}`);
    }
  }

  function deleteChapter() {
    ChapterService.deleteChapterById(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: false });
      }
    });
  }

  return (
    <div>
      <HeaderText title="Chapter Managements" />
      <DataTable
        countData={search != "" ? dataSearchList.length : dataList.length}
        headCells={headCells}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        openDialog={openDialog}
        searchValue={search}
        searchFunction={searchName}
        type={"chapter"}
        lessonList={lessonList}
      >
        <TableBody>
          {visibleRows.map((row: ITypeChapter, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.index}>
                <TableCell>{row.index}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.chapter_name}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.chapter_pre_description}
                </TableCell>
                <TableCell>{row.lesson_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openDialog("edit", row)}>
                    <Edit />
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
        confirm={deleteChapter}
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

export default ChapterManagementsPage;
