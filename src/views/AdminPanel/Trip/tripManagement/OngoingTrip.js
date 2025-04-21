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
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Pagination,
  Stack
} from '@mui/material';
import { IconX, IconChevronLeft, IconEye, IconRouteAltLeft, IconArrowLeft, IconRoute, IconClock, IconReload } from '@tabler/icons-react'; // IconArrowDownSquare
import { getCurrentDate, findDay, addTwoTime, diffTwoTime, compareTwoTime } from 'utils/TimeDate';
import axios from 'axios';
import { MapTracking } from './MapTracking';
import { BackendUrl } from 'utils/config';
import Loader from 'ui-component/LoaderCircular';
import BusStop from '../../../../assets/iconsimage/busStop.svg';

const columns = [
  { id: 'route no', label: 'Route No.', align: 'center', minWidth: 100 },
  { id: 'route name', label: 'Route Name.', align: 'center', minWidth: 250 },
  {
    id: 'bus_no',
    label: 'Bus No.',
    minWidth: 100,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'driver',
    label: 'Driver',
    minWidth: 80,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'trip time',
    label: 'Trip Time',
    minWidth: 250,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'vendor',
    label: 'Vendor',
    minWidth: 100,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'No of pax',
    label: 'No of booking',
    minWidth: 140,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'boarded',
    label: 'Boarded',
    minWidth: 75,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'unboarded',
    label: 'Unboarded',
    minWidth: 75,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'edit',
    label: 'View',
    minWidth: 25,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  }
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // bgcolor: 'background.paper',
  boxShadow: 24
};
export const OngoingTrip = ({ itemsPerPage }) => {
  const [allTrip, setAllTrips] = useState([]);
  const [filterTripData, setFilterTripData] = useState([]);
  const [modalopen, setModalOpen] = useState(false);
  const [tripStatus, setTripStatus] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [userOTP, setUserOTP] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [showModal, setShowModal] = useState({
    allDetail: true,
    tsBool: false,
    sdBool: false,
    mapTracking: false,
    verifyOtp: false
  });
  const [routeNoF, setRouteNoF] = useState('');
  const [busNoF, setBusNoF] = useState('');
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [updateObj, setUpdateObj] = useState({});
  // console.log(allTrip) 2024-03-13
  // Api call
  useEffect(() => {
    if (startDate >= getCurrentDate() && endDate >= startDate) {
      setisLoading(true);

      axios
        .get(`${BackendUrl}/app/v1/tripManagement/ongoing/${startDate}/${endDate}`)
        .then((res) => {
          setisLoading(false);
          setAllTrips(res.data.result);
          // console.log(res.data.result)
        })
        .catch((err) => {
          setisLoading(false);
          console.log('Api error : ', err);
        });
    } else {
      window.alert('Please Select the correct Date,\n End Date >= Start Date');
    }
  }, [startDate, endDate]);
  // filter
  useEffect(() => {
    let res = '';
    if (routeNoF != '' && busNoF != '') {
      res = allTrip.filter((item) => {
        // Check if all fields match the criteria
        return String(item.basicInfo?.routeNumber).includes(String(routeNoF)) && String(item.basicInfo?.busNumber).includes(busNoF);
      });
      // console.log('routeno, busno and trip : ', res);
      setFilterTripData(res);
      return;
    } else if (routeNoF != '') {
      res = allTrip.filter((item) => {
        // Check if all fields match the criteria
        return String(item.basicInfo?.routeNumber).includes(String(routeNoF));
      });
      // console.log('routeno, busno and trip : ', res);
      setFilterTripData(res);
      return;
    } else if (busNoF != '') {
      res = allTrip.filter((item) => {
        // Check if all fields match the criteria
        return String(item.basicInfo?.busNumber).includes(busNoF);
      });
      // console.log('busno : ', res);
      setFilterTripData(res);
      return;
    } else {
      setFilterTripData(allTrip);
    }
  }, [allTrip, routeNoF, busNoF]);

  // modal
  const handleOpen = (item) => {
    // console.log(item);
    setUpdateObj(item);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setShowModal({ ...showModal, allDetail: true, tsBool: false, sdBool: false, mapTracking: false, verifyOtp: false });
  };
  const handleLiveTracking = () => {
    setShowModal({ ...showModal, allDetail: false, tsBool: false, sdBool: false, mapTracking: true, verifyOtp: false });
  };
  // Change The Status Of Particular Trip
  const ChangeTripStatusonOngoing = () => {
    if (tripStatus != '' && updateObj.tripMapId != '') {
      // console.log('182 tripStatus And TripMapId', tripStatus, updateObj.tripMapId);
      let warningBool = window.confirm('Do You want to change the trip Status?');
      if (warningBool) {
        axios
          .post(`${BackendUrl}/app/v1/tripstatus/status${tripStatus}`, { tripMapId: updateObj.tripMapId })
          .then((res) => {
            if (res.data.tripstatus) {
              window.alert('Trip Status Changed');
            }
            // console.log('inside axios Api', res.data);
            handleClose();
          })
          .catch((err) => console.log('Api Error', err));
      }
    }
  };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPages = itemsPerPage;
  const totalPages = Math.ceil(filterTripData?.length / itemsPerPages) || 0;

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterTripData.slice(startIndex, endIndex);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  // User Otp verify
  const handleUserOtpVerify = () => {
    if (userOTP != '' && phoneNo != '') {
      axios
        .post(`${BackendUrl}/app/v1/tripManagement/checkUserOtp`, {
          userTripId: updateObj.tripDetails.tripId,
          userOtp: userOTP,
          mobileNumber: phoneNo,
          userTripDate: updateObj.tripDate
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.onBoarded && res.data.alreadyOnBoard) {
            window.alert('Already boarded');
          } else if (res.data.onBoarded && !res.data.alreadyOnBoard) {
            window.alert('onBoarded');
          }
          if (res.data.incorrectOtp) {
            window.alert('Incorrect OTP');
          }
        })
        .catch((err) => console.log('Api error', err));
    }
  };
  const handleCloseMapTracking = () => {
    setShowModal({ ...showModal, allDetail: true, tsBool: false, sdBool: false, mapTracking: false, verifyOtp: false });
  };
  return (
    <>
      <div className="flex flex-col gap-10 max-md:gap-5 ">
        {/* filter */}
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-2">
          <div className="flex flex-col border  py-2 px-4 rounded-lg w-full">
            <label htmlFor="StartDate" className="font-medium mb-1 text-xs">
              Start Date
            </label>
            <input
              type="date"
              id="StartDate"
              className="bg-transparent outline-none font-normal"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={getCurrentDate()}
            />
          </div>
          <div className="flex flex-col border  py-2 px-4 rounded-lg w-full">
            <label htmlFor="endDate" className="mb-1 font-medium text-xs">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent outline-none font-normal"
              min={getCurrentDate()}
            />
          </div>
          <div>
            <FormControl fullWidth>
              <TextField
                label="Route No."
                type="number"
                value={routeNoF}
                onChange={(e) => setRouteNoF(e.target.value)}
                inputProps={{
                  min: 0
                }}
              />
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <TextField label="Bus No" type="text" value={busNoF} onChange={(e) => setBusNoF(e.target.value)} />
            </FormControl>
          </div>
        </div>
        {/* All trip */}
        <div>
          <div className="my-1">
            {totalPages > 0 ? (
              <>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell key={column.id} style={{ minWidth: column.minWidth }} className="bg-gray-200 text-gray-600">
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <>
                          {displayItems()?.map((item, i) => {
                            return (
                              <TableRow hover key={i}>
                                <TableCell className="font-semibold">{item.basicInfo.routeNumber}</TableCell>
                                <TableCell className="text-xs uppercase font-semibold">{item.basicInfo.routeName}</TableCell>
                                <TableCell className="font-semibold">{item.basicInfo.busNumber}</TableCell>
                                <TableCell className="uppercase font-semibold">{item.basicInfo.driverName}</TableCell>
                                <TableCell className="font-semibold">{item.basicInfo.tripTime}</TableCell>
                                <TableCell className="font-semibold">{item.basicInfo.vendorName}</TableCell>
                                <TableCell className="font-semibold">{item.basicInfo.noOfBookings}</TableCell>
                                <TableCell className="font-semibold">{item.basicInfo.totalBoarded}</TableCell>
                                <TableCell className="font-semibold">{item.basicInfo.totalNotBoarded}</TableCell>
                                <TableCell>
                                  <Button className=" group p-2 text-md text-black " onClick={() => handleOpen(item)}>
                                    <IconEye className="h-6 text-blue-600 hover:text-[#49C401] " />
                                    <span className=" group-hover:opacity-100 text-xs opacity-0 text-[#8e8e8e]">View Details</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                <div className="flex justify-center mt-2">
                  <Stack spacing={2}>
                    <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
                  </Stack>
                </div>
              </>
            ) : (
              <>
                {isLoading ? (
                  <div>
                    <Loader />
                  </div>
                ) : (
                  <p className="text-[#828282] text-xl text-center">No data Found</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={modalopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className=""
      >
        <Box
          sx={style}
          className={`rounded bg-gray-200  h-[90%] w-[60%] max-md:h-[94%] max-md:w-[90%] 
          ${showModal.mapTracking && ' h-[95%] w-[90%] '} overflow-hidden`}
        >
          <div className="relative h-[100%] w-[100%]">
            {showModal.allDetail && (
              <>
                <div className="p-5 absolute z-0 h-[100%] w-[100%]">
                  <div className="flex justify-between text-xl my-2 max-md:my-1 font-bold ">
                    <p>Trip Details </p>
                    <button onClick={handleClose} className="hover:bg-gray-400 rounded-full">
                      <IconX />
                    </button>
                  </div>

                  <div className="overflow-y-scroll w-[100%] h-[80%] px-1">
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4  h-full w-full">
                      {/* bus details */}
                      <div className="bg-white h-72 rounded p-3 flex flex-col gap-4  ">
                        <div>
                          <h1 className="text-xl">Bus details</h1>
                          <span className="block h-[0.5px] w-full mt-2 bg-gray-300"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <p className="flex gap-6 ">
                            <span className="w-20">Bus No.</span>
                            <span>:</span>
                            <span className="">{updateObj.busDetails?.busNumber}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Reg No.</span>
                            <span>:</span> <span>{updateObj.busDetails?.busRegistrationDate}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">AC</span>
                            <span>:</span>{' '}
                            <span>{updateObj.busDetails?.busIsAc ? `${updateObj.busDetails?.busIsAc ? 'Yes' : 'No'}` : 'not yet'}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Fuel Type</span>
                            <span>:</span> <span>{updateObj.busDetails?.fuelType}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Capacity</span>
                            <span>:</span> <span>{updateObj.busDetails?.busCapacity}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Female Bus </span>
                            <span>:</span> <span>{updateObj.busDetails?.femalBus || 'Not Yet'}</span>
                          </p>
                        </div>
                      </div>
                      {/* Driver details */}
                      <div className="bg-white h-72 rounded p-3  flex flex-col gap-4  ">
                        <div>
                          <h1 className="text-xl">Driver details</h1>
                          <span className="block h-[0.5px] mt-2 w-full bg-gray-300"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <p className="flex gap-6 ">
                            <span className="w-20">Driver Name</span>
                            <span>:</span>
                            <span className="">{updateObj.driverDetails?.driverName}</span>
                          </p>

                          <p className="flex gap-6 ">
                            <span className="w-20">Contact No.</span>
                            <span>:</span> <span>{updateObj.driverDetails?.driverContact}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Emergency No.</span>
                            <span>:</span> <span>{updateObj.driverDetails?.driverEmergencyContact || 'Not Yet'}</span>
                          </p>

                          <p className="flex gap-6 ">
                            <span className="w-20">License Img</span>
                            <span>:</span>
                            <span>
                              {updateObj.driverDetails?.driverDocument?.dl ? (
                                <a
                                  target="_blank"
                                  href={updateObj.driverDetails?.driverDocument?.dl}
                                  rel="noreferrer"
                                  className="text-blue-500 border px-1 border-blue-500 rounded flex gap-1 items-center"
                                >
                                  <IconEye /> View
                                </a>
                              ) : (
                                'Not Yet'
                              )}
                            </span>
                          </p>

                          <p className="flex gap-6 ">
                            <span className="w-20">Address</span>
                            <span>:</span> <span className="uppercase">{updateObj.driverDetails?.driverAddress}</span>
                          </p>
                        </div>
                      </div>
                      {/* trip details */}
                      <div className="bg-white h-72 rounded p-3  flex flex-col gap-4  ">
                        <div>
                          <h1 className="text-xl">Trip details</h1>
                          <span className="block h-[0.5px] mt-2 w-full bg-gray-300"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 ">
                          <p className="flex gap-6 ">
                            <span className="w-20">Trip Status</span>
                            <span>:</span> <span className="uppercase">Ongoing</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Start Time</span>
                            <span>:</span> <span className="uppercase">{String(updateObj.tripDetails?.tripStartTime)}</span>
                          </p>{' '}
                          <p className="flex gap-6 ">
                            <span className="w-20">End Time</span>
                            <span>:</span> <span className="uppercase">{updateObj.tripDetails?.tripEndTime}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Trip Day</span>
                            <span>:</span>{' '}
                            <span className="uppercase">{updateObj.tripDetails?.tripRunningDays.map((item) => findDay(item))}</span>
                          </p>
                        </div>
                      </div>
                      {/* Route details */}
                      <div className="bg-white h-72 rounded p-3 flex flex-col gap-4 ">
                        <div>
                          <h1 className="text-xl">Route details</h1>
                          <span className="block h-[0.5px] mt-2 w-full bg-gray-300"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <p className="flex gap-6 ">
                            <span className="w-20">Route No. </span>
                            <span>:</span> <span className="uppercase">{updateObj.routeDetails?.routeNumber}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Start point </span>
                            <span>:</span> <span className="uppercase">{updateObj.routeDetails?.startingPoint}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">End point </span>
                            <span>:</span> <span className="uppercase w-40">{updateObj.routeDetails?.endPoint}</span>
                          </p>
                          <p className="flex gap-6 ">
                            <span className="w-20">Distance</span>
                            <span>:</span> <span className="uppercase">{updateObj.routeDetails?.totalDistance}</span>
                          </p>
                          {Boolean(updateObj.routeDetails?.routeFixedRate) == false ? (
                            <>
                              <p className="flex gap-6 ">
                                <span className="w-20">Base Rate</span>
                                <span>:</span> <span className="uppercase">{updateObj.routeDetails?.routeBasePrice}</span>
                              </p>
                              <p className="flex gap-6 ">
                                <span className="w-20">Adhoc Price</span>
                                <span>:</span> <span className="uppercase">{updateObj.routeDetails?.routeBasePriceAdhoc}</span>
                              </p>

                              <p className="flex gap-6 ">
                                <span className="w-20">Rate/km</span>
                                <span>:</span> <span className="uppercase">{updateObj.routeDetails?.perKmRoutePrice}</span>
                              </p>

                              <p className="flex gap-6 ">
                                <span className="w-20">Max fare</span>
                                <span>:</span> <span className="uppercase"> {updateObj.routeDetails?.maxRouteFare}</span>
                              </p>
                            </>
                          ) : (
                            <p className="flex gap-6 ">
                              <span className="w-20">fixed price</span>
                              <span>:</span> <span className="uppercase">{updateObj.routeDetails?.routeFixedRatePrice}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-between mt-2">
                    <Button
                      variant="contained"
                      className="bg-yellow-700 text-sm "
                      onClick={() => setShowModal({ ...showModal, tsBool: true, sdBool: false, mapTracking: false, verifyOtp: false })}
                    >
                      <IconReload /> Trip Status
                    </Button>
                    <Button
                      variant="contained"
                      className="bg-blue-700 text-sm "
                      onClick={() =>
                        setShowModal({ ...showModal, allDetail: false, tsBool: false, sdBool: true, mapTracking: false, verifyOtp: false })
                      }
                    >
                      Stops
                    </Button>
                    <Button
                      variant="contained"
                      className="bg-blue-700 text-sm "
                      onClick={() => setShowModal({ ...showModal, tsBool: false, sdBool: false, mapTracking: false, verifyOtp: true })}
                    >
                      Verify Otp
                    </Button>
                    <Button variant="contained" className="bg-blue-700 text-sm flex gap-1" onClick={() => handleLiveTracking()}>
                      <IconRouteAltLeft className="h-4" /> <span>Route Maps</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
            {showModal.tsBool && (
              <>
                <div className=" absolute z-10 w-full h-full bg-black bg-opacity-50  flex justify-center items-center">
                  <div className="bg-white w-[480px] h-80  p-2 rounded-xl relative">
                    <button
                      onClick={() => setShowModal({ ...showModal, allDetail: true, bdBool: false, tsBool: false, sdBool: false })}
                      className="rounded-full absolute top-9 left-6"
                    >
                      <IconArrowLeft />
                    </button>
                    <div className=" py-6 px-3 h-full">
                      <div>
                        <h1 className="text-xl text-center font-semibold mb-8">Change Trip Status</h1>
                      </div>
                      <div className="flex flex-col  ">
                        <div className="flex flex-col gap-5 justify-center">
                          <div className="flex justify-left gap-1">
                            <p className="text-md text-gray-400">
                              {' '}
                              <span className="flex w-28">
                                {' '}
                                <IconRoute className="rotate-90 h-4 " />
                                Route Name :
                              </span>
                            </p>
                            <p className="font-semibold ">{updateObj.basicInfo.routeName}</p>
                          </div>

                          <div className="">
                            <div className="flex justify-left gap-1">
                              <p className="text-md text-gray-400 flex">
                                <IconClock className="rotate-90 h-4" />
                                Trip Time :
                              </p>
                              <p className="font-semibold">{updateObj.basicInfo.tripTime}</p>
                            </div>
                          </div>

                          <div>
                            <select
                              value={tripStatus}
                              onChange={(e) => setTripStatus(e.target.value)}
                              className="rounded p-2 w-full bg-[#eeeeee]"
                            >
                              <option value={''} selected disabled>
                                Trip Status
                              </option>
                              <option value={'Ongoing'} disabled>
                                Ongoing
                              </option>
                              <option value={'Completed'}>Completed</option>
                              <option value={''} disabled>
                                BreakDown
                              </option>
                            </select>
                          </div>
                          <div>
                            <button className="text-lg p-1 rounded-xl bg-[#49C401] w-full text-white" onClick={ChangeTripStatusonOngoing}>
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {showModal.sdBool && (
              <>
                <div className="absolute w-[100%] h-[100%]">
                  <div className="flex text-xl my-2 max-md:my-1 font-bold gap-2">
                    <button
                      onClick={() =>
                        setShowModal({ ...showModal, allDetail: true, tsBool: false, sdBool: false, mapTracking: false, verifyOtp: false })
                      }
                      className="hover:text-blue-400 rounded-full"
                    >
                      <IconChevronLeft />
                    </button>
                    <p>All Stop Detail</p>
                  </div>
                  {updateObj.stopsWithBooking?.length > 0 ? (
                    <div className="overflow-y-scroll w-[100%] h-[470px] max-md:h-[640px] px-10 ">
                      <div>
                        <div className="grid grid-cols-1 gap-4 justify-center">
                          <>
                            {updateObj.stopsWithBooking?.map((item, i, arr) => {
                              if (i == 0) {
                                let stopreachtime = item.stopStatus == 0 ? item.eta : item.stopReachTime;
                                let desiredTime = updateObj.tripDetails.tripStartTime;
                                let timeDiff = diffTwoTime(desiredTime, stopreachtime);
                                let isGreater = compareTwoTime(desiredTime, stopreachtime);
                                return (
                                  <div key={i} className={`rounded shadow-xl bg-white p-4`}>
                                    <div className="p-2 flex flex-col gap-7">
                                      <div className="flex justify-between items-center">
                                        <p className="flex gap-3 items-center font-bold ">
                                          <span>
                                            <img src={BusStop} alt="kevhb" className="w-[40px] h-[40px]" />
                                          </span>
                                          <span className="text-[24px] w-96 leading-7">{item.stopName}</span>
                                        </p>
                                        <p>
                                          <span className="text-[#828282]">Bus Status :- </span>
                                          <span
                                            className={`${
                                              Boolean(item.stopStatus) == false ? 'bg-yellow-500 text-white' : 'bg-[#01C489] text-white'
                                            } py-2 px-4 rounded-lg text-md`}
                                          >
                                            {`${Boolean(item.stopStatus) == false ? 'On The Way' : 'Reached'}`}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <div>
                                          <div className=" flex items-center gap-2">
                                            <p className="text-md font-semibold">Desired Reach time :- </p>
                                            <p className="bg-[#f2f2f2] py-1 px-2 w-32">
                                              <span className="text-lg  text-[#828282]">{desiredTime}</span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                        <div>
                                          <div className=" flex items-center gap-2">
                                            <p className="text-md font-semibold ">Actual Reach time :- </p>
                                            <p className="bg-[#f2f2f2] py-1 px-2 w-32">
                                              <span className="text-lg  text-[#828282]">
                                                {' '}
                                                {Boolean(item.stopStatus) == false ? item.eta : item.stopReachTime}{' '}
                                              </span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                        <div>
                                          <div className=" flex items-center gap-5">
                                            <p className="text-md font-semibold w-24">Time Diff :- </p>
                                            <p className={`bg-[#f2f2f2] py-1 px-2 w-32 text-lg`}>
                                              <span className={isGreater ? 'text-green-500' : 'text-red-400'}>
                                                {isGreater ? '+' : '-'} {timeDiff}
                                              </span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-2">
                                          <div className="border border-gray-300 p-2">
                                            <p className="font-bold text-center pt-2 underline">OnBoarded Details</p>
                                            <div className="grid justify-center grid-cols-1 p-4">
                                              <p className="grid grid-cols-2">
                                                <span className="text-left">Name</span>
                                                <span className="text-right">Seats</span>
                                              </p>
                                              {item.onBoardingArr?.map((ele, x) => {
                                                return (
                                                  <p key={x} className="grid grid-cols-2">
                                                    <span className="text-left">{ele.userName}</span>
                                                    <span className="text-right">{ele.totalSeats}</span>
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          <div className="border border-gray-300 p-2">
                                            <p className="font-bold text-center pt-2 underline">OffBoarded Details</p>
                                            <div>
                                              <p className="grid grid-cols-2 px-4 py-2">
                                                <span className="text-left">Name</span>
                                                <span className="text-right">Seats</span>
                                              </p>

                                              {item.offBoardingArr?.map((ele, x) => {
                                                return (
                                                  <p key={x} className="grid grid-cols-2 px-4 text-xs text-[#616161]">
                                                    <span className="text-left">{ele.userName}</span>
                                                    <span className="text-right">{ele.totalSeats}</span>
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (i == arr.length - 1) {
                                let stopreachtime = item.stopStatus == 0 ? item.eta : item.stopReachTime;
                                let desiredTime = updateObj.tripDetails.tripEndTime;
                                let timeDiff = diffTwoTime(desiredTime, stopreachtime);
                                let isGreater = compareTwoTime(desiredTime, stopreachtime);
                                // console.log(timeDiff);

                                return (
                                  <div key={i} className={`rounded shadow-xl bg-white p-4`}>
                                    <div className="p-2 flex flex-col gap-7">
                                      <div className="flex justify-between items-center">
                                        <p className="flex gap-3 items-center font-bold ">
                                          <span>
                                            <img src={BusStop} alt="kevhb" className="w-[40px] h-[40px]" />
                                          </span>
                                          <span className="text-[24px] w-96 leading-7">{item.stopName}</span>
                                        </p>
                                        <p>
                                          <span className="text-[#828282]">Bus Status :- </span>
                                          <span
                                            className={`${
                                              Boolean(item.stopStatus) == false ? 'bg-yellow-500 text-white' : 'bg-[#01C489] text-white'
                                            } py-2 px-4 rounded-lg text-md`}
                                          >
                                            {' '}
                                            {`${Boolean(item.stopStatus) == false ? 'On The Way' : 'Reached'}`}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <div>
                                          <div className=" flex items-center gap-2">
                                            <p className="text-md font-semibold">Desired Reach time :- </p>
                                            <p className="bg-[#f2f2f2] py-1 px-2 w-32">
                                              <span className="text-lg  text-[#828282]">{desiredTime}</span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                        <div>
                                          <div className=" flex items-center gap-2">
                                            <p className="text-md font-semibold ">Actual Reach time :- </p>
                                            <p className="bg-[#f2f2f2] py-1 px-2 w-32">
                                              <span className="text-lg  text-[#828282]">
                                                {' '}
                                                {Boolean(item.stopStatus) == false ? item.eta : item.stopReachTime}{' '}
                                              </span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                        <div>
                                          <div className=" flex items-center gap-5">
                                            <p className="text-md font-semibold w-24">Time Diff :- </p>
                                            <p className={`bg-[#f2f2f2] py-1 px-2 w-32 text-lg`}>
                                              <span className={isGreater ? 'text-green-500' : 'text-red-400'}>
                                                {isGreater ? '+' : '-'} {timeDiff}
                                              </span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-2">
                                          <div className="border border-gray-300 p-2">
                                            <p className="font-bold text-center pt-2 underline">OnBoarded Details</p>
                                            <div className="grid justify-center grid-cols-1 p-4">
                                              <p className="grid grid-cols-2">
                                                <span className="text-left">Name</span>
                                                <span className="text-right">Seats</span>
                                              </p>
                                              {item.onBoardingArr?.map((ele, x) => {
                                                return (
                                                  <p key={x} className="grid grid-cols-2">
                                                    <span className="text-left">{ele.userName}</span>
                                                    <span className="text-right">{ele.totalSeats}</span>
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          <div className="border border-gray-300 p-2">
                                            <p className="font-bold text-center pt-2 underline">OffBoarded Details</p>
                                            <div>
                                              <p className="grid grid-cols-2 px-4 py-2">
                                                <span className="text-left">Name</span>
                                                <span className="text-right">Seats</span>
                                              </p>

                                              {item.offBoardingArr?.map((ele, x) => {
                                                return (
                                                  <p key={x} className="grid grid-cols-2 px-4 text-xs text-[#616161]">
                                                    <span className="text-left">{ele.userName}</span>
                                                    <span className="text-right">{ele.totalSeats}</span>
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                let stopreachtime = item.stopStatus == 0 ? item.eta : item.stopReachTime;
                                let desiredTime = addTwoTime(
                                  updateObj.tripDetails.tripStartTime,
                                  updateObj.stopsWithoutBooking[i - 1].stopEta
                                );
                                // console.log(desiredTime);
                                let timeDiff = diffTwoTime(desiredTime, stopreachtime);
                                let isGreater = compareTwoTime(desiredTime, stopreachtime);
                                // console.log("ongoing",timeDiff);
                                return (
                                  <div key={i} className={`rounded shadow-xl bg-white p-4`}>
                                    <div className="p-2 flex flex-col gap-7">
                                      <div className="flex justify-between items-center">
                                        <p className="flex gap-3 items-center font-bold ">
                                          <span>
                                            <img src={BusStop} alt="kevhb" className="w-[40px] h-[40px]" />
                                          </span>
                                          <span className="text-[24px] w-96 leading-7">{item.stopName}</span>
                                        </p>
                                        <p>
                                          <span className="text-[#828282]">Bus Status :- </span>
                                          <span
                                            className={`${
                                              Boolean(item.stopStatus) == false ? 'bg-yellow-500 text-white' : 'bg-[#01C489] text-white'
                                            } py-2 px-4 rounded-lg text-md`}
                                          >
                                            {' '}
                                            {`${Boolean(item.stopStatus) == false ? 'On The Way' : 'Reached'}`}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <div>
                                          <div className=" flex items-center gap-2">
                                            <p className="text-md font-semibold">Desired Reach time :- </p>
                                            <p className="bg-[#f2f2f2] py-1 px-2 w-32">
                                              <span className="text-lg  text-[#828282]">{desiredTime}</span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                        <div>
                                          <div className=" flex items-center gap-2">
                                            <p className="text-md font-semibold ">Actual Reach time :- </p>
                                            <p className="bg-[#f2f2f2] py-1 px-2 w-32">
                                              <span className="text-lg  text-[#828282]">
                                                {' '}
                                                {Boolean(item.stopStatus) == false ? item.eta : item.stopReachTime}{' '}
                                              </span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                        <div>
                                          <div className=" flex items-center gap-5">
                                            <p className="text-md font-semibold w-24">Time Diff :- </p>
                                            <p className={`bg-[#f2f2f2] py-1 px-2 w-32 text-lg`}>
                                              <span className={isGreater ? 'text-green-500' : 'text-red-400'}>
                                                {isGreater ? '+' : '-'} {timeDiff}
                                              </span>
                                            </p>{' '}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-2">
                                          <div className="border border-gray-300 p-2">
                                            <p className="font-bold text-center pt-2 underline">OnBoarded Details</p>
                                            <div className="grid justify-center grid-cols-1 p-4">
                                              <p className="grid grid-cols-2">
                                                <span className="text-left">Name</span>
                                                <span className="text-right">Seats</span>
                                              </p>
                                              {item.onBoardingArr?.map((ele, x) => {
                                                return (
                                                  <p key={x} className="grid grid-cols-2">
                                                    <span className="text-left">{ele.userName}</span>
                                                    <span className="text-right">{ele.totalSeats}</span>
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          <div className="border border-gray-300 p-2">
                                            <p className="font-bold text-center pt-2 underline">OffBoarded Details</p>
                                            <div>
                                              <p className="grid grid-cols-2 px-4 py-2">
                                                <span className="text-left">Name</span>
                                                <span className="text-right">Seats</span>
                                              </p>

                                              {item.offBoardingArr?.map((ele, x) => {
                                                return (
                                                  <p key={x} className="grid grid-cols-2 px-4 text-xs text-[#616161]">
                                                    <span className="text-left">{ele.userName}</span>
                                                    <span className="text-right">{ele.totalSeats}</span>
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {' '}
                      <h1 className="text-center text-xl">No Data Found</h1>
                    </div>
                  )}
                </div>
              </>
            )}
            {showModal.mapTracking && (
              <MapTracking
                busId={updateObj.busDetails.busId}
                tripId={updateObj.tripDetails.tripId}
                tripDate={updateObj.tripDate}
                routeId={updateObj.routeDetails.routeId}
                showModal={showModal}
                closeMapTracking={() => handleCloseMapTracking()}
              />
            )}
            {showModal.verifyOtp && (
              <>
                <div className="absolute z-10  w-full h-full bg-black bg-opacity-50 flex items-center justify-center ">
                  <div className="w-[480px] h-96 rounded-xl p-2 bg-white relative">
                    <button
                      onClick={() =>
                        setShowModal({ ...showModal, allDetail: true, bdBool: false, tsBool: false, sdBool: false, verifyOtp: false })
                      }
                      className=" rounded-full absolute top-9 left-6"
                    >
                      <IconArrowLeft />
                    </button>
                    <div className=" py-6 px-3 h-full">
                      <div>
                        <h1 className="text-xl text-center font-semibold mb-8">Verify OTP</h1>
                      </div>
                      <div className="flex flex-col  ">
                        <div className="flex flex-col gap-5 justify-center">
                          <div className="flex justify-left gap-2">
                            <p className="text-md text-gray-400">
                              <span className="flex w-28">
                                {' '}
                                <IconRoute className="rotate-90 h-4 " />
                                Route Name :
                              </span>
                            </p>
                            <p className="font-semibold ">{updateObj.basicInfo.routeName}</p>
                          </div>

                          <div className="">
                            <div className="flex justify-left gap-2">
                              <p className="text-md text-gray-400 flex">
                                <IconClock className="rotate-90 h-4" />
                                Trip Time :
                              </p>
                              <p className="font-semibold">{updateObj.basicInfo.tripTime}</p>
                            </div>
                          </div>
                          <div>
                            <input
                              placeholder="Phone Number"
                              type="tel"
                              minLength={10}
                              maxLength={10}
                              min={0}
                              value={phoneNo}
                              onChange={(e) => setPhoneNo(e.target.value)}
                              className="rounded p-2 w-full bg-[#eeeeee]"
                            />
                          </div>
                          <div>
                            <input
                              placeholder="OTP"
                              type="number"
                              value={userOTP}
                              onChange={(e) => setUserOTP(e.target.value)}
                              className="rounded p-2 w-full bg-[#eeeeee]"
                            />
                          </div>
                          <div>
                            <button className="p-2 rounded-xl bg-[#49C401] w-full text-white" onClick={handleUserOtpVerify}>
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};
