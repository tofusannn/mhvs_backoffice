import DashboardService from "@/api/DashboardService";
import UserService from "@/api/Managements/UserService";
import { CircularProgress, Grid, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
} from "recharts";

const VisitingWebDashboard = () => {
  const [reloadPage, setReloadPage] = useState(true);
  setTimeout(() => setReloadPage(false), 1000);
  const [visitingWeb, setVisitingWeb] = useState(0);

  useEffect(() => {
    getDashboardData();
  }, []);

  async function getDashboardData() {
    const data = await DashboardService.visitingWeb().then((res: any) => {
      return res.result.page_count;
    });
    setVisitingWeb(data);
  }

  return (
    <div>
      {reloadPage ? (
        <Main>
          <CircularProgress />
        </Main>
      ) : (
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
          Visiting Web
          <span style={{ fontSize: 48, color: "#FF8042" }}>
            {" "}
            {visitingWeb}{" "}
          </span>
          Person
        </Typography>
      )}
    </div>
  );
};

export default VisitingWebDashboard;

const Main = styled("div")(({ theme }) => ({
  display: "flex",
  maxWidth: "100%",
  margin: "0 10%",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
}));
