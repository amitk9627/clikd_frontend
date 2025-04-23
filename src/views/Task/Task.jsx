import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BackendUrl } from 'utils/config';
import axios from 'axios';
import AddTask from './AddTask';
import toast, { Toaster } from 'react-hot-toast';
import { Modal, Box, TextField, Button, Typography, Stack, Pagination } from '@mui/material';
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
import { IconX, IconPencil, IconUpload, IconTrashX, IconPlus } from '@tabler/icons-react';
const columns = [
  { id: 'title', label: 'Title', minWidth: 140 },
  { id: 'description', label: 'Description', minWidth: 170 },
  {
    id: 'date',
    label: 'Date',
    minWidth: 150,
    align: 'left',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 50,
    align: 'left',
    format: (value) => value.toFixed(2)
  }
];

const Task = () => {
  const [allTask, setAllTask] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [search, setSearch] = useState('');

  // API calling
  useEffect(() => {
    setRefreshPage(false);
    const debounce = setTimeout(() => {
      axios
        .get(`${BackendUrl}/tasks?page=${page}&title=${search}`)
        .then((res) => {
          setTotalPage(res.data.totalPages);
          setAllTask(res.data.result);
        })
        .catch((err) => console.log(err));
    }, 1000);
    return () => clearTimeout(debounce);
  }, [refreshPage, page, search]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const [sheetURL, setSheetURL] = useState('');
  const [updateObj, setUpdateObj] = useState({});
  const [uploadModal, setUploadModal] = useState(false);

  //   const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [formType, setFormType] = useState({
    new: true,
    update: false
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setFormType({ new: true, update: false });
  };

  const handleClose = () => setOpen(false);

  const handleUpload = async () => {
    if (!sheetURL) {
      console.log('url is not correct');
    }
    try {
      const { data } = await axios.post(`${BackendUrl}/import`, { sheetURL: sheetURL.trim() });
      if (data.status) {
        setRefreshPage(true);
        setSheetURL('');
        setUploadModal(false);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response);
    }
  };

  const handleUpdateModalOpen = (obj) => {
    setUpdateObj(obj);
    setOpen(true);
    setFormType({ new: false, update: true });
  };

  // task delete
  const handleDelete = (id) => {
    axios
      .delete(`${BackendUrl}/tasks/${id}`)
      .then((res) => {
        setRefreshPage(true);
        toast.success(res.data.message);
        console.log(res.data);
      })
      .catch((err) => {
        console.log();
        toast.error(err.response.data.message);
      });
  };

  // task update
  const handleUpdate = () => {
    if (!updateObj.title) {
      alert('title is missing');
      return;
    }
    if (!updateObj.dueDate) {
      alert('date is missing');
      return;
    }
    if (!updateObj.description) {
      alert('desciption is missing');
      return;
    }

    axios
      .put(`${BackendUrl}/tasks/${updateObj._id}`, {
        title: updateObj.title,
        description: updateObj.description,
        dueDate: String(updateObj.dueDate),
        isActive: true
      })
      .then((res) => {
        setRefreshPage(true);
        console.log(res.data);
        toast.success('Task Updated');
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="p-3 flex flex-col gap-5 bg-white">
        <div className="relative border-b border-gray-400 pb-2">
          <h1 className="text-2xl text-center">Task</h1>
          <button onClick={handleOpen} className="absolute top-3 left-3 flex items-center gap-2 text-blue-500 max-md:text-[14px]">
            <IconPlus stroke={2} />
            Add Task
          </button>
          <button
            onClick={() => setUploadModal(true)}
            className="absolute top-3 right-3 flex items-center gap-2  text-blue-500 max-md:text-[14px]"
          >
            <IconUpload stroke={2} /> Upload Sheet
          </button>
        </div>
        <div>
          <TextField
            label="Title"
            variant="outlined"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>

        <div>
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
                        <TableCell className="flex items-center gap-3">
                          <button className="text-blue-500" onClick={() => handleUpdateModalOpen(item)}>
                            <IconPencil stroke={2} />
                          </button>
                          <button className="text-red-500" onClick={() => handleDelete(item._id)}>
                            <IconTrashX stroke={2} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="flex items-center justify-center">
                <Stack>
                  <Pagination count={totalPage} page={page} onChange={handleChange} />
                </Stack>
              </div>
            </Paper>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            {formType.new && !formType.update ? 'Fill' : 'Update'} the Details
          </Typography>
          {formType.new && !formType.update && <AddTask onClose={handleClose} setRefreshPage={setRefreshPage} toast={toast} />}
          {!formType.new && formType.update && (
            <>
              <Box>
                <Box
                  component="form"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: 400,
                    margin: '0 auto'
                  }}
                >
                  <TextField
                    label="Title"
                    variant="outlined"
                    name="title"
                    value={updateObj.title}
                    onChange={(e) => setUpdateObj({ ...updateObj, title: e.target.value })}
                    fullWidth
                  />

                  <TextField
                    label="Date"
                    variant="outlined"
                    type="date"
                    name="date"
                    value={updateObj.dueDate}
                    onChange={(e) => setUpdateObj({ ...updateObj, dueDate: e.target.value })}
                    fullWidth
                    inputProps={{
                      pattern: '\\d{4}-\\d{2}-\\d{2}'
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />

                  <TextField
                    label="Description"
                    variant="outlined"
                    name="description"
                    multiline
                    rows={4}
                    value={updateObj.description}
                    onChange={(e) => setUpdateObj({ ...updateObj, description: e.target.value })}
                    fullWidth
                  />
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                  <Button onClick={() => handleClose()}>Cancel</Button>
                  <Button variant="contained" onClick={handleUpdate} className="bg-blue-500 text-white px-3 rounded-xl">
                    Update Task
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal open={uploadModal} onClose={() => setUploadModal(false)}>
        <Box sx={style}>
          <div className="py-5 px-3 flex flex-col gap-5">
            <button onClick={() => setUploadModal(false)} className="absolute top-3 right-3">
              <IconX stroke={2} />
            </button>{' '}
            <h2 className="text-xl font-semibold">Upload Google Sheets</h2>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Enter something"
                variant="outlined"
                className="w-full"
                value={sheetURL}
                onChange={(e) => setSheetURL(e.target.value)}
              />
              <button onClick={() => handleUpload()} className="bg-blue-500 text-white px-3 rounded-xl">
                Import
              </button>
            </Stack>
            <p>
              Please ensure your Google Sheet has the following fields: <strong>title</strong>, <strong>description</strong>, and{' '}
              <strong>dueDate</strong> in <strong>yyyy-mm-dd</strong> format.
            </p>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Task;
