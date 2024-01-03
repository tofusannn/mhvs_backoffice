import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {
  title: string;
  link: string;
  icon: React.ReactElement<any>;
  actions?: string;
};

const ListItemButtonCT = (props: Props) => {
  const { push } = useRouter();
  const pathname = usePathname();

  function selectMenu(link: string) {
    push(link);
    setTimeout(() => {
      if (props.title === "Chapter") {
        location.reload();
      }
    }, 100);
  }

  return (
    <ListItemButtonCustom
      onClick={() => selectMenu(props.link)}
      sx={{
        backgroundColor:
          pathname === props.link ||
          pathname === `${props.link}/${props.actions}`
            ? "#72D0F872"
            : "#fff",
      }}
    >
      <ColorBar
        sx={{
          backgroundColor:
            pathname === props.link ||
            pathname === `${props.link}${props.actions}`
              ? "#4fc3f7"
              : "#fff",
        }}
      />
      <ListItemIcon sx={{ justifyContent: "center" }}>
        {props.icon}
      </ListItemIcon>
      <ListItemText primary={props.title} sx={{ fontSize: "10px" }} />
    </ListItemButtonCustom>
  );
};

export default ListItemButtonCT;

const ListItemButtonCustom = styled(ListItemButton)({
  marginRight: "24px",
  borderRadius: "0px 24px 24px 0px",
});

const ColorBar = styled(Box)({
  left: "0px",
  top: "0px",
  position: "absolute",
  display: "inline-block",
  width: "8px",
  height: "100%",
});
