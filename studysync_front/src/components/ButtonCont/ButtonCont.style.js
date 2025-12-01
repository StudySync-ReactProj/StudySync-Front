// ButtonCont.style.js
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: 500,
  paddingBlock: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.25)",

  "&:hover": {
    // backgroundColor: theme.palette.primary.dark,
    boxShadow: "0px 6px 16px rgba(15, 23, 42, 0.35)",
  },
}));
