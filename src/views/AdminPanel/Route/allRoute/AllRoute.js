import React from 'react';
import { useState, useEffect } from 'react';
// import FilterListIcon from '@mui/icons-material/FilterList';
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
  Pagination
} from '@mui/material';
import axios from 'axios';
import { IconPencil, IconX, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { BackendUrl } from 'utils/config';

const columns = [
  { id: 'route_no', label: 'Route No', minWidth: 100 },
  { id: 'start_point', label: 'Start Point', minWidth: 160 },
  { id: 'start_time', label: 'Start Time', minWidth: 160 },
  { id: 'end_point', label: 'End Point', minWidth: 200 },
  { id: 'end_time', label: 'End Time', minWidth: 100 },
  { id: 'perkmrate', label: 'Rate/Km', minWidth: 100 },
  { id: 'fixed_rate', label: 'Fixed Rate', minWidth: 100 },
  { id: 'maxroutefare', label: 'Max Fare', minWidth: 160 },
  { id: 'Adhoc Seats', label: 'Adhoc Seats', minWidth: 140 },
  { id: 'distance', label: 'Distance(km)', minWidth: 120 },
  { id: 'status', label: 'Status', minWidth: 160 },
  { id: 'edit', label: 'Update', minWidth: 160 }
];
export const AllRoute = () => {
  const [routeData, setRouteData] = useState([]);
  let [filterData, setFilterData] = useState([]);
  // update state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [field, setField] = useState('');
  // const [value, setValue] = useState('');
  const [srouteNo, setSrouteNo] = useState('');
  const [sStartPoint, setSstartPoint] = useState('');
  const [sEndPoint, setSendPoint] = useState('');
  const [IsActive, setIsActive] = useState(true);
  // refreshPage
  const [refreshPage, setRefreshPage] = useState(false);
  // handle update field err
  const [startpointnameErr, setStartPointNameErr] = useState(false);
  const [startlatErr, setStartlatErr] = useState(false);
  const [startlngErr, setStartlngErr] = useState(false);
  const [routestarttimeErr, setRouteStartTimeErr] = useState(false);
  const [endpointnameErr, setEndPointNameErr] = useState(false);
  const [endlatErr, setEndlatErr] = useState(false);
  const [endlngErr, setEndlngErr] = useState(false);
  const [totalroutedistanceErr, setTotalRouteDistanceErr] = useState(false);
  const [routeendtimeErr, setRouteEndTimeErr] = useState(false);
  const [fixedRateErr, setFixedRateErr] = useState(false);
  const [baseRateErr, setBaseRateErr] = useState(false);
  const [perKmRateErr, setPerKmRateErr] = useState(false);
  const [maxRouteFareErr, setMaxRouteFareErr] = useState(false);
  const [routeBaseAdhocErr, setRouteBaseAdhocErr] = useState(false);

  useEffect(() => {
    setRefreshPage(false);
    axios
      .get(`${BackendUrl}/app/v1/route/getRouteDetails`)
      .then((res) => {
        // console.log(res.data.result);
        setRouteData(res.data?.result);
      })
      .catch((e) => console.log('Api fail ', e));
  }, [refreshPage]);

  // filter
  useEffect(() => {
    let res = routeData.filter((item) => item.activeStatus == IsActive);
    if (sStartPoint != '') {
      res = res?.filter((item) => item['startpointname']?.includes(sStartPoint));
    }
    if (sEndPoint != '') {
      res = res?.filter((item) => item['endpointname']?.includes(sEndPoint));
    }
    if (srouteNo != '') {
      res = res?.filter((item) => String(item['routenumber']).includes(String(srouteNo)));
    }

    setFilterData(res);
  }, [routeData, sEndPoint, sStartPoint, srouteNo, IsActive]);

  // handle input field
  const handleOpen = (item) => {
    setUpdateObj(item);
    setUpdateOpen(true);
  };
  const handleClose = () => setUpdateOpen(false);
  const updateRoute = () => {
    // console.log('call')
    if (
      updateObj.routenumber != '' &&
      updateObj.perkmrate != '' &&
      updateObj.endlat != '' &&
      updateObj.endlng != '' &&
      updateObj.endpointname != '' &&
      updateObj.routebaseprice != '' &&
      updateObj.routeendtime != '' &&
      updateObj.routefixedrate != '' &&
      updateObj.routestarttime != '' &&
      updateObj.startlat != '' &&
      updateObj.startlng != '' &&
      updateObj.startpointname != '' &&
      updateObj.totalroutedistance != '' &&
      updateObj.routebasepriceadhoc != '' &&
      updateObj.maxroutefare != '' &&
      updateObj.routeendtime > updateObj.routestarttime
    ) {
      const body = {
        routeId: updateObj.route_id,
        startPointName: String(updateObj.startpointname).trim(),
        startLat: updateObj.startlat,
        startLng: updateObj.startlng,
        endPointName: String(updateObj.endpointname),
        endLat: updateObj.endlat,
        endLng: updateObj.endlng,
        totalRouteDistance: updateObj.totalroutedistance,
        routeStartTime: updateObj.routestarttime,
        routeEndTime: updateObj.routeendtime,
        activeStatus: Boolean(updateObj.activeStatus),
        routeFixedRateIn: updateObj.routefixedrate,
        routeBasePriceIn: updateObj.routebaseprice,
        routeNumberIn: updateObj.routenumber,
        userIsFixedRate: Boolean(updateObj.isFixedRate),
        userPerKmRate: updateObj.perkmrate,
        userBasePriceAdhoc: updateObj.routebasepriceadhoc,
        userMaxRouteFare: updateObj.maxroutefare
      };
      console.log('update Api');
      axios
        .patch(`${BackendUrl}/app/v1/route/updateRoute`, body)
        .then((res) => {
          // console.log(res.data);
          window.alert(res.data.result);
          setRefreshPage(true);
          handleClose();
        })
        .catch((err) => {
          console.log('Api error : ', err);
          window.alert('error');
        });
      setStartPointNameErr(false);
      setStartlatErr(false);
      setStartlngErr(false);
      setRouteStartTimeErr(false);
      setEndPointNameErr(false);
      setEndlatErr(false);
      setEndlngErr(false);
      setTotalRouteDistanceErr(false);
      setRouteEndTimeErr(false);
      setFixedRateErr(false);
      setBaseRateErr(false);
    } else {
      updateObj.endlat == '' ? setEndlatErr(true) : setEndlatErr(false);
      updateObj.endlng == '' ? setEndlngErr(true) : setEndlngErr(false);
      updateObj.endpointname == '' ? setEndPointNameErr(true) : setEndPointNameErr(false);
      updateObj.routebaseprice == '' ? setBaseRateErr(true) : setBaseRateErr(false);
      updateObj.routeendtime == '' ? setRouteEndTimeErr(true) : setRouteEndTimeErr(false);
      updateObj.routefixedrate == '' ? setFixedRateErr(true) : setFixedRateErr(false);
      updateObj.routestarttime == '' ? setRouteStartTimeErr(true) : setRouteStartTimeErr(false);
      updateObj.startlat == '' ? setStartlatErr(true) : setStartlatErr(false);
      updateObj.startlng == '' ? setStartlngErr(true) : setStartlngErr(false);
      updateObj.startpointname == '' ? setStartPointNameErr(true) : setStartPointNameErr(false);
      updateObj.totalroutedistance == '' ? setTotalRouteDistanceErr(true) : setTotalRouteDistanceErr(false);

      updateObj.userMaxRouteFare == '' ? setMaxRouteFareErr(true) : setMaxRouteFareErr(false);
      // route base price Adhoc
      updateObj.userBasePriceAdhoc == '' ? setRouteBaseAdhocErr(true) : setRouteBaseAdhocErr(false);
      // per km rate
      updateObj.userPerKmRate == '' ? setPerKmRateErr(true) : setPerKmRateErr(false);
    }
    setRefreshPage(true);
  };
  const handleTimeInput = (e) => {
    const inputValue = e.target.value;
    const field = e.target.name;
    // Use a regular expression to validate the input
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (regex.test(inputValue) || inputValue === '') {
      setUpdateObj({ ...updateObj, [field]: inputValue });
    }
  };
  const handleActiveStatus = (value) => {
    if (value) {
      window.alert('Are you want to active the route');
      setUpdateObj({ ...updateObj, activeStatus: value });
    } else {
      window.alert('Are you want to DeActive the route');
      setUpdateObj({ ...updateObj, activeStatus: value });
    }
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4
  };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filterData.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // filterData.sort((a, b) => b.activeStatus - a.activeStatus);
    return filterData.slice(startIndex, endIndex);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <div className=" flex flex-col gap-5 bg-white p-10 max-lg:gap-5 rounded-xl relative">
        <div>
          <p className="text-3xl text-gray-600 text-center">All Route Details</p>
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
              <TextField label="Route Number" className="" onChange={(e) => setSrouteNo(e.target.value)} value={srouteNo} />
            </FormControl>

            <FormControl fullWidth>
              <TextField label="Start Point" className="" onChange={(e) => setSstartPoint(e.target.value)} value={sStartPoint} />
            </FormControl>

            <FormControl fullWidth>
              <TextField label="End Point" className="" onChange={(e) => setSendPoint(e.target.value)} value={sEndPoint} />
            </FormControl>
          </div>
        </div>
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
                    {displayItems()?.map((item, i) => {
                      return (
                        <TableRow key={i} className={`${item.activeStatus == 1 ? 'bg-green-300' : 'bg-red-300'}`}>
                          <TableCell className="font-medium">{item.routenumber}</TableCell>
                          <TableCell className="font-medium">{item.startpointname}</TableCell>
                          <TableCell className="font-medium">{item.routestarttime}</TableCell>
                          <TableCell className="font-medium">{item.endpointname}</TableCell>
                          <TableCell className="font-medium">{item.routeendtime}</TableCell>
                          <TableCell className="font-medium">{item.perkmrate}</TableCell>
                          <TableCell className="font-medium">{item.routefixedrate}</TableCell>
                          <TableCell className="font-medium">{item.maxroutefare}</TableCell>
                          <TableCell className="font-medium">{item.routebasepriceadhoc}</TableCell>
                          <TableCell className="font-medium">{parseFloat(item.totalroutedistance).toFixed(2)}</TableCell>
                          <TableCell className="font-medium">{item.activeStatus == 1 ? 'Actived' : 'Deactived'}</TableCell>
                          <TableCell>
                            <button className="text-blue-600" onClick={() => handleOpen(item)}>
                              <IconPencil className="h-5" />
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

      {/* update api */}
      <Modal
        open={updateOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="overflow-y-scroll"
      >
        <Box sx={style} className=" w-full h-screen p-4 ">
          {' '}
          <div className=" max-lg:w-full flex flex-col gap-1 bg-white my-4 p-4 rounded-xl relative">
            <div className="flex justify-between pb-5 px-20 max-lg:px-0">
              <p className="text-xl font-bold">Update Route</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <>
              {' '}
              <div>
                <div className=" grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-10 px-20 py-0 max-lg:px-2 max-lg:py-5 max-lg:gap-5">
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Route ID"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.route_id}
                        disabled={true}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Route Number"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.routenumber}
                        disabled={true}
                      />
                    </FormControl>
                  </div>
                  {/* total distance error */}
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Total Distance"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.totalroutedistance}
                        onChange={(e) => setUpdateObj({ ...updateObj, totalroutedistance: e.target.value })}
                      />
                    </FormControl>
                    {totalroutedistanceErr && <p className="text-red-500 text-xs ml-2">Total Route distance Error</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        id="outlined-basi"
                        label="Start Point Name"
                        variant="outlined"
                        value={updateObj.startpointname}
                        onChange={(e) => setUpdateObj({ ...updateObj, startpointname: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {startpointnameErr && <p className="text-red-500 text-xs ml-2">Start Point Name Error</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        id="outlined-bic"
                        label="End Point Name"
                        variant="outlined"
                        value={updateObj.endpointname}
                        onChange={(e) => setUpdateObj({ ...updateObj, endpointname: e.target.value })}
                      />
                    </FormControl>
                    {endpointnameErr && <p className="text-red-500 text-xs ml-2">end Point</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="ouined-basic"
                        label="Start latitude"
                        variant="outlined"
                        value={updateObj.startlat}
                        onChange={(e) => setUpdateObj({ ...updateObj, startlat: e.target.value })}
                      />
                    </FormControl>
                    {startlatErr && <p className="text-red-500 text-xs ml-2">Start Latitude Point</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="outned-basic"
                        label="Start longitude"
                        variant="outlined"
                        value={updateObj.startlng}
                        onChange={(e) => setUpdateObj({ ...updateObj, startlng: e.target.value })}
                      />
                    </FormControl>
                    {startlngErr && <p className="text-red-500 text-xs ml-2">Start longitude Point</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="outlid-basic"
                        label="End Latitude"
                        variant="outlined"
                        value={updateObj.endlat}
                        onChange={(e) => setUpdateObj({ ...updateObj, endlat: e.target.value })}
                      />
                    </FormControl>
                    {endlatErr && <p className="text-red-500 text-xs ml-2">end latitude Point</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        id="outlind-basic"
                        label="End Longitude"
                        variant="outlined"
                        value={updateObj.endlng}
                        onChange={(e) => setUpdateObj({ ...updateObj, endlng: e.target.value })}
                      />
                    </FormControl>
                    {endlngErr && <p className="text-red-500 text-xs ml-2">end longitude Point</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="time"
                        label="Route Start Time"
                        variant="outlined"
                        name="routestarttime"
                        value={updateObj.routestarttime}
                        onChange={handleTimeInput}
                        format="HH:mm:ss"
                        inputProps={{
                          step: 1
                        }}
                      />
                    </FormControl>
                    {routestarttimeErr && <p className="text-red-500 text-xs ml-2">route start time Err </p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="time"
                        id="outlined-asic"
                        label="Route End time"
                        variant="outlined"
                        value={updateObj.routeendtime}
                        format="HH:mm:ss"
                        onChange={handleTimeInput}
                        name="routeendtime"
                        inputProps={{
                          step: 1
                        }}
                      />
                    </FormControl>
                    {routeendtimeErr && <p className="text-red-500 text-xs ml-2">route End time err</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Fixed Rate"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.routefixedrate}
                        onChange={(e) => setUpdateObj({ ...updateObj, routefixedrate: e.target.value })}
                      />
                    </FormControl>
                    {fixedRateErr && <p className="text-red-500 text-xs ml-2">Fixed Rate Error</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Base Rate"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.routebaseprice}
                        onChange={(e) => setUpdateObj({ ...updateObj, routebaseprice: e.target.value })}
                      />
                    </FormControl>
                    {baseRateErr && <p className="text-red-500 text-xs ml-2">Base Rate Error</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="per Km Rate"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.perkmrate}
                        onChange={(e) => setUpdateObj({ ...updateObj, perkmrate: e.target.value })}
                      />
                    </FormControl>
                    {perKmRateErr && <p className="text-red-500 text-xs ml-2">per km Rate Error</p>}
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Route Base Price Adhoc"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.routebasepriceadhoc}
                        onChange={(e) => setUpdateObj({ ...updateObj, routebasepriceadhoc: e.target.value })}
                      />
                    </FormControl>
                    {routeBaseAdhocErr && <p className="text-red-500 text-xs ml-2">route Base Adhoc Error</p>}
                  </div>

                  <div>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Max Route Fare"
                        id="oulined-basic"
                        variant="outlined"
                        value={updateObj.maxroutefare}
                        onChange={(e) => setUpdateObj({ ...updateObj, maxroutefare: e.target.value })}
                      />
                    </FormControl>
                    {maxRouteFareErr && <p className="text-red-500 text-xs ml-2">max Route Fare Error</p>}
                  </div>
                  <div>
                    <FormControlLabel
                      control={<Checkbox inputProps={{ 'aria-label': 'controlled' }} />}
                      label="IsFixedRate"
                      checked={Boolean(updateObj.isFixedRate)}
                      onChange={(e) => setUpdateObj({ ...updateObj, isFixedRate: e.target.checked })}
                    />
                  </div>
                  <div className="m2-1 flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="check"
                      checked={updateObj.activeStatus}
                      onChange={(e) => handleActiveStatus(e.target.checked)}
                    />
                    <label htmlFor="check"> Active Status</label>
                  </div>
                </div>
              </div>
              <div className="mt-1  px-20 py-5 max-lg:px-2 ">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateRoute}>
                    update route
                  </Button>
                  <Button variant="outlined" color="error">
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          </div>
        </Box>
      </Modal>
      {/* update modal end */}
    </div>
  );
};
