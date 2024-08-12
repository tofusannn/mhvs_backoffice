"use client";

import LessonService from "@/api/Managements/LessonService";
import Toast from "@/components/common/Toast";
import DModal from "@/components/modal/DModal";
import HeaderText from "@/components/typography/HeaderText";
import { ITypeLesson, ITypeLessonBody } from "@/redux/lesson/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/table/DataTable";
import { IconButton, TableBody, TableCell, TableRow } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Image from "next/image";
import FileService from "@/api/FileService";

const headCells = [
  {
    id: "id",
    label: "ID",
  },
  { id: "img_id", label: "Banner" },
  {
    id: "lesson_name",
    label: "Name",
  },
  {
    id: "lesson_description",
    label: "Description",
  },
  {
    id: "language",
    label: "Language",
  },
  {
    id: "active",
    label: "Status",
  },
];

const LessonManagementsPage = () => {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [dataSearchList, setDataSearchList] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [openToast, setOpenToast] = useState(false);
  const [toastData, setToastData] = useState({ msg: "", status: false });
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllLessonList();
  }, []);

  async function getAllLessonList() {
    let response = await LessonService.getLessonList().then((res: any) => res);
    if (response.msg === "success") {
      response = response.result.sort((a: ITypeLesson, b: ITypeLesson) => {
        return a.id - b.id;
      });
    }

    setDataList(response);
  }

  function openDialog(params: string, rows?: any) {
    if (params === "delete") {
      setOpenDelete(true);
      setIdDelete(rows.id);
    } else if (params === "edit") {
      router.push(`/managements/lesson/create/?id=${rows.id}`);
    } else {
      router.push(`/managements/lesson/create`);
    }
  }

  function deleteLesson() {
    LessonService.deleteLessonById(idDelete).then((res: any) => {
      if (res.msg === "success") {
        setOpenDelete(false);
        setOpenToast(true);
        setToastData({ msg: res.msg, status: true });
        getAllLessonList();
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
    const newData = dataList.filter((i: ITypeLesson) =>
      i.lesson_name.startsWith(name)
    );
    setSearch(name);
    setDataSearchList(newData);
  }

  function getLanguage(lg: string) {
    let newLanguage;
    switch (lg) {
      case "th":
        newLanguage = "Thai";
        break;
      case "mm":
        newLanguage = "Myanmar";
        break;
      case "cd":
        newLanguage = "Cambodia";
        break;
      case "ls":
        newLanguage = "Laos";
        break;
    }
    return newLanguage;
  }

  return (
    <div>
      <HeaderText title="Lesson Managements" />
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
          {visibleRows.map((row: ITypeLesson, index: number) => {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ position: "relative" }}>
                  {row.file_path ? (
                    <Image
                      src={`https://public.aorsortoronline.org${row.file_path}`}
                      alt={"banner"}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.lesson_name}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.lesson_description}
                </TableCell>
                <TableCell>{getLanguage(row.language)}</TableCell>
                <TableCell>{row.active ? "Active" : "InActive"}</TableCell>
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
        confirm={deleteLesson}
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

export default LessonManagementsPage;
