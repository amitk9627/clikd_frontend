import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { BackendUrl } from 'utils/config';
import axios from 'axios';
import AddTask from './AddTask';
import { Modal, Box, TextField, Button, Typography, Stack } from '@mui/material';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};
const columns = [
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'description', label: 'Description', minWidth: 100 },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2)
  }
];

const Task = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [allTask, setAllTask] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  // API calling
  useEffect(() => {
    setRefreshPage(false);
    axios
      .get(`${BackendUrl}/tasks`)
      .then((res) => setAllTask(res.data.result))
      .catch((err) => console.log(err));
  }, [refreshPage]);
  const [sheetURL, setSheetURL] = useState('');
  //   const [page, setPage] = React.useState(0);
  //   const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleUpload = async () => {
    if (!sheetURL) {
      console.log('url is not correct');
    }
    const { data } = await axios.post(`${BackendUrl}/import`, { sheetURL: sheetURL.trim() });
    if (data.tasks.length > 0) {
      setRefreshPage(true);
      setSheetURL('');
    }
  };

  return (
    <>
      <div className="p-3 flex flex-col gap-5 bg-white">
        <div>
          <h1>Task</h1>
          <button onClick={handleOpen}>Open</button>
        </div>
        <div>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Enter something"
              variant="outlined"
              className="w-[50%]"
              value={sheetURL}
              onChange={(e) => setSheetURL(e.target.value)}
            />
            <button onClick={() => handleUpload()}>import</button>
          </Stack>
        </div>
        <div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allTask.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      {/* <TableCell>{item.title}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          </Paper>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Fill the Details
          </Typography>
          <AddTask onClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default Task;
