import React, { useState, useEffect } from 'react';
import { FormControl, Select, InputLabel, MenuItem, TextField } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import { IconRouteAltRight, IconClock, IconCalendarMonth } from '@tabler/icons-react';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

export const AddTrip = () => {
  const [addTripForm, setAddTripForm] = useState({
    routeId: '',
    busId: '',
    startTime: '00:00:00',
    endTime: '00:00:00'
  });
  // running Days Array
  const [running, setRunning] = useState([]);
  // Bus Array From API
  const [routes, setRoutes] = useState([]);
  // Route Array from API
  const [buses, setBuses] = useState([]);
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/route/getAllRoutes`)
      .then((res) => setRoutes(res?.data?.result))
      .catch((e) => console.log(e));
    axios
      .get(`${BackendUrl}/app/v1/bus/getAllBuses`)
      .then((res) => setBuses(res?.data?.buses))
      .catch((e) => console.log(e));
  }, []);

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
    buttonDisable: false
  });
  // error field
  const [routeIdErr, setRouteIdErr] = useState(false);
  const [busIdErr, setBusIdErr] = useState(false);
  const [startTimeErr, setStartTimeErr] = useState(false);
  const [endTimeErr, setEndTimeErr] = useState(false);
  const [runningErr, setRunningErr] = useState(false);
  // select day button True/false
  const handleSelectButton = () => {
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
      buttonDisable: true,
      selectDay: !dayDis.selectDay
    });
    setRunning([]);
    setAddTripForm({
      routeId: '',
      busId: '',
      startTime: '00:00:00',
      endTime: '00:00:00'
    });
  };
  // select day and disable button using object state
  const handleSelectedDays = (day, value) => {
    setRunning([...running, value]);
    setDayDis({ ...dayDis, [day]: true });
  };
  function deleteSelectedDays(day, val) {
    let idx = running?.indexOf(val);
    running?.splice(idx, 1);
    setDayDis({ ...dayDis, [day]: false });
  }
  // Clear selected days
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
      buttonDisable: false
    });
    setRunning([]);
  };
  const handleFullWeek = () => {
    setRunning(['0', '1', '2', '3', '4', '5', '6']);
    setDayDis({
      ...dayDis,
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,

      selectDay: false,
      buttonDisable: false,
      fullweek: true,
      weekday: false
    });
  };

  const handleWeekDay = () => {
    setRunning(['1', '2', '3', '4', '5']);
    setDayDis({
      ...dayDis,
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      selectDay: false,
      buttonDisable: false,
      weekday: true,
      fullweek: false
    });
  };

  const handleStartTimeInput = (e) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (regex.test(inputValue) || inputValue === '') {
      setAddTripForm({ ...addTripForm, startTime: inputValue });
    }
  };
  const handleEndTimeInput = (e) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (regex.test(inputValue) || inputValue === '') {
      setAddTripForm({ ...addTripForm, endTime: inputValue });
    }
  };
  const handleAddTrip = () => {
    if (addTripForm.busId != '' && addTripForm.startTime < addTripForm.endTime && addTripForm.routeId != 0 && running.length != 0) {
      const body = {
        routeId: addTripForm.routeId,
        busId: addTripForm.busId,
        startTime: addTripForm.startTime,
        endTime: addTripForm.endTime,
        runningDays: JSON.stringify(running)
      };
      console.log(body);
      axios
        .post(`${BackendUrl}/app/v1/trip/addtrip`, body, { headers: {} })
        .then((res) => {
          console.log(res);
          toast.success('Trip Added SuccessFully');
          clearField();
        })
        .catch((e) => {
          console.log('Api Error ', e);
          toast.error('Error');
        });
      setBusIdErr(false);
      setEndTimeErr(false);
      setStartTimeErr(false);
      setRouteIdErr(false);
    } else {
      if (addTripForm.endTime <= addTripForm.startTime) {
        setStartTimeErr(true);
        setEndTimeErr(true);
      } else {
        setStartTimeErr(false);
        setEndTimeErr(false);
      }
      addTripForm.busId == '' ? setBusIdErr(true) : setBusIdErr(false);
      addTripForm.routeId == '' ? setRouteIdErr(true) : setRouteIdErr(false);
      running.length == 0 ? setRunningErr(true) : setRunningErr(false);
    }
  };
  const clearTrip = () => {
    setAddTripForm({
      routeId: '',
      busId: '',
      startTime: '',
      endTime: ''
    });
    setRunning([]);
  };
  // console.log(running);
  return (
    <div>
      <div>
        <Toaster />
      </div>
      <div className="flex flex-col gap-5 bg-white p-10 max-lg:gap-5 rounded-xl">
        <div>
          <p className="text-3xl font-medium text-gray-600 text-center">Create Trip</p>
        </div>
        <div className="flex flex-col gap-6 p-5 max-lg:gap-5">
          <div className="flex items-center gap-10">
            <p className="text-[#222] text-lg flex items-center gap-1 w-36">
              <span>
                <IconRouteAltRight className="h-5" />
              </span>
              <span>Route : </span>
            </p>
            <FormControl fullWidth>
              <InputLabel id="Select">Select Route</InputLabel>
              <Select
                labelId="Select Route"
                id="demo-sple-select"
                label="Select Route"
                value={addTripForm.routeId}
                onChange={(e) => setAddTripForm({ ...addTripForm, routeId: e.target.value })}
              >
                {routes.map((item, i) => (
                  <MenuItem value={item.route_id} key={i}>
                    {item.route_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {routeIdErr && <p className="ml-2 text-red-500 text-xs">Select your Route</p>}
          </div>
          <div className="flex items-center gap-10">
            <p className="text-[#222] text-lg flex items-center gap-1 w-36">
              <span>
                <DirectionsBusIcon className="h-5" />
              </span>
              <span>Bus : </span>
            </p>
            <FormControl fullWidth>
              <InputLabel id="Bus">Select Bus</InputLabel>
              <Select
                labelId="Bus"
                id="demo-sple-select"
                label="Select Bus"
                value={addTripForm.busId}
                onChange={(e) => setAddTripForm({ ...addTripForm, busId: e.target.value })}
              >
                {buses.map((item, i) => (
                  <MenuItem value={item.bus_id} key={i}>
                    {item.bus_number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {busIdErr && <p className="ml-2 text-red-500 text-xs">Select your Bus</p>}
          </div>
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-5">
            <div className="flex items-center gap-5">
              <p className="text-[#222] text-lg flex items-center gap-1 w-56">
                <span>
                  <IconClock className="h-5" />
                </span>
                <span>Start Time :</span>
              </p>
              <FormControl fullWidth>
                <TextField
                  id="outlined-basic"
                  className="bg-white"
                  label="Start Time"
                  type="time"
                  value={addTripForm.startTime}
                  onChange={handleStartTimeInput}
                  format="HH:mm:ss"
                  inputProps={{
                    step: 1
                  }}
                />
              </FormControl>
              {startTimeErr && <p className="ml-2 text-red-500 text-xs">Enter Start Time </p>}
            </div>
            <div className="flex items-center gap-5">
              <p className="text-[#222] text-lg flex items-center gap-1 w-52">
                <span>
                  <IconClock className="h-5" />
                </span>
                <span>End Time : </span>
              </p>
              <FormControl fullWidth>
                <TextField
                  id="outlined-ba"
                  className="bg-white"
                  label="End Time"
                  type="time"
                  value={addTripForm.endTime}
                  onChange={handleEndTimeInput}
                  format="HH:mm:ss"
                  inputProps={{
                    step: 1
                  }}
                />
              </FormControl>
              {endTimeErr && <p className="ml-2 text-red-500 text-xs">Enter End time</p>}
            </div>
          </div>
          <div className=" flex gap-5 items-center mt-5">
            <div>
              <p className="text-xl text-[#222] flex gap-1 items-center">
                <IconCalendarMonth className="h-5" /> Select Running Days :
              </p>
            </div>
            <div className="flex gap-8 ">
              <>
                <div>
                  {!dayDis.fullweek ? (
                    <button
                      className={`p-2 border rounded-xl text-[rgba(68, 68, 68, 1)] flex gap-1 items-center ${
                        dayDis.selectDay ? ' text-gray-200 border-gray-200 ' : 'border-gray-500'
                      }`}
                      onClick={handleFullWeek}
                      disabled={dayDis.selectDay}
                    >
                      <CircleOutlinedIcon className="h-5" />
                      <span className="font-medium">Full Week</span>
                    </button>
                  ) : (
                    <button
                      className={`border border-[#49c401] bg-[#EDFAE6] rounded-xl p-2 flex gap-1 items-center font-medium ${
                        dayDis.selectDay && ' text-gray-200 border-gray-200 '
                      }`}
                      onClick={clearField}
                      disabled={dayDis.selectDay}
                    >
                      <RadioButtonCheckedOutlinedIcon className="text-[#49c401] h-5" />
                      <span className="font-medium">Full Week</span>
                    </button>
                  )}
                </div>
                <div>
                  {!dayDis.weekday ? (
                    <button
                      className={`p-2 border rounded-xl text-[rgba(68, 68, 68, 1)] flex gap-1 items-center ${
                        dayDis.selectDay ? ' text-gray-200 border-gray-200 ' : 'border-gray-500'
                      }`}
                      onClick={handleWeekDay}
                      disabled={dayDis.selectDay}
                    >
                      <CircleOutlinedIcon className="h-5" />
                      <span className="font-medium"> Week Days</span>
                    </button>
                  ) : (
                    <button
                      className={`border border-[#49c401] bg-[#EDFAE6] rounded-xl p-2 flex gap-1 items-center font-medium ${
                        dayDis.selectDay && ' text-gray-200 border-gray-200 '
                      }`}
                      onClick={clearField}
                      disabled={dayDis.selectDay}
                    >
                      <RadioButtonCheckedOutlinedIcon className="text-[#49c401] h-5" />
                      <span className="font-medium"> Week Days</span>
                    </button>
                  )}
                </div>
                <div>
                  <button
                    className={`border ${
                      dayDis.selectDay ? 'border-[#49c401]' : 'border-gray-500'
                    }  bg-[#EDFAE6] rounded-xl py-2 px-3 flex gap-1 items-center font-medium`}
                    onClick={() => handleSelectButton()}
                  >
                    Select Days
                  </button>
                </div>
              </>
            </div>

            {runningErr && <p className="ml-2 mt-2 text-sm text-red-500">Select Days</p>}
          </div>{' '}
          {dayDis.selectDay && (
            <div className="p-3 bg-gray-100">
              <div className="grid grid-cols-8 justify-center items-center w-full gap-3 max-md:grid-cols-4 max-sm:grid-cols-2">
                {!dayDis.sunday ? (
                  <button onClick={() => handleSelectedDays('sunday', '0')} className={`bg-white text-[#222] p-2 rounded-xl font-medium`}>
                    Sunday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('sunday', '0')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Sunday
                  </button>
                )}
                {!dayDis.monday ? (
                  <button onClick={() => handleSelectedDays('monday', '1')} className={`bg-white text-[#222] p-2 rounded-xl font-medium`}>
                    Monday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('monday', '1')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Monday
                  </button>
                )}

                {!dayDis.tuesday ? (
                  <button onClick={() => handleSelectedDays('tuesday', '2')} className={`bg-white text-[#222] p-2 rounded-xl font-medium`}>
                    Tuesday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('tuesday', '2')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Tuesday
                  </button>
                )}

                {!dayDis.wednesday ? (
                  <button
                    onClick={() => handleSelectedDays('wednesday', '3')}
                    className={`bg-white text-[#222] p-2 rounded-xl font-medium`}
                  >
                    Wednesday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('wednesday', '3')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Wednesday
                  </button>
                )}

                {!dayDis.thursday ? (
                  <button onClick={() => handleSelectedDays('thursday', '4')} className={`bg-white text-[#222] p-2 rounded-xl font-medium`}>
                    Thursday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('thursday', '4')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Thursday
                  </button>
                )}

                {!dayDis.friday ? (
                  <button onClick={() => handleSelectedDays('friday', '5')} className={`bg-white text-[#222] p-2 rounded-xl font-medium`}>
                    Friday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('friday', '5')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Friday
                  </button>
                )}
                {!dayDis.saturday ? (
                  <button onClick={() => handleSelectedDays('saturday', '6')} className={`bg-white text-[#222] p-2 rounded-xl font-medium`}>
                    Saturday
                  </button>
                ) : (
                  <button
                    onClick={() => deleteSelectedDays('saturday', '6')}
                    className={`bg-[#49c401] text-white p-2 rounded-xl font-medium`}
                  >
                    Saturday
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="flex gap-10 px-5">
            <button className="bg-[#49c401]  px-3 py-2 text-white font-medium rounded-lg" onClick={() => handleAddTrip()}>
              Add Trip
            </button>
            <button className="border border-red-500 text-red-500  px-3 py-2 font-medium rounded-lg" onClick={() => clearTrip()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
