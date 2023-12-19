import { ErrorOutline } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  // children: React.ReactNode;
  confirm: () => void;
};

const DModal = (props: Props) => {
  return (
    <Dialog open={props.open} maxWidth={"xs"} fullWidth>
      <DialogContent>
        <Grid
          sx={{ marginBottom: 3 }}
          container
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid item xs={12} textAlign={"center"} sx={{ marginY: 5 }}>
            <ErrorOutline color="error" sx={{ fontSize: "100px" }} />
          </Grid>
          <Typography fontSize={32} fontWeight={500}>
            คุณต้องการลบใช่มั้ย ?
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                props.setOpen(false);
              }}
            >
              ไม่ยืนยัน
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                props.confirm();
              }}
            >
              ยืนยัน
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DModal;
