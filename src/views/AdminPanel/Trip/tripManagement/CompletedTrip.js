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
  TextField,
  FormControl,
  Pagination,
  Stack,
  Button
} from '@mui/material';
import BusStop from '../../../../assets/iconsimage/busStop.svg';
import { IconX, IconEye, IconRouteAltLeft, IconArrowLeft } from '@tabler/icons-react';
import axios from 'axios';
import { findDay } from 'utils/TimeDate';
import { BackendUrl } from 'utils/config';
import { CompletedMapTrack } from './CompletedMapTrack';
import Loader from 'ui-component/LoaderCircular';
// get current Date
function getCurrentDate() {
  let today = new Date();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();
  let currDate = `${year}-${month}-${day}`;
  return currDate;
}

const columns = [
  { id: 'route no', label: 'Route No.', align: 'center', minWidth: 120 },
  { id: 'route name', label: 'Route Name.', align: 'center', minWidth: 300 },
  {
    id: 'bus',
    label: 'Bus',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'typetime',
    label: 'Trip Time',
    minWidth: 250,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'driver',
    label: 'Driver',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'noofbooking',
    label: 'No of Booking',
    minWidth: 140,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'totalboarded',
    label: 'Total Boarded',
    minWidth: 140,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'total no of not boarded',
    label: 'Total Not Boarded',
    minWidth: 180,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'totalnonpassRevenue',
    label: 'Total Non pass Revenue (Rs)',
    minWidth: 240,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'totalPassRevenue',
    label: 'Total Pass Revenue (Rs)',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'totalRevenue',
    label: 'Total Revenue (Rs)',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'routehistory',
    label: 'Trip History',
    minWidth: 125,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  }
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2
};
export const CompletedTrip = ({ itemsPerPage }) => {
  // fetch Data state And filter state
  const [allTrip, setAllTrips] = useState([]);
  // console.log(allTrip)
  let [filterTripData, setFilterTripData] = useState([]);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [routeNoF, setRouteNoF] = useState('');
  const [busNoF, setBusNoF] = useState('');
  const [updateObj, setUpdateObj] = useState({});
  const [modalopen, setModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [showModal, setShowModal] = useState({
    allDetail: true,
    viewMaps: false,
    viewStop: false
  });
  const handleOpen = (item) => {
    // console.log(item);
    setUpdateObj(item);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setShowModal({
      allDetail: true,
      viewMaps: false,
      viewStop: false
    });
  };

  // Api call
  useEffect(() => {
    setisLoading(true);
    if (endDate <= getCurrentDate() && startDate <= endDate) {
      axios
        .get(`${BackendUrl}/app/v1/tripManagement/completed/${startDate}/${endDate}`)
        .then((res) => {
          setAllTrips(res.data.result);
          // console.log(res.data.result)
          setisLoading(false);
        })
        .catch((err) => {
          setAllTrips([]);
          console.log('Api error : ', err);
          setisLoading(false);
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
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPages = itemsPerPage;
  const totalPages = Math.ceil(filterTripData?.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    filterTripData = filterTripData.sort((a, b) => {
      const dateA = new Date(a.tripDate);
      const dateB = new Date(b.tripDate);
      if (dateA - dateB !== 0) {
        return dateA - dateB;
      } else {
        const timeA = a.basicInfo.tripTime.split(' - ')[0];
        const timeB = b.basicInfo.tripTime.split(' - ')[0];
        return timeA.localeCompare(timeB);
      }
    });
    return filterTripData.slice(startIndex, endIndex);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <div className="flex flex-col gap-10 max-md:gap-5">
        {/* filter */}
        <div className="grid grid-cols-4 max-md:grid-cols-2  gap-2">
          <div className="flex flex-col border  py-2 px-4 rounded-lg w-full">
            <label htmlFor="StartDate" className="mb-1 font-medium text-xs">
              Start Date
            </label>
            <input
              type="date"
              id="StartDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent outline-none font-normal"
              max={getCurrentDate()}
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
              max={getCurrentDate()}
            />
          </div>
          <div>
            <FormControl fullWidth>
              <TextField
                type="number"
                label="Route No."
                inputProps={{
                  min: 0
                }}
                value={routeNoF}
                onChange={(e) => setRouteNoF(e.target.value)}
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
                        {displayItems()?.map((item, i) => {
                          return (
                            <TableRow hover key={i}>
                              <TableCell className="font-semibold">{item.basicInfo.routeNumber}</TableCell>
                              <TableCell className="text-xs uppercase font-semibold">{item.basicInfo.routeName}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.busNumber}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.tripTime}</TableCell>
                              <TableCell className="font-semibold">{item.tripDate}</TableCell>
                              <TableCell className="uppercase font-semibold">{item.basicInfo.driverName}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.noOfBookings}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.totalBoarded}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.totalNotBoarded}</TableCell>
                              <TableCell className="font-semibold">{Number(item.totalNonPassRevenue) / 100}</TableCell>
                              <TableCell className="font-semibold">{Number(item.totalPassRevenue) / 100}</TableCell>
                              <TableCell className="font-semibold">{Number(item.totalRevenue) / 100}</TableCell>
                              <TableCell>
                                <button className="p-2 text-md text-blue-600" onClick={() => handleOpen(item)}>
                                  <IconEye className="h-6 " />
                                </button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                <div className="flex justify-center">
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
          className={`rounded { bg-gray-200 w-[60%] max-lg:w-[70%] max-md:w-[80%] h-[90%] overflow-hidden} ${
            showModal.allDetail && '  max-md:w-[90%] max-md:h-[90%]'
          } ${showModal.viewStop && 'max-md:w-[90%] h-[90%]'} ${showModal.viewMaps && 'h-[95%] w-[80%]'}`}
        >
          <div className="h-[100%] w-[100%]">
            {showModal.allDetail && (
              <>
                <div className="flex justify-between text-xl my-4 max-md:my-1 font-bold">
                  <p>Trip Details</p>
                  <button onClick={handleClose} className="hover:bg-gray-400 rounded-full">
                    <IconX />
                  </button>
                </div>
                <div className="overflow-y-scroll w-[100%] h-[80%]">
                  <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 h-full w-full">
                    {/* bus details */}
                    <div className="bg-white h-72 rounded p-3 flex flex-col gap-4 shadow-2xl">
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
                    <div className="bg-white h-72 rounded p-3  flex flex-col gap-4 shadow-xl">
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
                          <span className="w-20">License Image</span>
                          <span>:</span>{' '}
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
                    <div className="bg-white h-72 rounded p-3  flex flex-col gap-4 shadow-xl">
                      <div>
                        <h1 className="text-xl">Trip details</h1>
                        <span className="block h-[0.5px] mt-2 w-full bg-gray-300"></span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <p className="flex gap-6 ">
                          <span className="w-20">Trip Status</span>
                          <span>:</span> <span className="uppercase">Completed</span>
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
                        <p></p>
                        <p></p>
                        <p></p>
                      </div>
                    </div>

                    {/* Route details */}
                    <div className="bg-white h-72 rounded p-3 flex flex-col gap-4 shadow-xl">
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
                    className="bg-[#49C402] text-sm"
                    onClick={() => setShowModal({ ...showModal, allDetail: false, viewMaps: false, viewStop: true })}
                  >
                    Stops
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-blue-700 text-sm flex gap-1 "
                    onClick={() => setShowModal({ ...showModal, allDetail: false, viewMaps: true, viewStop: false })}
                  >
                   
                    <IconRouteAltLeft className='h-4' />  <span>Route Maps</span>
                  </Button>{' '}
                </div>
              </>
            )}
            {showModal.viewMaps && (
              <CompletedMapTrack
                busInfo={updateObj.actualBusPath}
                StopInfo={updateObj.stopsWithBooking?.stops}
                driverDetails={updateObj.driverDetails}
                busDetails={updateObj.busDetails}
                tripDetails={updateObj.tripDetails}
                routeDetails={updateObj.routeDetails}
                handleClose={() => setShowModal({ ...showModal, allDetail: true, viewMaps: false, viewStop: false })}
              />
            )}

            {showModal.viewStop && (
              <div className="h-[100%]">
                <div className="flex gap-5 text-xl my-2 max-md:my-1 font-bold px-8">
                  <button
                    onClick={() => setShowModal({ ...showModal, allDetail: true, viewMaps: false, viewStop: false })}
                    className="hover:bg-gray-400 rounded-full"
                  >
                    <IconArrowLeft />
                  </button>{' '}
                  <p className="">Stops Details</p>
                </div>
                <div className="h-[470px] max-md:h-[95%]  overflow-y-scroll p-5">
                  <div className="flex flex-col gap-8 ">
                    {updateObj.stopsWithBooking.stops.map((item, i, stopsDetails) => {
                      if (i == 0) {
                        return (
                          <div key={i} className={`rounded-lg bg-white p-[28px] shadow-lg `}>
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
                              <div className="flex justify-between">
                                <div>
                                  <div className=" flex items-center gap-2">
                                    <p className="text-md font-semibold">ETA :- </p>
                                    <p className="bg-[#f2f2f2] py-1 px-2 w-40">
                                      <span className="text-lg  text-[#828282]">{item.eta}</span>
                                    </p>{' '}
                                  </div>
                                </div>
                                <div>
                                  <div className=" flex items-center gap-2">
                                    <p className="text-md font-semibold ">Actual Reach time :- </p>
                                    <p className="bg-[#f2f2f2] py-1 px-2 w-40">
                                      <span className="text-lg  text-[#828282]"> {item.stopReachTime || 'Unknown'} </span>
                                    </p>{' '}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-10">
                                <div className="flex items-center gap-1">
                                  <p className="text-md text-[#222]">Revenue from pass </p>
                                  <span className="text-lg font-semibold">:- </span>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-24">
                                    <span className="text-xl  text-[#828282]">
                                      {' ₹ '}
                                      {Number(updateObj.routeDetails?.routeStartPassRevenue) / 100}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <p className="text-md text-[#222]">Revenue from Non-pass </p>
                                  <span className="text-lg font-semibold">:- </span>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-24">
                                    <span className="text-xl  text-[#828282]">
                                      {' ₹ '}
                                      {Number(updateObj.routeDetails?.routeStartNonPassRevenue) / 100}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <p className="text-md font-semibold text-[#49C401]">Total Revenue </p>
                                  <span className="text-lg font-semibold">:-</span>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-24">
                                    <span className="text-xl  text-[#828282]">
                                      {'₹ '}
                                      {Number(updateObj.routeDetails?.routeStartTotalRevenue) / 100}
                                    </span>
                                  </p>
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
                      } else if (stopsDetails?.length - 1 == i) {
                        return (
                          <div key={i} className={`rounded-lg bg-white p-[28px] shadow-lg `}>
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
                              <div className="flex justify-between">
                                <div>
                                  <div className=" flex items-center gap-2">
                                    <p className="text-md font-semibold">ETA :- </p>
                                    <p className="bg-[#f2f2f2] py-1 px-2 w-40">
                                      <span className="text-lg  text-[#828282]">{item.eta}</span>
                                    </p>{' '}
                                  </div>
                                </div>
                                <div>
                                  <div className=" flex items-center gap-2">
                                    <p className="text-md font-semibold ">Actual Reach time :- </p>
                                    <p className="bg-[#f2f2f2] py-1 px-2 w-40">
                                      <span className="text-lg  text-[#828282]"> {item.stopReachTime || 'Unknown'} </span>
                                    </p>{' '}
                                  </div>
                                </div>
                              </div>
                              {/* <div className="grid grid-cols-3 gap-10">
                                <div className="flex items-center gap-1">
                                  <p className="text-md text-[#222]">Revenue from pass </p>
                                  <span className="text-lg font-semibold">:- </span>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-24">
                                    <span className="text-xl  text-[#828282]">
                                      {' ₹ '}
                                      {updateObj.routeDetails?.routeStartTotalRevenue}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <p className="text-md text-[#222]">Revenue from Non-pass </p>
                                  <span className="text-lg font-semibold">:- </span>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-24">
                                    <span className="text-xl  text-[#828282]">
                                      {' ₹ '}
                                      {updateObj.routeDetails?.routeStartPassRevenue}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <p className="text-md font-semibold text-[#49C401]">Total Revenue </p>
                                  <span className="text-lg font-semibold">:-</span>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-24">
                                    <span className="text-xl  text-[#828282]">
                                      {'₹ '}
                                      {updateObj.routeDetails?.routeStartNonPassRevenue}
                                    </span>
                                  </p>
                                </div>
                              </div> */}

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
                      return (
                        <div key={i} className={`rounded-lg bg-white p-[28px] shadow-lg `}>
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
                            <div className="flex justify-between">
                              <div>
                                <div className=" flex items-center gap-2">
                                  <p className="text-md font-semibold">ETA :- </p>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-40">
                                    <span className="text-lg  text-[#828282]">{item.eta}</span>
                                  </p>{' '}
                                </div>
                              </div>
                              <div>
                                <div className=" flex items-center gap-2">
                                  <p className="text-md font-semibold ">Actual Reach time :- </p>
                                  <p className="bg-[#f2f2f2] py-1 px-2 w-40">
                                    <span className="text-lg  text-[#828282]"> {item.stopReachTime || 'Unknown'} </span>
                                  </p>{' '}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-10">
                              <div className="flex items-center gap-1">
                                <p className="text-md text-[#222]">Revenue from pass </p>
                                <span className="text-lg font-semibold">:- </span>
                                <p className="bg-[#f2f2f2] py-1 px-2 w-28">
                                  <span className="text-xl  text-[#828282]">
                                    {' ₹ '}
                                    {Number(updateObj.stopsWithoutBooking[i - 1]?.stopPassRevenue) / 100}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <p className="text-md text-[#222]">Revenue from Non-pass </p>
                                <span className="text-lg font-semibold">:- </span>
                                <p className="bg-[#f2f2f2] py-1 px-2 w-28">
                                  <span className="text-xl  text-[#828282]">
                                    {' ₹ '}
                                    {Number(updateObj.stopsWithoutBooking[i - 1]?.stopNonPassRevenue) / 100}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <p className="text-md font-semibold text-[#49C401]">Total Revenue </p>
                                <span className="text-lg font-semibold">:-</span>
                                <p className="bg-[#f2f2f2] py-1 px-2 w-28">
                                  <span className="text-xl  text-[#828282]">
                                    {'₹ '}
                                    {Number(updateObj.stopsWithoutBooking[i - 1]?.stopTotalRevenue) / 100}
                                  </span>
                                </p>
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
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};
