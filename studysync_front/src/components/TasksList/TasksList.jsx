
// MUI components for building the table UI
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledTableContainer } from './TasksList.style.js';
import tasksData from '../../data/tasksData.json';

// Row component - renders each individual task row with expandable description
function Row(props) {
  const { row } = props;
  // State to track if the row is expanded or collapsed
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      {/* Main row displaying task information */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {/* Expand/collapse button */}
        <TableCell> 
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* Task details cells */}
        <TableCell component="th" scope="row">
          {row.taskName}
        </TableCell>
        <TableCell align="right">{row.priority}</TableCell>
        <TableCell align="right">{row.dueDate}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
      </TableRow>
      {/* Collapsible row that shows the task description */}
      <TableRow sx={{ display: open ? 'table-row' : 'none' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <Typography variant="body2">
                {row.description}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// PropTypes validation for Row component
Row.propTypes = {
  row: PropTypes.shape({
    taskName: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

// Main component - renders the complete tasks table
export default function CollapsibleTable() {
  // Transform JSON data into the format needed for the table
  const rows = tasksData.tasks.map(task => ({
    id: task.id,
    taskName: task.task,
    priority: task.priority,
    dueDate: task.dueDate,
    status: task.status,
    description: task.description,
  }));

  return (
    <StyledTableContainer sx={{ width: '70%' }} component={Paper} >
      <Table aria-label="collapsible table">
        {/* Table header with column labels */}
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '30px' }} /> {/* Column for expand button */}
            <TableCell sx={{ width: '40%' }}>Task</TableCell>
            <TableCell align="right" sx={{ width: '15%' }}>Priority</TableCell>
            <TableCell align="right" sx={{ width: '20%' }}>Due Date</TableCell>
            <TableCell align="right" sx={{ width: '20%' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        {/* Table body - render all task rows */}
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
