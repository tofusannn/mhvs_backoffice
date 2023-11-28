import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
  data: any;
};

const CUModal = (props: Props) => {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      maxWidth={"sm"}
      fullWidth
    >
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
          {props.type === "create" ? "Create User" : "Edit User"}
        </Typography>
        <IconButton onClick={() => props.setOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container gap={3}>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              คำนำหน้า<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField sx={{ width: "50%" }} size="small"></TextField>
          </Grid>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              ชื่อจริง<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField sx={{ width: "50%" }} size="small"></TextField>
          </Grid>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              นามสกุล<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField sx={{ width: "50%" }} size="small"></TextField>
          </Grid>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              เชื้อชาติ<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField sx={{ width: "50%" }} size="small"></TextField>
          </Grid>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              เพศ<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField sx={{ width: "50%" }} size="small"></TextField>
          </Grid>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              เบอร์โทรศัพท์<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField sx={{ width: "50%" }} size="small"></TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingY: 3 }}>
        <Button variant="contained" sx={{ width: 345 }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CUModal;
