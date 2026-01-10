import { styled } from "@mui/material/styles";
import { TableContainer, TableRow, TableCell, Box, Paper } from "@mui/material";

/** The outer card/container of the table */
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  width: "80%",
  boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.12)",
  backgroundColor: "#F5F7FA",
  '& .MuiTableCell-root': {
    padding: '8px 16px',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    color: "#0D3682",
  },
  '& .MuiTableBody-root .MuiTableCell-root': {
    color: "#051738",
  },
  '& .MuiTableRow-root': {
    height: '48px',
  }
}));




