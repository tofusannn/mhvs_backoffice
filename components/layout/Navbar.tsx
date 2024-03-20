"use client";

import {
  Assessment,
  Book,
  ContentCopy,
  Dashboard,
  LibraryBooks,
  Menu,
  MenuBook,
  Person,
  QuestionAnswer,
  QuestionMark,
  Send,
  ViewCarousel,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  List,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ListItemButtonCT from "../common/ListItemButtonCT";
import AuthService from "@/api/AuthService";
import Cookies from "js-cookie";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NavBar = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    props.setOpen(!open);
  };

  function logoutUser() {
    AuthService.logout().then((res: any) => {
      if (res.msg === "success") {
        Cookies.set("token", "");
        router.push("/auth");
      }
    });
  }

  const menuList = (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListSubheader
        component="div"
        id="nested-list-subheader"
        sx={{ fontSize: "16px" }}
      >
        Dashboard
      </ListSubheader>
      <ListItemButtonCT
        title="Dashboard"
        link="/dashboard"
        icon={<Dashboard fontSize="small" />}
      />
      <ListSubheader
        component="div"
        id="nested-list-subheader"
        sx={{ fontSize: "16px" }}
      >
        Managements
      </ListSubheader>
      <ListItemButtonCT
        title="Users"
        link="/managements/users"
        icon={<Person fontSize="small" />}
      />
      <ListItemButtonCT
        title="Lesson"
        link="/managements/lesson"
        actions="create"
        icon={<Book fontSize="small" />}
      />
      <ListItemButtonCT
        title="Chapter"
        link="/managements/chapter"
        actions="create"
        icon={<MenuBook fontSize="small" />}
      />
      <ListItemButtonCT
        title="Approve User Homework"
        link="/managements/approve_user_homework"
        icon={<LibraryBooks fontSize="small" />}
      />
      <ListItemButtonCT
        title="Question"
        link="/managements/question"
        actions="create"
        icon={<QuestionMark fontSize="small" />}
      />
      <ListItemButtonCT
        title="Questionnaire"
        link="/managements/question_cer"
        actions="create"
        icon={<QuestionAnswer fontSize="small" />}
      />
      <ListItemButtonCT
        title="Banner"
        link="/managements/banner"
        icon={<ViewCarousel fontSize="small" />}
      />
      <ListItemButtonCT
        title="Content"
        link="/managements/content"
        icon={<ContentCopy fontSize="small" />}
      />
      <ListSubheader
        component="div"
        id="nested-list-subheader"
        sx={{ fontSize: "16px" }}
      >
        Reports
      </ListSubheader>
      <ListItemButtonCT
        title="Report"
        link="/reports/report"
        icon={<Assessment fontSize="small" />}
      />
    </List>
  );
  return (
    <div>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6" noWrap component="div">
              MHVS Backoffice
            </Typography>
            {/* <Typography>{Cookies.get("token")}</Typography> */}
            <Button sx={{ color: "#fff" }} onClick={() => logoutUser()}>
              Logout
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: "block", md: "none" },
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>{menuList}</Box>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>{menuList}</Box>
        </Drawer>
      </Box>
    </div>
  );
};

export default NavBar;
