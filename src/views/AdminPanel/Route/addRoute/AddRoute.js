import React, { useState } from 'react';
import { TextField, Button, FormControl, Checkbox, FormControlLabel, Modal, Box } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import { IconCirclePlus, IconX } from '@tabler/icons-react';
import Loader from 'ui-component/LoaderCircular';
import * as XLSX from 'xlsx';
import { estimatedTimeConvertor } from 'utils/TimeDate';
// perkmrate
export const AddRoute = () => {
  const [routeForm, setRouteForm] = useState({
    startpointname: '',
    startlat: '',
    startlng: '',
    endpointname: '',
    endlat: '',
    endlng: '',
    totalroutedistance: '',
    routestarttime: '00:00:00',
    routeendtime: '00:00:00',
    routeNo: '',
    fixedRate: '',
    isFixedRate: false,
    baseRate: '',
    perKmRate: '',
    routeBasePriceAdhoc: '',
    maxRouteFare: ''
  });
  const [startpointnameErr, setStartPointNameErr] = useState(false);
  const [startlatErr, setStartlatErr] = useState(false);
  const [startlngErr, setStartlngErr] = useState(false);
  const [routestarttimeErr, setRouteStartTimeErr] = useState(false);
  const [endpointnameErr, setEndPointNameErr] = useState(false);
  const [endlatErr, setEndlatErr] = useState(false);
  const [endlngErr, setEndlngErr] = useState(false);
  const [totalroutedistanceErr, setTotalRouteDistanceErr] = useState(false);
  const [routeendtimeErr, setRouteEndTimeErr] = useState(false);
  const [routeNumberErr, setRouteNumberErr] = useState(false);
  const [fixedRateErr, setFixedRateErr] = useState(false);
  const [baseRateErr, setBaseRateErr] = useState(false);
  const [perKmRateErr, setPerKmRateErr] = useState(false);
  const [maxRouteFareErr, setMaxRouteFareErr] = useState(false);
  const [routeBaseAdhocErr, setRouteBaseAdhocErr] = useState(false);
  const handleTimeInput = (e) => {
    const inputValue = e.target.value;
    const field = e.target.name;
    // Use a regular expression to validate the input
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (regex.test(inputValue) || inputValue === '') {
      setRouteForm({ ...routeForm, [field]: inputValue });
    }
  };
  // modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [formatCheck, setFormatCheck] = useState(false);
  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  const handleRoute = () => {
    if (
      routeForm.endlat != '' &&
      routeForm.endlng != '' &&
      routeForm.endpointname != '' &&
      routeForm.startpointname != '' &&
      routeForm.startlat != '' &&
      routeForm.startlng != '' &&
      routeForm.totalroutedistance != '' &&
      routeForm.routeendtime > routeForm.routestarttime &&
      routeForm.fixedRate != '' &&
      routeForm.baseRate != '' &&
      routeForm.routeNo != '' &&
      routeForm.maxRouteFare != '' &&
      routeForm.routeBasePriceAdhoc != '' &&
      routeForm.perKmRate != ''
    ) {
      const body = {
        startPointName: routeForm.startpointname.trim(),
        startLat: routeForm.startlat,
        startLng: routeForm.startlng,
        endStopName: routeForm.endpointname.trim(),
        endLat: routeForm.endlat,
        endLng: routeForm.endlng,
        totalDistance: routeForm.totalroutedistance,
        endTime: routeForm.routeendtime,
        startTime: routeForm.routestarttime,
        routeFixedRate: routeForm.fixedRate,
        routeBasePrice: routeForm.baseRate,
        routeNumber: routeForm.routeNo,
        userIsFixedRate: routeForm.isFixedRate,
        userPerKmRate: routeForm.perKmRate,
        userBasePriceAdhoc: routeForm.routeBasePriceAdhoc,
        userMaxRouteFare: routeForm.maxRouteFare
      };
      console.log(body);
      axios
        .post(`${BackendUrl}/app/v1/route/createRoute`, body, { headers: {} })
        .then((res) => {
          console.log(res.data);
          toast.success('Route Add Successfully');
          handleClear();
        })
        .catch((e) => {
          console.log('Api Failed : ', e);
          toast.error('Error');
        });
      setRouteEndTimeErr(false);
      setRouteStartTimeErr(false);
      setStartPointNameErr(false);
      setStartlatErr(false);
      setStartlngErr(false);
      setEndPointNameErr(false);
      setEndlatErr(false);
      setEndlngErr(false);
      setTotalRouteDistanceErr(false);
      setBaseRateErr(false);
      setFixedRateErr(false);
      setRouteNumberErr(false);
    } else {
      // route time
      if (routeForm.routeendtime <= routeForm.routestarttime) {
        setRouteEndTimeErr(true);
        setRouteStartTimeErr(true);
      } else {
        setRouteEndTimeErr(false);
        setRouteStartTimeErr(false);
      }
      // start name
      routeForm.startpointname == '' ? setStartPointNameErr(true) : setStartPointNameErr(false);
      // start latitude
      routeForm.startlat == '' ? setStartlatErr(true) : setStartlatErr(false);
      // start longitude
      routeForm.startlng == '' ? setStartlngErr(true) : setStartlngErr(false);
      //end name
      routeForm.endpointname == '' ? setEndPointNameErr(true) : setEndPointNameErr(false);
      // end latitude
      routeForm.endlat == '' ? setEndlatErr(true) : setEndlatErr(false);
      // end longitude
      routeForm.endlng == '' ? setEndlngErr(true) : setEndlngErr(false);
      // Total route Distance
      routeForm.totalroutedistance == '' ? setTotalRouteDistanceErr(true) : setTotalRouteDistanceErr(false);
      // fixed rate
      routeForm.fixedRate == '' ? setFixedRateErr(true) : setFixedRateErr(false);
      //base rate
      routeForm.baseRate == '' ? setBaseRateErr(true) : setBaseRateErr(false);
      //route number
      routeForm.routeNo == '' ? setRouteNumberErr(true) : setRouteNumberErr(false);
      // max route fare
      routeForm.maxRouteFare == '' ? setMaxRouteFareErr(true) : setMaxRouteFareErr(false);
      // route base price Adhoc
      routeForm.routeBasePriceAdhoc == '' ? setRouteBaseAdhocErr(true) : setRouteBaseAdhocErr(false);
      // per km rate
      routeForm.perKmRate == '' ? setPerKmRateErr(true) : setPerKmRateErr(false);
      toast.error('Some Field are Missing');
    }
  };
  const handleClear = () => {
    setRouteForm({
      startpointname: '',
      startlat: '',
      startlng: '',
      endpointname: '',
      endlat: '',
      endlng: '',
      totalroutedistance: '',
      routestarttime: '00:00:00',
      routeendtime: '00:00:00',
      routeNo: '',
      fixedRate: '',
      isFixedRate: true,
      baseRate: '',
      perKmRate: '',
      routeBasePriceAdhoc: '',
      maxRouteFare: ''
    });
    console.log('error');
  };

  // excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the first sheet is the one you want to convert to JSON
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const headerMapping = {
        'Start Point': 'startPointName',
        'Start Latitude': 'startLat',
        'Start Longitude': 'startLng',
        'End Point': 'endStopName',
        'End Latitude': 'endLat',
        'End Longitude': 'endLng',
        'Total Distance': 'totalDistance',
        'End Time': 'endTime',
        'Start Time': 'startTime',
        'Fixed Rate': 'routeFixedRate',
        'Base Price': 'routeBasePrice',
        'Route No': 'routeNumber',
        'Rate Per Km': 'userPerKmRate',
        'BasePrice Adhoc': 'userBasePriceAdhoc',
        'Max Route Fare': 'userMaxRouteFare'
      };

      const adjustedData = sheetData.map((row) => {
        const adjustedRow = {};
        Object.keys(row).forEach((header) => {
          const mappedHeader = headerMapping[header] || header;
          adjustedRow[mappedHeader] = row[header];
        });
        return adjustedRow;
      });
      const res = [];
      const datapacket = [
        'startPointName',
        'startLat',
        'startLng',
        'endStopName',
        'endLat',
        'endLng',
        'totalDistance',
        'endTime',
        'startTime',
        'routeFixedRate',
        'routeBasePrice',
        'routeNumber',
        'userPerKmRate',
        'userBasePriceAdhoc',
        'userMaxRouteFare'
      ];
      for (let item of adjustedData) {
        for (let i = 0; i < datapacket.length; i++) {
          if (!item[datapacket[i]]) {
            setFormatCheck(true);
            window.alert(`Route Number : ${item.routeNumber} ::-- Mising field of  is ${datapacket[i]}`);
            return;
          }
        }
        res.push({
          ...item,
          userIsFixedRate: false,
          endTime: estimatedTimeConvertor(item.endTime),
          startTime: estimatedTimeConvertor(item.startTime)
        });
        setFormatCheck(false);
      }

      console.log(res);
      setJsonData(res);
    };
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log(JSON.stringify(jsonData, null, 2));
    try {
      for (const row of jsonData) {
        setisLoading(true);
        axios
          .post(`${BackendUrl}/app/v1/route/createRoute`, row)
          .then((res) => {
            console.log(res);
            toast.success(res.data.result);
            setisLoading(false);
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status == 400) {
              window.alert(`NO Stop Added with stopName :- ${row.stopName}`);
              return;
            }
          });
      }
    } catch {
      console.log('Api error');
    }
    // Handle success (e.g., show a success message)
  };

  return (
    <>
      <div>
        <div>
          <Toaster />
        </div>
        <div className="flex flex-col gap-10 bg-white py-10 px-5 max-lg:gap-4 rounded-xl">
          <div className="relative">
            <p className="text-3xl text-gray-600 text-center">Add Route</p>
            <p className="absolute top-2 right-2 max-md:right-0">
              <button onClick={() => handleOpen()}>
                <IconCirclePlus />
              </button>
            </p>
          </div>
          <div className=" grid grid-cols-2 max-md:grid-cols-1 gap-10  max-lg:gap-5">
            <div className="grid-1">
              <FormControl fullWidth>
                <TextField
                  type="number"
                  label="Route Number"
                  className=''
                  id="oulined-basic" 
                  variant="outlined"
                  value={routeForm.routeNo}
                  onChange={(e) => setRouteForm({ ...routeForm, routeNo: e.target.value })}
                />
              </FormControl>
              {routeNumberErr && <p className="text-red-500 text-xs ml-2">Total Route distance Error</p>}
            </div>
            <div>
              <FormControl fullWidth>
                <TextField
                  type="number"
                  label="Total Distance"
                  id="oulined-basic"
                  variant="outlined"
                  value={routeForm.totalroutedistance}
                  onChange={(e) => setRouteForm({ ...routeForm, totalroutedistance: e.target.value })}
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
                  value={routeForm.startpointname}
                  onChange={(e) => setRouteForm({ ...routeForm, startpointname: e.target.value })}
                  
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
                  value={routeForm.endpointname}
                  onChange={(e) => setRouteForm({ ...routeForm, endpointname: e.target.value })}
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
                  value={routeForm.startlat}
                  onChange={(e) => setRouteForm({ ...routeForm, startlat: e.target.value })}
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
                  value={routeForm.startlng}
                  onChange={(e) => setRouteForm({ ...routeForm, startlng: e.target.value })}
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
                  value={routeForm.endlat}
                  onChange={(e) => setRouteForm({ ...routeForm, endlat: e.target.value })}
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
                  value={routeForm.endlng}
                  onChange={(e) => setRouteForm({ ...routeForm, endlng: e.target.value })}
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
                  value={routeForm.routestarttime}
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
                  value={routeForm.routeendtime}
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
                  value={routeForm.fixedRate}
                  onChange={(e) => setRouteForm({ ...routeForm, fixedRate: e.target.value })}
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
                  value={routeForm.baseRate}
                  onChange={(e) => setRouteForm({ ...routeForm, baseRate: e.target.value })}
                />
              </FormControl>
              {baseRateErr && <p className="text-red-500 text-xs ml-2">Base Rate Error</p>}
            </div>
            {/*  */}
            <div>
              <FormControl fullWidth>
                <TextField
                  type="number"
                  label="Per Km Rate"
                  id="oulined-basic"
                  variant="outlined"
                  value={routeForm.perKmRate}
                  onChange={(e) => setRouteForm({ ...routeForm, perKmRate: e.target.value })}
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
                  value={routeForm.routeBasePriceAdhoc}
                  onChange={(e) => setRouteForm({ ...routeForm, routeBasePriceAdhoc: e.target.value })}
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
                  value={routeForm.maxRouteFare}
                  onChange={(e) => setRouteForm({ ...routeForm, maxRouteFare: e.target.value })}
                />
              </FormControl>
              {maxRouteFareErr && <p className="text-red-500 text-xs ml-2">max Route Fare Error</p>}
            </div>
            <div>
              <FormControlLabel
                control={<Checkbox inputProps={{ 'aria-label': 'controlled' }} />}
                label="Is Fixed Rate"
                checked={routeForm.isFixedRate}
                onChange={(e) => setRouteForm({ ...routeForm, isFixedRate: e.target.checked })}
              />
            </div>
          </div>

          <div>
            <div className="flex gap-10 justify-between">
              <Button  className="bg-[#49C401] text-white hover:bg-[#49C401] px-5 py-2 rounded-lg" onClick={handleRoute}>
                Add Route
              </Button>{' '}
              <Button variant="outlined" color="error" onClick={handleClear}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="overflow-y-scroll"
      >
        <Box sx={style} className="bg-white p-8 w-96 max-md:w-96 rounded-xl">
          {isLoading && (
            <div>
              <Loader />
            </div>
          )}
          <div className="w-full">
            <div className="flex justify-between pb-5">
              <p className="text-xl font-bold">Upload Route</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className=" grid grid-cols-1 gap-5">
              <div>
                <input
                  type="file"
                  className="border border-gray-300 p-2 w-full rounded-xl tailwind-ellipsis"
                  onChange={handleFileUpload}
                />
              </div>
              <div>
                <Button type="submit" variant="contained" className="bg-blue-600 w-full" disabled={formatCheck}>
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};
