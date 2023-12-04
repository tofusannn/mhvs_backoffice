"use client";

import UserDashboard from "@/components/dashboard/UserDashboard";
import HeaderText from "@/components/typography/HeaderText";
import { Card, CardContent } from "@mui/material";
import React from "react";

type Props = {};

const DashboardPage = (props: Props) => {
  return (
    <div>
      <HeaderText title="Dashboard" />
      <Card sx={{ boxShadow: "none" }}>
        <CardContent>
          <UserDashboard />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
