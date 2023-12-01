import { ITypeUser } from "@/redux/user/types";
import { Close } from "@mui/icons-material";
import { Dialog, DialogTitle, Typography, IconButton } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
  title: string;
  children: React.ReactNode;
  resetForm: any;
};

const CUModal = ({
  open,
  setOpen,
  type,
  title,
  children,
  resetForm,
}: Props) => {
  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 3,
          paddingRight: 2,
        }}
      >
        <Typography fontSize={24}>
          {type === "create" ? `Create ${title}` : `Edit ${title}`}
        </Typography>
        <IconButton
          onClick={() => {
            setOpen(false);
            resetForm();
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      {children}
    </Dialog>
  );
};

export default CUModal;
