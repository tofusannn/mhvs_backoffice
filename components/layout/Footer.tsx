import { Box, Typography, styled } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <BoxMain>
      <Typography fontWeight={500}>© 2023 Aorsortor Online</Typography>
    </BoxMain>
  );
};

export default Footer;

const BoxMain = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  height: "35px",
  display: "flex",
  alignItems: "center",
  padding: "0px 24px",
}));
