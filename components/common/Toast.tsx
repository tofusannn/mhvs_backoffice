import { Alert, Snackbar } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  msg: string;
  status: boolean;
};

const Toast = (props: Props) => {
  function handleClose() {
    props.setOpen(false);
  }

  return (
    <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={props.status ? "success" : "error"}
        sx={{ width: "100%" }}
      >
        {props.msg}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
