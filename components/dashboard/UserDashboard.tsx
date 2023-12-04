import UserService from "@/api/Managements/UserService";
import { CircularProgress, Grid, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";

const UserDashboard = () => {
  const [reloadPage, setReloadPage] = useState(true);
  setTimeout(() => setReloadPage(false), 1000);
  const [nationality, setNationality] = useState([{ name: "", value: 0 }]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    getDashboardData();
  }, []);

  async function getDashboardData() {
    const data = await UserService.getUserList().then((res: any) => {
      return res.result;
    });
    const thaiData = data.filter((i: any) => i.nationality === "thai");
    const laosData = data.filter((i: any) => i.nationality === "laos");
    const myanmarData = data.filter((i: any) => i.nationality === "myanmar");
    const cambodiaData = data.filter((i: any) => i.nationality === "cambodia");
    const newArray = [
      { name: "Thailand", value: thaiData.length },
      { name: "Laos", value: laosData.length },
      { name: "Myanmar", value: myanmarData.length },
      { name: "Cambodia", value: cambodiaData.length },
    ];
    setNationality(newArray);
  }

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          Nationality
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name}: ${value} Person`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div>
      {reloadPage ? (
        <Main>
          <CircularProgress />
        </Main>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={nationality}
                cx={300}
                cy={200}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                label={renderActiveShape}
                dataKey="value"
              >
                {nationality.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

const Main = styled("div")(({ theme }) => ({
  display: "flex",
  maxWidth: "100%",
  margin: "0 10%",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
}));
