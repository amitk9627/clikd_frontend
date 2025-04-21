import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Box,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TextField
} from '@mui/material';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import toast, { Toaster } from 'react-hot-toast';
import { getCurrentDate } from 'utils/TimeDate';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4
};
const columns = [
  { id: 'reservation_id', label: 'res. Id', align: 'center', minWidth: 150 },
  { id: 'booking_status', label: 'Booking Status', align: 'center', minWidth: 130 },
  { id: 'booking_date', label: 'Date', align: 'center', minWidth: 150 },
  { id: 'pickuptime', label: 'Pickup time', align: 'center', minWidth: 150 },
  { id: 'droptime', label: 'Drop time', align: 'center', minWidth: 150 },
  { id: 'bus_picklocation', label: 'Bus Picklocation', align: 'center', minWidth: 150 },
  { id: 'bus_droplocation', label: 'Bus Droplocation', align: 'center', minWidth: 150 },
  { id: 'total_seats', label: 'total_seats', align: 'center', minWidth: 50 },
  { id: 'view', label: 'View', align: 'center', minWidth: 150 }
];
export const AllBooking = () => {
  const [allBooking, setAllBooking] = useState([]);
  const [tripDate, setTripDate] = useState(getCurrentDate());
  const [pageNo, setPageNo] = useState(1);
  const [totalBooking, setTotalBooking] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalPages, setTotalPage] = useState(0);
  useEffect(() => {
    axios
      .post(`${BackendUrl}/app/v1/booking/getBookingListByDate`, {
        pageNo: pageNo,
        limitPerPage: limitPerPage,
        bookingDate: tripDate
      })
      .then((res) => {
        // console.log(res.data);
        if (!res.data.bookingExists) {
          setAllBooking([]);
          toast.error(res.data.result);
        } else {
          // console.log(res.data)
          setAllBooking(res.data.result);
          setTotalBooking(res.data.totalbooking);
          setTotalPage(res.data.totalPage);
        }
      })
      .catch((err) => {
        toast.error(res.data.result);
        console.log(err);
      });
  }, [tripDate, limitPerPage, pageNo]);

  // console.log(totalPages);
  const [modalOpen, setModalOpen] = useState(false);
  const handlePrev = () => {
    if (pageNo <= 1) {
      setPageNo(totalPages);
    } else {
      setPageNo((page) => page - 1);
    }
  };
  const handleNext = () => {
    if (pageNo >= totalPages) {
      setPageNo(1);
    } else {
      setPageNo((page) => page + 1);
    }
  };
  return (
    <>
      <div>
        <div>
          <Toaster />
        </div>
        <div className=" flex flex-col gap-5 bg-white p-2 rounded-xl">
          {/* heading */}
          <div>
            <div>
              <p className="text-3xl text-gray-600 text-center">Booking Details</p>
              <p className=" border border-gray-300 mt-2"></p>
            </div>

            <div className="flex max-md:flex-col  items-center gap-4 mt-4">
              <FormControl fullWidth>
                <TextField
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  className="border border-gray-300 rounded "
                />
              </FormControl>
              <div className="flex gap-4 w-full items-center ">
                <FormControl fullWidth>
                  <InputLabel id="limit">Page Limit</InputLabel>
                  <Select
                    labelId="limit"
                    id="demo-simple-select"
                    label="Page Limit"
                    value={limitPerPage}
                    onChange={(e) => setLimitPerPage(e.target.value)}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                  </Select>
                </FormControl>
                <p className=" text-lg">Total:{totalBooking || 'not yet'} </p>
              </div>
            </div>
          </div>

          <div>
            <div>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 500 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column.id} style={{ minWidth: column.minWidth }} className="bg-gray-300 ">
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allBooking?.map((item, i) => {
                        return (
                          <TableRow
                            key={i}
                            className={`${item.booking_status == 2 && 'bg-green-400 '} ${
                              item.booking_status == 1 && 'bg-yellow-200 text-white'
                            } ${item.booking_status == 3 && 'bg-red-400 text-white'}`}
                          >
                            <TableCell>{item.reservation_id}</TableCell>
                            <TableCell>
                              {item.booking_status == 2 ? 'Completed' : item.booking_status == 3 ? 'Cancelled' : 'Pending'}
                            </TableCell>
                            <TableCell>{item.booking_date}</TableCell>
                            <TableCell>{item.pickuptime}</TableCell>
                            <TableCell>{item.droptime}</TableCell>
                            <TableCell>{item.bus_picklocation}</TableCell>
                            <TableCell>{item.bus_droplocation}</TableCell>
                            <TableCell>{item.total_seats}</TableCell>
                            <TableCell>
                              <button className="p-2 text-lg text-blue-600" onClick={() => setModalOpen(true)}>
                                View
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              {totalPages > 1 && (
                <div className="mt-2">
                  <div className="flex justify-center gap-4">
                    {pageNo != 1 && (
                      <button className="font-bold bg-blue-600 px-3 text-white rounded" onClick={() => handlePrev()}>
                        {'<<'}
                      </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPageNo(pageNumber)}
                        className={`flex justify-center items-center bg-blue-500 px-2 py-1 rounded-full ${
                          pageNo == pageNumber ? 'text-white bg-red-500' : 'text-black'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    {pageNo != totalPages && (
                      <button className="font-bold bg-blue-600 px-3 text-white rounded" onClick={() => handleNext()}>
                        {'>>'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-white">
          modal
        </Box>
      </Modal>
    </>
  );
};
