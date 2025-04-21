import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  Button,
  Modal,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Pagination,
  TextareaAutosize
} from '@mui/material';

import { IconPencil, IconX, IconAdjustmentsHorizontal } from '@tabler/icons-react';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4
};
const columns = [
  { id: 'username', label: 'User Name', minWidth: 150 },
  { id: 'phno', label: 'Phone No.', minWidth: 160 },
  { id: 'gender', label: 'Gender', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 120 },
  { id: 'Address', label: 'Address', minWidth: 160 },
  { id: 'time', label: 'Time', minWidth: 100 },
  { id: 'date', label: 'Date', minWidth: 100 },

  { id: 'gender', label: 'Gender', minWidth: 120 },
  { id: 'status', label: 'Status', minWidth: 160 },
  { id: 'edit', label: 'Update', minWidth: 160 }
];
export const AlreadyContactedUser = () => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const handleOpen = () => {
    // setUpdateObj(item);
    setUpdateOpen(true);
  };
  const handleClose = () => {
    // setUpdateObj(item);
    setUpdateOpen(false);
  };

  return (
    <>
      <div>
        <div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead className="bg-gray-300">
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }} className="bg-gray-200">
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">jhvhbwc</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">wvcwe</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell className="font-medium">jbkhvfe</TableCell>
                    <TableCell className="font-medium">dfs</TableCell>
                    <TableCell>
                      <button onClick={() => handleOpen()}>edit</button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <div className="flex  justify-center">
            {/* <Stack spacing={2}>
              <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
            </Stack> */}
          </div>
        </div>
      </div>
      <Modal
        open={updateOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className=""
      >
        <Box sx={style} className=" flex justify-center items-center ">
          <div className="bg-white p-4 flex flex-col gap-6 rounded-xl w-96">
            <div className="flex justify-between ">
              <p className="text-xl font-semibold">User Message</p>
              <button onClick={() => handleClose()}>
                <IconX />
              </button>
            </div>
            <div>
              <p>Name : Neel Sir (update)</p>
            </div>
            <div>
              <p>Phone : 7860519627 (update)</p>
            </div>
            <div>
              <FormControl fullWidth>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={10}
                  className="border-gray-500 bg-gray-300 outline-none p-2 rounded"
                />
              </FormControl>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};
