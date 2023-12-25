"use client";

import ApproveCerDashboard from "@/components/dashboard/ApproveCerDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import VisitingWebDashboard from "@/components/dashboard/VisitingWebDashboard";
import WaitApproveDashboard from "@/components/dashboard/WaitApproveDashboard";
import HeaderText from "@/components/typography/HeaderText";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

type Props = {};

const DashboardPage = (props: Props) => {
  return (
    <div>
      <HeaderText title="Dashboard" />
      <Card sx={{ boxShadow: "none", marginTop: 3, minHeight: "100vh" }}>
        <CardContent>
          <Stack direction="row" useFlexGap flexWrap="wrap">
            <Box sx={{ width: "100%", marginBottom: 3 }}>
              <VisitingWebDashboard />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TitleText>Wait Approve</TitleText>
              <WaitApproveDashboard />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TitleText>Approve Certificate</TitleText>
              <ApproveCerDashboard />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TitleText>User Nationality</TitleText>
              <UserDashboard />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 20,
}));
