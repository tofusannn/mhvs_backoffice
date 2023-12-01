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
  children: React.ReactNode;
  confirm: () => void;
};

const DModal = (props: Props) => {
  return (
    <Dialog open={props.open} maxWidth={"xs"} fullWidth>
      <DialogContent>
        {props.children}
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
