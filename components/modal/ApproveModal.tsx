import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const ApproveModal = (props: Props) => {
  return (
    <Dialog open={props.open} maxWidth={"md"} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          paddingBottom: 3,
          paddingRight: 2,
        }}
      >
        <IconButton
          onClick={() => {
            props.setOpen(false);
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>{props.children}</DialogContent>
    </Dialog>
  );
};

export default ApproveModal;
