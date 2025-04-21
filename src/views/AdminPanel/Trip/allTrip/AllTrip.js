import React, { useState, useEffect } from 'react';
// import FilterListIcon from '@mui/icons-material/FilterList';
import { IconX, IconPencil, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Select,
  MenuItem,
  Modal,
  Box
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { BackendUrl } from 'utils/config';
import axios from 'axios';
import { addTwoTime, compareTwoTime, getCurrentDate, findDay } from 'utils/TimeDate';
const columns = [
  { id: 'trip_id', label: 'Tip Id', align: 'center', minWidth: 100 },
  { id: 'route', label: 'Route', align: 'center', minWidth: 250 },
  { id: 'bus_number', label: 'Bus Number', align: 'center', minWidth: 150 },

  {
    id: 'driver_name',
    label: 'Driver Name',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'startendTime',
    label: 'Start-End Time',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'vendor_name',
    label: 'Vendor Name',
    minWidth: 140,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'running_days',
    label: 'Running Days',
    minWidth: 140,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },

  {
    id: 'edit',
    label: 'UPDATE',
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
  p: 4
};
export const AllTrip = () => {
  const [allTrip, setAllTrip] = useState([]);
  //  console.log(allTrip[0])
  const [updateObj, setUpdateObj] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  let [filterData, setFilterData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [IsActive, setIsActive] = useState(true);
  // Assign ReAssign Case
  const [unAssignedBus, setUnAssignedBus] = useState([]);
  const [UnAssignDriverName, setUnAssignDriverName] = useState('');
  const [minEndTime, setMinEndTime] = useState('');
  const [refreshPage, setRefreshPage] = useState(false);
  // filter state
  const [sBusNo, setSbusNo] = useState('');
  const [sDriverName, setSdriverName] = useState('');
  const [sRouteNo, setSrouteNo] = useState('');

  const handleOpen = (item) => {
    // console.log(item);
    setUpdateObj(item);
    setModalOpen(true);
    setUnAssignDriverName(item.driver_name);
  };

  const handleClose = () => {
    setModalOpen(false);
    setRefreshPage(true);
  };

  useEffect(() => {
    setRefreshPage(false);
    fetch(`${BackendUrl}/app/v1/trip/getAllMstTrip`)
      .then((res) => res.json())
      .then((data) => {
        setAllTrip(data.result);
      })
      .catch((e) => console.log('Api fail ', e));
  }, [refreshPage]);
  // filter

  useEffect(() => {
    let res = allTrip.filter((item) => item.isActive == IsActive);
    if (sBusNo != '') {
      res = res?.filter((item) => item['bus_number']?.toLocaleLowerCase().includes(String(sBusNo).toLocaleLowerCase()));
    }
    if (sDriverName != '') {
      res = res?.filter((item) => item['driver_name']?.toLocaleLowerCase().includes(String(sDriverName).toLocaleLowerCase()));
    }
    if (sRouteNo != '') {
      res = res?.filter((item) => item['routname'].toLowerCase()?.includes(String(sRouteNo).toLowerCase()));
    }
    setFilterData(res);
  }, [allTrip, sBusNo, sRouteNo, sDriverName, IsActive]);

  // handle time
  const handleTimeInput = (e) => {
    const inputValue = e.target.value;
    const field = e.target.name;
    // Use a regular expression to validate the input
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (regex.test(inputValue) || inputValue === '') {
      setUpdateObj({ ...updateObj, [field]: inputValue });
    }
  };

  const [dayDis, setDayDis] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    fullweek: false,
    weekday: false,
    selectDay: false,
    buttonDisable: true
  });

  // const [runningErr, setRunningErr] = useState(false);
  const handleFullWeek = () => {
    setUpdateObj({ ...updateObj, runningDays: ['0', '1', '2', '3', '4', '5', '6'] });
    setDayDis({ ...dayDis, fullweek: true, weekday: false });
  };
  // console.log(updateObj);
  const handleWeekDay = () => {
    setUpdateObj({ ...updateObj, runningDays: ['1', '2', '3', '4', '5'] });
    setDayDis({ ...dayDis, weekday: true, fullweek: false });
  };
  const handleSelectButton = () => {
    setDayDis({ ...dayDis, buttonDisable: false });
    setUpdateObj({ ...updateObj, runningDays: [] });
  };
  // select day and disable button using object state
  const handleSelectedDays = (day, value) => {
    setUpdateObj({ ...updateObj, runningDays: [...updateObj.runningDays, value] });
    setDayDis({ ...dayDis, [day]: true });
  };
  function deleteSelectedDays(day, val) {
    let idx = updateObj.runningDays?.indexOf(val);
    updateObj.runningDays?.splice(idx, 1);
    setDayDis({ ...dayDis, [day]: false });
  }
  const clearField = () => {
    setDayDis({
      ...dayDis,
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      fullweek: false,
      weekday: false,
      selectDay: false,
      buttonDisable: true
    });
    setUpdateObj({ ...updateObj, runningDays: [] });
  };

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filterData?.length / itemsPerPage) || 0;

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    filterData = filterData.sort((a, b) => b.isActive - a.isActive);
    return filterData.slice(startIndex, endIndex);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  // calculate end time with respect to route id
  useEffect(() => {
    if (updateObj.route_id) {
      // console.log(updateObj.route_id);
      axios
        .get(`${BackendUrl}/app/v1/trip/getTripMinCompletionTime/${updateObj.route_id}`)
        .then((res) => {
          console.log(res.data);
          setMinEndTime(res.data.minCompletionTime);
        })
        .catch((err) => console.log('Api error ', err));
    }
  }, [modalOpen]);
  // get All unassign and assign buses
  useEffect(() => {
    if (updateObj.trip_id) {
      axios
        .post(`${BackendUrl}/app/v1/tripManagement/getAvailableBusesForReassign`, {
          TripId: updateObj.trip_id,
          TripDate: getCurrentDate()
        })
        .then((res) => setUnAssignedBus(res.data.result))
        .catch((err) => console.log('Api Error : ', err));
    }
  }, [modalOpen]);

  // UpdateObj Trip
  const updateTrip = () => {
    let expectedEndTime = addTwoTime(minEndTime, updateObj.startTime);
    const endTimeBool = compareTwoTime(updateObj.endTime, expectedEndTime);
    // console.log(expectedEndTime, endTimeBool);
    if (!endTimeBool) {
      window.alert(`Minimun End Time must greater than ${expectedEndTime}`);
      return;
    }
    if (updateObj.trip_id != '' && updateObj.route_id != '' && updateObj.bus_id != '' && endTimeBool && updateObj.runningDays.length > 0) {
      const body = {
        tripId: updateObj.trip_id,
        routeId: updateObj.route_id,
        busId: updateObj.bus_id,
        startTime: updateObj.startTime,
        endTime: updateObj.endTime,
        runningDays: updateObj.runningDays,
        activeStatus: Boolean(updateObj.isActive)
      };
      // console.log(body);
      axios
        .patch(`${BackendUrl}/app/v1/trip/updateTrip`, body)
        .then((res) => {
          console.log(res.data);
          window.alert('Trip Updated Successfully');
          handleClose();
        })
        .catch((err) => {
          console.log('Api error ', err);
        });
    }
  };
  // console.log(updateObj.isActive)
  return (
    <>
      <div className="">
        <div className=" flex flex-col gap-10 bg-white py-10 px-5 max-lg:gap-5 rounded-xl relative">
          <div>
            <p className="text-3xl text-gray-600 text-center">All Trip Details</p>
          </div>
          <div className="absolute left-6 z-10 text-gray-500 ">
            <span className="mr-1">Show :</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="text-md border rounded border-gray-300 outline-gray-300 w-12 text-center"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            {'  '}
            <span className="ml-1">entries</span>
          </div>
          {/*  */}
          <div>
            <div className="flex items-center gap-5">
              <span className="text-[#49C401]">
                <IconAdjustmentsHorizontal />
              </span>
              <div className="flex gap-2">
                <button
                  className={`font-semibold rounded ${IsActive == 1 ? 'bg-[#49c401] p-1 text-white' : ''}`}
                  onClick={() => setIsActive(1)}
                >
                  Active
                </button>
                <button
                  className={`font-semibold rounded ${IsActive == 1 ? '' : 'bg-red-500 p-1 text-white'}`}
                  onClick={() => setIsActive(0)}
                >
                  InActive
                </button>
              </div>
              <FormControl fullWidth>
                <TextField type="text" label="Bus Number" className="" onChange={(e) => setSbusNo(e.target.value)} value={sBusNo} />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  type="text"
                  label="Driver Name"
                  className=""
                  onChange={(e) => setSdriverName(e.target.value)}
                  value={sDriverName}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField type="text" label="Route Name" className="" onChange={(e) => setSrouteNo(e.target.value)} value={sRouteNo} />
              </FormControl>
            </div>
          </div>
          {/*  */}

          <div>
            <div>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 500 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column.id} style={{ minWidth: column.minWidth }} className="bg-gray-300">
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayItems()?.map((item, i) => {
                        return (
                          <TableRow key={i} className={`${item.isActive ? 'bg-green-200' : 'bg-red-200'}`}>
                            <TableCell className="font-medium">{item.trip_id}</TableCell>
                            <TableCell className="font-medium">{` ${item.routname} (${item.routenumber})`}</TableCell>
                            <TableCell className="font-medium">{item.bus_number}</TableCell>
                            <TableCell className="font-medium">{item.driver_name}</TableCell>
                            <TableCell className="font-medium">{`${item.startTime} - ${item.endTime}`}</TableCell>
                            <TableCell className="font-medium">{item.vendor_name}</TableCell>
                            <TableCell className="font-medium">{item.runningDays?.map((e) => findDay(e))}</TableCell>
                            <TableCell>
                              <button className="p-2 text-lg text-blue-600" onClick={() => handleOpen(item)}>
                                <IconPencil className="h-4" />
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
                <Stack spacing={2}>
                  <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style} className=" w-[80%] max-lg:h-[100%] max-lg:w-screen p-4 ">
          <div className=" max-lg:w-full flex flex-col gap-1 bg-white  p-8 rounded-xl">
            <div className="flex justify-between pb-5">
              <p className="text-xl font-bold">Update Trip</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <>
              <div>
                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-3 gap-10">
                  {/* Route Name*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="demo-simple-seect"
                        label="Route"
                        disabled={true}
                        value={`${updateObj.routname} (${updateObj.routenumber})`}
                      />
                    </FormControl>
                  </div>
                  {/* bus no who is not Assign with any trip */}
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id="BusNo">Select bus.</InputLabel>
                      <Select
                        labelId="BusNo"
                        label="Select bus"
                        value={updateObj.bus_id}
                        // defaultValue={updateObj.bus_id}
                        onChange={(e) => setUpdateObj({ ...updateObj, bus_id: e.target.value })}
                      >
                        <MenuItem value={updateObj.bus_id} disabled={true}>
                          {updateObj.bus_number}
                        </MenuItem>
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
                  {/* Driver Name */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField label="Driver Name." disabled={true} value={UnAssignDriverName} />
                    </FormControl>
                  </div>{' '}
                  {/* Start Time */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        type="time"
                        fullWidth
                        id="outlined-basi"
                        label="Start time"
                        variant="outlined"
                        name="startTime"
                        value={updateObj.startTime}
                        onChange={handleTimeInput}
                        format="HH:mm:ss"
                        inputProps={{
                          step: 1
                        }}
                      />
                    </FormControl>
                  </div>
                  {/* End Time */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        type="time"
                        fullWidth
                        id="outlined-basi"
                        label="End time"
                        variant="outlined"
                        name="endTime"
                        value={updateObj.endTime}
                        onChange={handleTimeInput}
                        format="HH:mm:ss"
                        inputProps={{
                          step: 1
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className=" flex flex-col items-center">
                    <p className="text-xl text-gray-600 ">Select Running Days</p>
                    <p className="border w-1/2  border-gray-300 my-2"></p>
                  </div>
                  <div className="flex gap-10 max-md:gap-5 justify-center px-10 max-md:px-5 mt-4">
                    {(JSON.stringify(updateObj.runningDays) == JSON.stringify(['0', '1', '2', '3', '4', '5', '6']) ||
                      JSON.stringify(updateObj.runningDays) == JSON.stringify(['1', '2', '3', '4', '5']) ||
                      updateObj.runningDays?.length == 0) &&
                    dayDis.buttonDisable ? (
                      <>
                        <div>
                          {JSON.stringify(updateObj.runningDays) == JSON.stringify(['0', '1', '2', '3', '4', '5', '6']) ? (
                            <Button variant="contained" className={'bg-green-700'} onClick={clearField}>
                              Full Weeked
                            </Button>
                          ) : (
                            <Button variant="contained" className={'bg-blue-700'} onClick={handleFullWeek}>
                              Full Weeks
                            </Button>
                          )}
                        </div>
                        <div>
                          {JSON.stringify(updateObj.runningDays) == JSON.stringify(['1', '2', '3', '4', '5']) ? (
                            <Button variant="contained" className={'bg-green-700'} onClick={clearField}>
                              Week Dayed
                            </Button>
                          ) : (
                            <Button variant="contained" className={'bg-blue-700'} onClick={handleWeekDay}>
                              Week Days
                            </Button>
                          )}
                        </div>
                        <div>
                          <Button variant="contained" className="bg-blue-700" onClick={() => handleSelectButton()}>
                            Select Days
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="grid  justify-center items-center w-full gap-3 grid-cols-4 max-sm:grid-cols-3">
                        {/* sunday */}
                        {updateObj.runningDays?.includes('0') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('sunday', '0')}>
                            Sunday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('sunday', '0')}>
                            Sunday
                          </Button>
                        )}
                        {/* monday */}
                        {updateObj.runningDays?.includes('1') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('monday', '1')}>
                            monday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('monday', '1')}>
                            monday
                          </Button>
                        )}
                        {/* tuesday */}
                        {updateObj.runningDays?.includes('2') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('tuesday', '2')}>
                            Tuesday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('tuesday', '2')}>
                            Tuesday
                          </Button>
                        )}
                        {/* wednesday */}
                        {updateObj.runningDays?.includes('3') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('wednesday', '3')}>
                            wednesday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('wednesday', '3')}>
                            wednesday
                          </Button>
                        )}

                        {/* thursday */}
                        {updateObj.runningDays?.includes('4') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('thursday', '4')}>
                            thursday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('thursday', '4')}>
                            thursday
                          </Button>
                        )}
                        {/* friday */}
                        {updateObj.runningDays?.includes('5') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('friday', '5')}>
                            friday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('friday', '5')}>
                            friday
                          </Button>
                        )}
                        {/* saturday */}
                        {updateObj.runningDays?.includes('6') ? (
                          <Button variant="contained" className="bg-green-600" onClick={() => deleteSelectedDays('saturday', '6')}>
                            saturday
                          </Button>
                        ) : (
                          <Button variant="contained" className="bg-blue-600" onClick={() => handleSelectedDays('saturday', '6')}>
                            saturday
                          </Button>
                        )}
                        <Button variant="outlined" color="error" onClick={() => clearField()}>
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* checkbox */}
              <div className="text-lg flex gap-5 justify-center mt-4">
                <input
                  id="activate"
                  type="checkbox"
                  checked={updateObj.isActive}
                  onChange={(e) => setUpdateObj({ ...updateObj, isActive: e.target.checked })}
                />
                <label htmlFor="activate">Active</label>
              </div>

              <div className="mt-6">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateTrip}>
                    Update Trip
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleClose()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          </div>
          <div className="mt-2"></div>
        </Box>
      </Modal>
      {/* update modal end */}
    </>
  );
};
