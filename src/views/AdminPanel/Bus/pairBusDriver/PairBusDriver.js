import React, { useState, useEffect } from 'react';
import { Select, FormControl, InputLabel, MenuItem, Button, TextField } from '@mui/material';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import toast, { Toaster } from 'react-hot-toast';
import { IconBus, IconUser, IconPhone, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { DriverCard } from './DriverCard';
export const PairBusDriver = () => {
  const [buses, setBuses] = useState([]);
  const [assignedData, setAssignData] = useState({});
  const [busId, setBusId] = useState('');
  const [allUnAssignDriver, setAllUnAssignDriver] = useState([]);
  const [allAssignDriver, setAllAssignDriver] = useState([]);
  // const [allAssignUnassignedDriver, setAllAssignUnAssignDriver] = useState([]);
  // const [filterData, setFilterData] = useState([]);
  // const [filterValue, setFilterValue] = useState('');
  const [driverPhoneNo, setDriverPhoneNo] = useState('');
  // const [driverId, setDriverId] = useState(0);
  const [changeDriverBool, setChangeDriverBool] = useState(false);
  const [showDriver, setShowDriver] = useState({
    allDriver: true,
    assignDriver: true,
    unassignDriver: true
  });
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/bus/getAllBuses`)
      .then((res) => setBuses(res?.data?.buses))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (busId != '') {
      axios
        .post(`${BackendUrl}/app/v1/bus/getBusByBusId`, { busId: busId })
        .then((res) => {
          // console.log(res?.data.result[0]);
          setAssignData(res?.data.result[0]);
        })
        .catch((e) => console.log(e));
      axios
        .get(`${BackendUrl}/app/v1/busDriverMapping/getUnAssignAndAssignDriver`)
        .then((res) => {
          // setAllAssignUnAssignDriver(res.data.driverData);

          setAllUnAssignDriver(res.data?.unAssignDriver);
          setAllAssignDriver(res.data?.AssignDriver);
        })
        .catch((e) => console.log(e));
    }
  }, [busId]);
  // filter
  // useEffect(() => {
  //   let res;
  //   if (filterValue == 1) {
  //     if (driverPhoneNo.length > 1) {
  //       res = allAssignUnassignedDriver.filter(
  //         (item) => item.pairStatus == filterValue && String(item.primary_contact).includes(driverPhoneNo)
  //       );
  //     } else {
  //       res = allAssignUnassignedDriver.filter((item) => item.pairStatus == filterValue);
  //     }
  //     console.log(res);
  //     setFilterData(res);
  //   } else if (filterValue == 0) {
  //     if (driverPhoneNo.length > 1) {
  //       res = allAssignUnassignedDriver.filter(
  //         (item) => item.pairStatus == filterValue && String(item.primary_contact).includes(driverPhoneNo)
  //       );
  //     } else {
  //       res = allAssignUnassignedDriver.filter((item) => item.pairStatus == filterValue);
  //     }
  //     console.log(res);
  //     setFilterData(res);
  //   } else if (filterValue == 2) {
  //     if (driverPhoneNo.length > 1) {
  //       res = allAssignUnassignedDriver.filter((item) => String(item.primary_contact).includes(driverPhoneNo));
  //     } else {
  //       res = allAssignUnassignedDriver;
  //     }
  //     console.log(res);
  //     setFilterData(res);
  //   }
  // }, [allAssignUnassignedDriver, filterValue, driverPhoneNo]);

  // console.log(allAssignUnassignedDriver);
  const handleAssignNewDriver = (driverid) => {
    if (driverid != 0) {
      axios
        .post(`${BackendUrl}/app/v1/busDriverMapping/mappingBusDriver`, {
          busId: busId,
          driverId: driverid
        })
        .then((res) => {
          window.alert(res.data.result);
          console.log(res.data);
          if (res.data.isNeedReassignBus) {
            setBusId(res.data.isNeedReassignBusId);
          } else {
            setBusId('');
            setChangeDriverBool(false);
          }
          setShowDriver({
            allDriver: true,
            assignDriver: true,
            unassignDriver: true
          });
        })
        .catch((err) => {
          toast.error('API Error');
          console.log(err);
        });
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="bg-white rounded-xl w-full h-full p-10">
        <div className=" flex flex-col gap-5 bg-white   max-lg:p-2 max-lg:gap-5 rounded-xl">
          <div>
            <p className="text-3xl text-gray-600 text-center">Pair Bus Driver</p>
          </div>
          {/* tab button */}

          <div className="p-5">
            <div className="grid grid-cols-2 max-md:grid-cols-1 mb-5 ">
              <div>
                <div>
                  <h1 className="text-2xl font-semibold mb-4 text-[#222]">Assign new bus driver</h1>
                </div>
                <div className="flex items-center gap-4">
                  {/* Bus ID */}
                  <InputLabel className="text-xl">Select Bus : </InputLabel>
                  <FormControl className="w-72">
                    <InputLabel id="demo-simple-select-label">Bus Name</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Bus Name"
                      value={busId}
                      onChange={(e) => setBusId(e.target.value)}
                    >
                      {buses?.map((item) => {
                        return (
                          <MenuItem value={item.bus_id} key={item.bus_id}>
                            {item.bus_number}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>{' '}
              </div>

              <div className=" w-full">
                <div className="bg-[#cecece] rounded-xl p-6 flex flex-col gap-4 pb-10">
                  <h1 className="font-medium text-2xl max-lg:text-sm">Existing Bus & Driver Details</h1>
                  {assignedData.bus_number != null && busId != '' ? (
                    <div className={`p-4 w-80 rounded-lg bg-white flex flex-col gap-2 shadow-xl`}>
                      <p className="flex gap-10 items-center">
                        <span className="text-[#777] flex  w-32">
                          <IconBus className="h-4" />
                          Bus No.
                        </span>
                        -<span className="font-semibold">{assignedData.bus_number}</span>
                      </p>
                      <p className="flex gap-10 items-center">
                        <span className="text-[#777] flex  items-center w-32">
                          <IconUser className="h-4" />
                          Driver name
                        </span>
                        -<span className="font-semibold">{assignedData.driver_name == null ? '--------' : assignedData.driver_name}</span>
                      </p>
                      <p className="flex gap-10 items-center">
                        <span className="text-[#777] flex  w-32">
                          <IconPhone className="h-4" />
                          Driver Contact
                        </span>
                        -
                        <span className="font-semibold">
                          {assignedData.driverContact == null ? '--------' : assignedData.driverContact}
                        </span>
                      </p>

                      <button onClick={() => setChangeDriverBool(true)} className="bg-[#49c401] text-white text-lg rounded-xl w-full p-1">
                        Change Driver
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[#777]">Select the bus first</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {changeDriverBool && (
              <>
                <div className="mb-5">
                  <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold mb-4">Select Driver</h1>
                    {/* <div>
                      <input
                        type="tel"
                        value={driverPhoneNo}
                        onChange={(e) => setDriverPhoneNo(e.target.value)}
                        className="text-lg px-2 py-1 border border-gray-400 outline-none rounded-md"
                        placeholder="Search by Phone No."
                      />
                    </div> */}
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-5">
                        <span className="">
                          <IconAdjustmentsHorizontal />
                        </span>
                        <button
                          className={`p-1 px-2 border border-gray-400 rounded-lg ${
                            showDriver.allDriver && showDriver.assignDriver && showDriver.unassignDriver
                              ? 'bg-[#49c401] text-white font-medium'
                              : ''
                          }`}
                          onClick={() => {
                            setShowDriver({ ...showDriver, allDriver: true, assignDriver: true, unassignDriver: true });
                            // setFilterValue(2);
                          }}
                        >
                          All
                        </button>
                        <button
                          className={`p-1 border border-gray-400 rounded-lg px-2  ${
                            showDriver.allDriver && showDriver.assignDriver && !showDriver.unassignDriver
                              ? 'bg-[#49c401] text-white font-medium'
                              : ''
                          }`}
                          onClick={() => {
                            setShowDriver({ ...showDriver, allDriver: true, assignDriver: true, unassignDriver: false });
                            // setFilterValue(1);
                          }}
                        >
                          Assigned Drivers
                        </button>
                        <button
                          className={`p-1 border border-gray-400 rounded-lg px-2  ${
                            showDriver.allDriver && !showDriver.assignDriver && showDriver.unassignDriver
                              ? 'bg-[#49c401] text-white font-medium'
                              : ''
                          }`}
                          onClick={() => {
                            setShowDriver({ ...showDriver, allDriver: true, assignDriver: false, unassignDriver: true });
                            // setFilterValue(0);
                          }}
                        >
                          Unassigned Drivers
                        </button>
                      </div>
                      <div>
                        <p className="rounded-lg border border-gray-200 p-1 px-2 text-gray-400 flex gap-3 justify-center items-center">
                          <span className="text-[#777]">Bus No.</span> :{' '}
                          <span className="p-1 rounded-lg bg-[#49c401] text-lg text-white">{assignedData.bus_number}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/*  */}
                {/* <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-2">
                  <>
                    {filterData.map((item, i) => (
                      <div key={i} className={`${assignedData.driver_id == item.driver_id && 'hidden'}`}>
                        {assignedData.driver_id != item.driver_id && (
                          <div
                            key={i}
                            className="rounded-lg border border-gray-600 hover:border-[#49c401] p-4 max-md:p-2 flex flex-col gap-3 w-64"
                          >
                            <DriverCard item={item} />
                            <button
                              className="w-full p-2 text-[14px] text-white bg-[#49c401] rounded-lg tracking-widest shadow-lg"
                              onClick={() => handleAssignNewDriver(item.driver_id)}
                            >
                              Assign Driver
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                </div> */}
                {/*  */}
                <>
                  <div className="grid grid-cols-3 gap-10">
                    {/* unAssign Driver */}
                    {allUnAssignDriver.length > 0 && (
                      <>
                        {showDriver.allDriver && showDriver.unassignDriver && (
                          <>
                            {allUnAssignDriver.map((item, i) => (
                              <div
                                key={i}
                                className="rounded-lg border border-gray-600 hover:border-[#49c401] p-4 max-md:p-2 flex flex-col gap-3 w-64"
                              >
                                <DriverCard item={item} />
                                <button
                                  className="w-full p-2 text-[14px] text-white bg-[#49c401] rounded-lg tracking-widest shadow-lg"
                                  onClick={() => handleAssignNewDriver(item.driver_id)}
                                >
                                  Assign Driver
                                </button>
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    )}
                    {/* AllAssign Driver */}
                    {allAssignDriver.length > 0 && (
                      <>
                        {showDriver.allDriver && showDriver.assignDriver && (
                          <>
                            {allAssignDriver.map((item, i) => (
                              <div key={i} className={`${assignedData.driver_id == item.driver_id && 'hidden'}`}>
                                {assignedData.driver_id != item.driver_id && (
                                  <div
                                    key={i}
                                    className="rounded-lg border border-gray-600 hover:border-[#49c401] p-4 max-md:p-2 flex flex-col gap-3 w-64"
                                  >
                                    <DriverCard item={item} />
                                    <button
                                      className="w-full p-2 text-[14px] text-white bg-[#49c401] rounded-lg tracking-widest shadow-lg"
                                      onClick={() => handleAssignNewDriver(item.driver_id)}
                                    >
                                      Assign Driver
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
