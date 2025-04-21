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
  Select,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Stack
} from '@mui/material';
// import Loader from 'ui-component/LoaderCircular';
import BusStop from '../../../../assets/iconsimage/busStop.svg';
import { IconX, IconChevronLeft, IconEye, IconArrowLeft, IconRoute, IconClock, IconReload } from '@tabler/icons-react'; // IconArrowDownSquare
import { getCurrentDate, findDay, addTwoTime } from 'utils/TimeDate';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import Loader from 'ui-component/LoaderCircular';

const columns = [
  { id: 'route no', label: 'Route No.', align: 'center', minWidth: 100 },
  { id: 'route name', label: 'Route Name.', align: 'center', minWidth: 180 },
  {
    id: 'bus_no',
    label: 'Bus No.',
    minWidth: 200,
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
    id: 'trip time',
    label: 'Trip Time',
    minWidth: 180,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 140,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'vendor',
    label: 'Vendor Name',
    minWidth: 120,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'No of pax',
    label: 'No of Booking',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'edit',
    label: 'View Details',
    minWidth: 120,
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
export const PendingTrip = ({ itemsPerPage }) => {
  const [modalopen, setModalOpen] = useState(false);
  // const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState('');
  const [showModal, setShowModal] = useState({
    allDetail: true,
    bdBool: false,
    tsBool: false,
    sdBool: false
  });
  // fetch Data state And filter state
  const [allTrip, setAllTrips] = useState([]);
  // console.log(allTrip);
  let [filterTripData, setFilterTripData] = useState(allTrip);
  const [routeNoF, setRouteNoF] = useState('');
  const [busNoF, setBusNoF] = useState('');
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [updateObj, setUpdateObj] = useState({});
  // Assign ReAssign Case
  const [unAssignedBus, setUnAssignedBus] = useState([]);
  const [UnAssignDriverName, setUnAssignDriverName] = useState('');
  const [newBusId, setNewBusId] = useState('');

  // Api call
  useEffect(() => {
    if (startDate >= getCurrentDate() && endDate >= startDate) {
      // console.log(startDate, endDate);
      setisLoading(true);
      axios
        .get(`${BackendUrl}/app/v1/tripManagement/pending/${startDate}/${endDate}`)
        .then((res) => {
          setAllTrips(res.data.result);
          setisLoading(false);
        })
        .catch((err) => {
          setisLoading(false);

          console.log('Api error : ', err);
        });
    } else {
      console.log('Date', startDate, endDate);
      setStartDate(getCurrentDate());
      setEndDate(getCurrentDate());
      setisLoading(false);
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

  // Assign Reassign Bus On A Particular Trip

  // modal
  const handleOpen = (item) => {
    // console.log(item);
    setUpdateObj(item);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setShowModal({ ...showModal, allDetail: true, tsBool: false });
  };
  // Change The Status Of Particular Trip
  const ChangeTripStatusOnPending = () => {
    if (tripStatus != '' && updateObj.tripMapId != '') {
      // console.log('tripStatus And TripMapId', tripStatus, updateObj.tripMapId);
      let warningBool = window.confirm('Do You want to change the trip Status?');
      if (warningBool) {
        axios
          .post(`${BackendUrl}/app/v1/tripstatus/status${tripStatus}`, { tripMapId: updateObj.tripMapId })
          .then((res) => {
            if (res.data.result.created) {
              window.alert('Trip Status Changed');
            }

            console.log(res.data);
            handleClose();
          })
          .catch((err) => console.log('Api Error', err));
      } else {
        console.log('thanks for Your Confirmation');
      }
    }
  };
  // get All UnAssign Bus And Driver
  const GetAllUnAssignedBus = () => {
    setShowModal({ ...showModal, bdBool: true, tsBool: false, sdBool: false });
    if (updateObj.tripDetails.tripId && updateObj.tripDate) {
      axios
        .post(`${BackendUrl}/app/v1/tripManagement/getAvailableBusesForReassign`, {
          TripId: updateObj.tripDetails.tripId,
          TripDate: updateObj.tripDate
        })
        .then((res) => setUnAssignedBus(res.data.result))
        .catch((err) => console.log('Api Error : ', err));
    }
  };
  // Change Bus Driver On A particular trip Route
  const ChangeBusDriverOnParticularTrip = () => {
    if (newBusId != '' && updateObj.tripDetails.tripId && updateObj.tripDate) {
      axios
        .patch(`${BackendUrl}/app/v1/tripManagement/updateBusInPending`, {
          tripId: updateObj.tripDetails.tripId,
          tripDate: updateObj.tripDate,
          newBus: newBusId
        })
        .then((res) => {
          if (res.data.updated) {
            window.alert('Bus And Driver Changes on Particular Trip Route');
            handleClose();
          }
        })
        .catch((err) => console.log('Api Error : ', err));
    }
  };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPages = itemsPerPage;
  const totalPages = Math.ceil(filterTripData?.length / itemsPerPages) || 0;

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
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
          <div className="flex flex-col border py-2 px-4 rounded-lg w-full">
            <label htmlFor="StartDate" className="text-xs mb-1 font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="StartDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent outline-none font-normal"
              min={getCurrentDate()}
            />
          </div>
          <div className="flex flex-col border py-2 px-4  rounded-lg w-full">
            <label htmlFor="endDate" className="text-xs mb-1 font-medium">
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
              <TextField type="number" label="Route No." value={routeNoF} onChange={(e) => setRouteNoF(e.target.value)} />
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <TextField label="Bus No" value={busNoF} onChange={(e) => setBusNoF(e.target.value)} />
            </FormControl>
          </div>
        </div>

        {/* All trip */}
        <div>
          <div className="-my-4">
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
                        {displayItems().map((item, i) => {
                          return (
                            <TableRow hover key={i}>
                              <TableCell className="font-semibold">{item.basicInfo.routeNumber}</TableCell>
                              <TableCell className="text-xs uppercase font-semibold">{item.basicInfo.routeName}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.busNumber}</TableCell>
                              <TableCell className="uppercase font-semibold">{item.basicInfo.driverName}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.tripTime}</TableCell>
                              <TableCell className="font-semibold">{item.tripDate}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.vendorName}</TableCell>
                              <TableCell className="font-semibold">{item.basicInfo.noOfBookings}</TableCell>
                              <TableCell>
                                <Button className=" group p-2 text-md text-black " onClick={() => handleOpen(item)}>
                                  <IconEye className="h-6 text-blue-600 hover:text-[#49C401] " />
                                  <span className=" group-hover:opacity-100 text-xs opacity-0 text-[#8e8e8e]">View Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                <div className="flex  justify-center">
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
          className={`rounded bg-gray-200 ${showModal.allDetail && 'h-[90%] w-[60%]'} 
           ${showModal.sdBool && 'h-[90%] w-[60%] max-lg:w-[70%] max-md:w-[80%]'}
          } overflow-hidden`}
        >
          <div className="relative w-[100%] h-[100%]">
            {showModal.allDetail && (
              <>
                <div className="p-5 absolute h-[100%] w-[100%]">
                  <div className="flex justify-between text-xl my-2 max-md:my-1 font-bold">
                    <p>Trip Details</p>
                    <button onClick={handleClose} className="hover:bg-gray-400 rounded-full">
                      <IconX />
                    </button>
                  </div>

                  <div className="overflow-y-scroll w-[100%] h-[80%] max-md:h-[600px] px-1">
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4  h-full w-full">
                      {/* bus details */}
                      <div className="bg-white h-72 rounded p-3 flex flex-col gap-4  shadow-xl">
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
                      <div className="bg-white h-72 rounded p-3  flex flex-col gap-4   shadow-xl">
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
                            <span>:</span> <span>view pending</span>
                          </p>

                          <p className="flex gap-6 ">
                            <span className="w-20">Address</span>
                            <span>:</span> <span className="uppercase">{updateObj.driverDetails?.driverAddress}</span>
                          </p>
                        </div>
                      </div>

                      {/* trip details */}
                      <div className="bg-white h-72 rounded p-3  flex flex-col gap-4  shadow-xl ">
                        <div>
                          <h1 className="text-xl">Trip details</h1>
                          <span className="block h-[0.5px] mt-2 w-full bg-gray-300"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 ">
                          <p className="flex gap-6 ">
                            <span className="w-20">Trip Status</span>
                            <span>:</span> <span className="uppercase">Pending</span>
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
                      <div className="bg-white h-72 rounded p-3 flex flex-col gap-4  shadow-xl">
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
                              <span className="w-20">Fixed Price</span>
                              <span>:</span> <span className="uppercase">{updateObj.routeDetails?.routeFixedRatePrice}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-between mt-4">
                    <Button variant="contained" className="bg-blue-500" onClick={GetAllUnAssignedBus}>
                      ReAssign
                    </Button>
                    <Button
                      className="bg-[#49c401] text-sm hover:bg-green-500 text-white"
                      onClick={() => setShowModal({ ...showModal, allDetail: false, bdBool: false, tsBool: false, sdBool: true })}
                    >
                      Stops
                    </Button>
                    <Button
                      className="bg-gray-700 text-sm text-white hover:bg-gray-500"
                      onClick={() => setShowModal({ ...showModal, bdBool: false, tsBool: true, sdBool: false })}
                    >
                      <IconReload /> Trip Status
                    </Button>
                  </div>
                </div>
              </>
            )}
            {showModal.bdBool && (
              <div className=" absolute z-10  w-full h-full bg-black bg-opacity-50 flex justify-center items-center ">
                <div className="bg-white  w-[480px] h-96  p-2 rounded-xl relative">
                  <button
                    onClick={() => setShowModal({ ...showModal, allDetail: true, bdBool: false, tsBool: false, sdBool: false })}
                    className="rounded-full absolute top-9 left-6"
                  >
                    <IconArrowLeft />
                  </button>
                  <div className=" py-6 px-3 h-full">
                    <div>
                      <h1 className="text-xl text-center font-semibold mb-8">Reassign Bus Driver</h1>
                    </div>
                    <div className="flex flex-col  ">
                      <div className="flex flex-col gap-5 justify-center">
                        <div>
                          <div className="flex justify-left gap-1">
                            <p className="text-md text-gray-400 flex">
                              <IconRoute className="rotate-90 h-4 " /> Route Name :{' '}
                            </p>
                            <p className="font-semibold ">{updateObj.basicInfo.routeName}</p>
                          </div>
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
                          <FormControl fullWidth>
                            <InputLabel id="BusNo">Bus No.</InputLabel>
                            <Select labelId="BusNo" label="Bus No." value={newBusId} onChange={(e) => setNewBusId(e.target.value)}>
                              {unAssignedBus?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.bus_id} onClick={() => setUnAssignDriverName(item.driver_name)}>
                                    {item.bus_number}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl fullWidth>
                            <TextField label="Driver Name." disabled={true} value={UnAssignDriverName} />
                          </FormControl>
                        </div>
                        <div>
                          <button className="p-2 rounded-xl bg-[#49C401] w-full text-white" onClick={ChangeBusDriverOnParticularTrip}>
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showModal.tsBool && (
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
                          <p className="text-md text-gray-400 flex">
                            <IconRoute className="rotate-90 h-4 " /> <span>Route Name : </span>
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
                            className="rounded p-3 w-full bg-[#eeeeee]"
                          >
                            <option value={''} selected disabled>
                              Trip Status
                            </option>
                            <option value={''} disabled>
                              Pending
                            </option>
                            <option value={'Ongoing'}>Ongoing</option>
                            <option value={'Completed'}>Completed</option>
                            <option value={''} disabled>
                              BreakDown
                            </option>
                          </select>
                        </div>
                        <div>
                          <button className="p-1 text-lg rounded-xl bg-[#49C401] w-full text-white" onClick={ChangeTripStatusOnPending}>
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showModal.sdBool && (
              <>
                <div className="absolute w-[100%]">
                  <div className="flex text-xl my-2 max-md:my-1 font-bold gap-5  px-10">
                    <button
                      onClick={() => setShowModal({ ...showModal, allDetail: true, bdBool: false, tsBool: false, sdBool: false })}
                      className="hover:text-blue-400 rounded-full"
                    >
                      <IconChevronLeft />
                    </button>
                    <p>All Stop Details</p>
                  </div>
                  <div className="overflow-y-scroll w-[100%] h-[470px] max-md:h-[640px] px-10">
                    <div>
                      <div className="grid grid-cols-1 gap-4 justify-center">
                        {updateObj.basicInfo.noOfBookings == 0 ? (
                          <>
                            <div className="bg-white p-5 flex flex-col gap-6 rounded-lg shadow-lg">
                              <div className="flex gap-5">
                                <p>
                                  <img src={BusStop} alt="kevhb" className="w-[40px] h-[40px]" />
                                </p>
                                <p className="text-2xl font-semibold ">{updateObj.routeDetails?.startingPoint}</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-4">
                                  <p className="text-md bg-[#f0f0f0] px-4 py-2 rounded-xl">
                                    Stop Time :<span className="font-medium">{String(updateObj.tripDetails?.tripStartTime)}</span>
                                  </p>
                                  <p className="text-md bg-[#EAB308] text-white px-4 py-2 rounded-xl">
                                    Booking : <span className="font-medium">0</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            {updateObj.stopsWithoutBooking?.length > 1 && (
                              <>
                                {updateObj.stopsWithoutBooking?.map((item, i) => {
                                  console.log(updateObj.stopsWithoutBooking);
                                  return (
                                    <div key={i} className="bg-white p-5 flex flex-col gap-5 rounded-lg shadow-lg">
                                      <div>
                                        <span>
                                          <img src={BusStop} alt="kevhb" className="w-[40px] h-[40px]" />
                                        </span>
                                        <span className="text-[24px] w-96 leading-7">{item.stopName}</span>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-4">
                                          <p className="text-md bg-[#f0f0f0] px-4 py-2 rounded-xl">
                                            Stop Time :
                                            <span className="font-medium">
                                              {' '}
                                              {addTwoTime(updateObj.tripDetails?.tripStartTime, item.stopEta)}
                                            </span>
                                          </p>
                                          <p className="text-md bg-[#EAB308] text-white px-4 py-2 rounded-xl">Booking : 0</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                            <div className="bg-white p-5 flex flex-col gap-6 rounded-xl shadow-lg">
                              <div>
                                <p className="text-2xl font-semibold ">{updateObj.routeDetails?.endPoint}</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-4">
                                  <p className="text-md  bg-[#f0f0f0] px-4 py-2 rounded-xl">
                                    Stop Time : <span className="font-medium">{updateObj.tripDetails?.tripEndTime}</span>
                                  </p>
                                  <p className="text-md bg-[#EAB308] text-white px-4 py-2 rounded-xl">Booking : 0</p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {updateObj.stopsWithBooking?.map((item, i) => {
                              return (
                                <div key={i} className="bg-white p-5 flex flex-col gap-6 shadow-lg rounded-xl">
                                  <div className="flex gap-5">
                                    <p>
                                      <img src={BusStop} alt="kevhb" className="w-[40px] h-[40px]" />
                                    </p>

                                    <p className="text-2xl font-semibold ">{item.stopName}</p>
                                  </div>
                                  <div className="flex flex-col gap-7">
                                    <div className="flex gap-5 items-center">
                                      <p className="text-md  bg-[#f0f0f0] px-4 py-2 rounded-xl">
                                        Reach Time : <span className="font-medium">{item.eta}</span>
                                      </p>
                                      <p className="text-md  bg-[#f0f0f0] px-4 py-2 rounded-xl">
                                        OnBoarding : <span className="font-medium">{item.onBoardingNumber} </span>
                                      </p>
                                      <p className="text-md  bg-[#f0f0f0] px-4 py-2 rounded-xl">
                                        OffBoarding : <span className="font-medium">{item.offBoardingNumber}</span>
                                      </p>
                                    </div>

                                    {(item.onBoardingArr?.length > 0 || item.offBoardingArr?.length > 0) && (
                                      <div className="grid grid-cols-2 bg-[#eeeeee] rounded-xl ">
                                        <div className="p-7 border border-gray-400 rounded-l-xl ">
                                          <p className="font-bold mb-2 text-center">On Boarded</p>
                                          <div className="text-[#222222]">
                                            <p className="grid grid-cols-2">
                                              <span className="text-left font-semibold">Name</span>
                                              <span className="text-righ font-semibold">Seats</span>
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
                                        <div className="p-7 border border-gray-400 rounded-r-xl">
                                          <p className="font-bold mb-2 text-center">Off Boarded</p>
                                          <div className="text-[#222222]">
                                            <p className="grid grid-cols-2">
                                              <span className="text-left">Name</span>
                                              <span className="text-right">Seats</span>
                                            </p>
                                            {item.offBoardingArr?.map((ele, x) => {
                                              return (
                                                <p key={x} className="grid grid-cols-2">
                                                  <span className="text-left">{ele.userName}</span>
                                                  <span className="text-right">{ele.totalSeats}</span>
                                                </p>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
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
