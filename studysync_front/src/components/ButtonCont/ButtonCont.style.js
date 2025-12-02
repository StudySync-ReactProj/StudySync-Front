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
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.25)",

  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    boxShadow: "0px 6px 16px rgba(15, 23, 42, 0.35)",
  },
}));
