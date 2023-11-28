import { Typography } from "@mui/material";
import React from "react";

type Props = {
  title: string;
};

const HeaderText = (props: Props) => {
  return (
    <Typography fontSize={32} fontWeight={700}>
      {props.title}
    </Typography>
  );
};

export default HeaderText;
