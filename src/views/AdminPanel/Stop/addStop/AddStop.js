import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, Select, InputLabel, MenuItem, Modal, Box } from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BackendUrl } from 'utils/config';
import { IconCirclePlus, IconX } from '@tabler/icons-react';
import Loader from 'ui-component/LoaderCircular';
import * as XLSX from 'xlsx';
import { estimatedTimeConvertor } from 'utils/TimeDate';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4
};

export const AddStop = () => {
  const [route, setRoute] = useState([]);
  const [stopForm, setStopForm] = useState({
    routeId: '',
    stopName: '',
    stopLatitude: '',
    stopLongitude: '',
    stopETA: '00:00:00',
    stopDistance: ''
  });
  const [routeIdErr, setRouteIdErr] = useState(false);
  const [stopNameErr, setStopNameErr] = useState(false);
  const [stopLatitudeErr, setStopLatitudeErr] = useState(false);
  const [stopLongitudeErr, setStopLongitudeErr] = useState(false);
  const [stopETAErr, setStopETAErr] = useState(false);
  const [stopDistanceErr, setStopDistanceErr] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [formatCheck, setFormatCheck] = useState(false);
  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/route/getAllRoutes`)
      .then((res) => setRoute(res?.data?.result))
      .catch((e) => console.log('Route API error', e));
  }, []);
  // console.log(route);
  const handleStopETAInput = (e) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (regex.test(inputValue) || inputValue === '') {
      setStopForm({ ...stopForm, stopETA: inputValue });
    }
  };
  const clearRoute = () => {
    setStopForm({
      routeId: '',
      stopName: '',
      stopLatitude: '',
      stopLongitude: '',
      stopETA: '',
      stopDistance: ''
    });
  };
  const handleAddStop = () => {
    if (
      stopForm.routeId != '' &&
      stopForm.stopETA != '' &&
      stopForm.stopLatitude != '' &&
      stopForm.stopLongitude != '' &&
      stopETAErr.stopName != '' &&
      stopForm.stopDistance != ''
    ) {
      const body = {
        routeId: stopForm.routeId,
        stopName: String(stopForm.stopName).trim(),
        stopLat: stopForm.stopLatitude.trim(),
        stopLng: stopForm.stopLongitude.trim(),
        stopEta: stopForm.stopETA.trim(),
        stopDistanceFromStart: stopForm.stopDistance.trim()
      };
      console.log(body);
      axios
        .post(`${BackendUrl}/app/v1/stops/createstop`, body, { headers: {} })
        .then((res) => {
          console.log(res.data);
          toast.success(`${res.data.result}`);
          clearRoute();
        })
        .catch((e) => {
          console.log(e);
          toast.error('Error');
        });
      setStopLongitudeErr(false);
      setStopETAErr(false);
      setStopNameErr(false);
      setStopLatitudeErr(false);
      setRouteIdErr(false);
    } else {
      stopForm.routeId == '' ? setRouteIdErr(true) : setRouteIdErr(false);
      stopForm.stopName == '' ? setStopNameErr(true) : setStopNameErr(false);
      stopForm.stopLatitude == '' ? setStopLatitudeErr(true) : setStopLatitudeErr(false);
      stopForm.stopLongitude == '' ? setStopLongitudeErr(true) : setStopLongitudeErr(false);
      stopForm.stopETA == '' ? setStopETAErr(true) : setStopETAErr(false);
      stopForm.stopDistance == '' ? setStopDistanceErr(true) : setStopDistanceErr(false);
    }
  };
  //upload file
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
        'Stop Name': 'stopName',
        'Stop Lat': 'stopLat',
        'Stop Lng': 'stopLng',
        'Stop ETA': 'stopEta',
        'Stop Distance': 'stopDistanceFromStart'
        // Add more mappings as needed
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
      const datapacket = ['stopName', 'stopLat', 'stopLng', 'stopEta', 'stopDistanceFromStart'];
      for (let item of adjustedData) {
        for (let i = 0; i < datapacket.length; i++) {
          if (!item[datapacket[i]]) {
            setFormatCheck(true);
            window.alert(`Stop name : ${item.stopName} ::-- Mising field of  is ${datapacket[i]}`);
            return;
          }
        }
        res.push({ ...item, stopEta: estimatedTimeConvertor(item.stopEta), routeId: Number(stopForm.routeId) });
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
          .post(`${BackendUrl}/app/v1/stops/createstop`, row)
          .then((res) => {
            console.log(res);
            toast.success('Stop Added Successfully');
            setisLoading(false);
            handleClose();
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
        <div className="flex flex-col gap-4 bg-white p-[60px] rounded-xl">
          {/* heading */}
          <div className="relative">
            <p className="text-3xl max-md:text-2xl text-gray-600 text-center">Add Stop</p>
            <p className="absolute top-2 right-2 max-md:right-0">
              <button onClick={() => handleOpen()}>
                <IconCirclePlus />
              </button>
            </p>
          </div>
          <div className='my-4 max-lg:mb-2'>
            <div>
              {/* Stop Route */}
              <FormControl fullWidth>
                <InputLabel id="Route">Route</InputLabel>
                <Select
                  labelId="Route"
                  id="demo-sple-select"
                  label="Route"
                  value={stopForm.routeId}
                  onChange={(e) => setStopForm({ ...stopForm, routeId: e.target.value })}
                >
                  {route.map((item, i) => (
                    <MenuItem value={item.route_id} key={i}>
                      {item.route_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {routeIdErr && <p className="text-red-500 text-xs ml-2">select your route</p>}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 max-lg:grid-cols-1 max-lg:gap-6 gap-8">
              <div>
                {/* Stop Name */}
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    type="text"
                    label="Stop Name"
                    variant="outlined"
                    disabled={stopForm.routeId == '' ? true : false}
                    value={stopForm.stopName}
                    onChange={(e) => setStopForm({ ...stopForm, stopName: e.target.value })}
                  />
                </FormControl>
                {stopNameErr && <p className="text-red-500 text-xs ml-2">Enter your stop name</p>}
              </div>
              <div>
                {/* Stop Latitude */}
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    id="outlined-basi"
                    label="Stop Latitude"
                    variant="outlined"
                    value={stopForm.stopLatitude}
                    onChange={(e) => setStopForm({ ...stopForm, stopLatitude: e.target.value })}
                    disabled={stopForm.routeId == '' ? true : false}
                  />
                </FormControl>
                {stopLatitudeErr && <p className="text-red-500 text-xs ml-2">Enter your stop latitude</p>}
              </div>
              <div>
                {/* Stop Longitude */}
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="Stop Longitude"
                    type="text"
                    variant="outlined"
                    value={stopForm.stopLongitude}
                    onChange={(e) => setStopForm({ ...stopForm, stopLongitude: e.target.value })}
                    disabled={stopForm.routeId == '' ? true : false}
                  />
                </FormControl>
                {stopLongitudeErr && <p className="text-red-500 text-xs ml-2">Enter your stop longitude</p>}
              </div>
              <div>
                <FormControl fullWidth>
                  <TextField
                    type="time"
                    label="ETA"
                    variant="outlined"
                    value={stopForm.stopETA}
                    onChange={handleStopETAInput}
                    format="HH:mm:ss"
                    inputProps={{
                      step: 1
                    }}
                    disabled={stopForm.routeId == '' ? true : false}
                  />
                </FormControl>
                {stopETAErr && <p className="text-red-500 text-xs ml-2">select your ETA</p>}
              </div>
              <div>
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    label="Stop Distance"
                    variant="outlined"
                    value={stopForm.stopDistance}
                    onChange={(e) => setStopForm({ ...stopForm, stopDistance: e.target.value })}
                    disabled={stopForm.routeId == '' ? true : false}
                  />
                </FormControl>
                {stopDistanceErr && <p className="text-red-500 text-xs ml-2">Stop distance err</p>}
              </div>
            </div>
          </div>
          {/* button */}
          <div className='mt-4 max-lg:mt-2'>
            <div className="flex justify-between">
              <Button variant="contained" className="bg-[#49C401]" onClick={() => handleAddStop()}>
                Add Stop
              </Button>
              <Button variant="outlined" color="error" onClick={() => clearRoute()}>
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
        <Box sx={style} className="bg-white p-4 w-96 max-md:w-96 rounded-xl">
          {isLoading && (
            <div>
              <Loader />
            </div>
          )}
          <div className="w-full">
            <div className="flex justify-between pb-5">
              <p className="text-xl font-bold">Add Stops</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className=" grid grid-cols-1 gap-5">
              <div>
                {/* Stop Route */}
                <FormControl fullWidth>
                  <InputLabel id="Route">Route</InputLabel>
                  <Select
                    labelId="Route"
                    id="demo-sple-select"
                    label="Route"
                    value={stopForm.routeId}
                    onChange={(e) => setStopForm({ ...stopForm, routeId: e.target.value })}
                  >
                    {route.map((item, i) => (
                      <MenuItem value={item.route_id} key={i}>
                        {item.route_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {routeIdErr && <p className="text-red-500 text-xs ml-2">select your route</p>}
              </div>
              <div>
                <input
                  type="file"
                  className=" border border-gray-300 p-2 w-full rounded-xl tailwind-ellipsis"
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
