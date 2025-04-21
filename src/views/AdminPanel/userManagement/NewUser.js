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

import { IconEdit, IconX, IconAdjustmentsHorizontal } from '@tabler/icons-react';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4
};
const columns = [
  { id: 'userId', label: 'User ID', minWidth: 80 },
  { id: 'creationdate', label: 'Creation Date', minWidth: 150 },
  { id: 'username', label: 'Name', minWidth: 150 },
  { id: 'gender', label: 'Gender', minWidth: 120 },
  { id: 'phno', label: 'Phone No.', minWidth: 160 },
  { id: 'email', label: 'Email', minWidth: 120 },
  { id: 'Address', label: 'Address', minWidth: 200 },
  { id: 'remarks', label: 'Remarks', minWidth: 200 },
  { id: 'edit', label: 'Update', minWidth: 80 }
];
const obj = [
  {
    username: 'alice_smith',
    phno: '555-1234',
    gender: 'Female',
    email: 'alice.smith@example.com',
    address: '123 Maple St, Springfield, IL, 62704',
    time: '10:30 AM',
    date: '2024-06-04',
    remarks: 'Activewcjvub y3u guyg uy3gfuy3hgefujhw  uyb wufuwfuy uy',
    edit: 'Update'
  },
  {
    username: 'bob_johnson',
    phno: '555-5678',
    gender: 'Male',
    email: 'bob.johnson@example.com',
    address: '456 Oak St, Springfield, IL, 62705',
    time: '11:00 AM',
    date: '2024-06-04',

    edit: 'Update'
  },
  {
    username: 'carol_williams',
    phno: '555-9101',
    gender: 'Female',
    email: 'carol.williams@example.com',
    address: '789 Pine St, Springfield, IL, 62706',
    time: '09:15 AM',
    date: '2024-06-04',
    remarks: 'Active',
    edit: 'Update'
  }
];
export const NewUser = () => {
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
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        className="bg-gray-200 font-semibold"
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {obj.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell className="font-medium">{'2024-06-04'}</TableCell>
                        <TableCell className="font-medium uppercase">{item.username}</TableCell>
                        <TableCell className="font-medium">{item.gender}</TableCell>
                        <TableCell className="font-medium">{item.phno}</TableCell>
                        <TableCell className="font-medium">{item.email}</TableCell>
                        <TableCell className="font-medium">{item.address}</TableCell>
                        <TableCell className="font-medium">
                          <textarea className="bg-gray-200 rounded-sm p-1 text-center w-full" defaultValue={item.remarks ? item.remarks : '-------'}>
                            
                          </textarea>
                        </TableCell>
                        <TableCell>
                          <button onClick={() => handleOpen()}>
                            <IconEdit className=" text-blue-500" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
            <div>
              <button onClick={handleClose} className="text-lg text-white bg-[#49c401]">
                Save Message
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};
