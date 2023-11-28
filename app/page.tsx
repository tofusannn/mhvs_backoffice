"use client";

import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Noto_Sans } from "next/font/google";

type ITypeStyled = {
  theme?: any;
  open: boolean;
};

export default function MainPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [reloadPage, setReloadPage] = useState(true);
  const [open, setOpen] = useState(false);

  setTimeout(() => setReloadPage(false), 1000);

  useEffect(() => {
    checkToken();
  }, []);

  function checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      if (pathname === "/login") {
        router.push("/managements/users");
      }
    } else {
      router.push("/login");
    }
  }

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {reloadPage ? (
          <Main>
            <CircularProgress />
          </Main>
        ) : (
          <div>
            {pathname != "/auth" ? (
              <div>
                <Box sx={{ display: "flex" }}>
                  <Navbar open={open} setOpen={setOpen} />
                  <Box sx={{ width: "100%" }}>
                    <BoxMain open={open}>
                      <DrawerHeader />
                      {children}
                    </BoxMain>
                    <BoxFooter open={open}>
                      <Footer />
                    </BoxFooter>
                  </Box>
                </Box>
              </div>
            ) : (
              <Main>{children}</Main>
            )}
          </div>
        )}
      </ThemeProvider>
    </Box>
  );
}

const noto_sans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: noto_sans.style.fontFamily,
    button: {
      textTransform: "none",
    },
  },
});

const Main = styled("div")(({ theme }) => ({
  display: "flex",
  maxWidth: "100%",
  margin: "0 10%",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
}));

const BoxMain = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: ITypeStyled) => ({
  minHeight: "95vh",
  [theme.breakpoints.up("md")]: {
    width: "100%",
    padding: "24px",
  },
  [theme.breakpoints.down("md")]: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${240}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  },
}));

const BoxFooter = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: ITypeStyled) => ({
  minHeight: "5vh",
  [theme.breakpoints.up("md")]: {
    width: "100%",
  },
  [theme.breakpoints.down("md")]: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${240}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
