import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Select, FormControl, MenuItem, InputLabel, Button } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import Loader from 'ui-component/LoaderCircular';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket'; // s3 bucket function
import { vehiclebucket } from 'utils/AwsS3bucketName';
export const AddBus = () => {
  const [addBusForm, setAddBusForm] = useState({
    vendorId: '',
    busNo: '',
    capacity: '',
    driverId: '',
    category: '',
    conductorId: '',
    fuelType: '',
    tabletIMEI: '',
    femaleBus: false,
    makeDate: '',
    regDate: '',
    regEndDate: '',
    regCert: '',
    busAC: false,
    insuranceImg: '',
    pollutionImg: '',
    tourPermitImg: '',
    carriagePermitImg: '',
    fitnessImg: '',
    insuranceStart: '',
    pollutionStart: '',
    tourPermitStart: '',
    carriagePermitStart: '',
    fitnessStart: '',
    insuranceExpiry: '',
    pollutionExpiry: '',
    tourPermitExpiry: '',
    carriagePermitExpiry: '',
    fitnessExpiry: ''
  });
  const [vendorData, setVendorData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [conductorData, setConductorData] = useState([]);
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/vendor/getAllVendors`)
      .then((res) => setVendorData(res.data?.result))
      .catch((e) => console.log('Api fail Vendor', e));
    axios
      .get(`${BackendUrl}/app/v1/conductor/getAllConductors`)
      .then((res) => setConductorData(res.data?.result))
      .catch((e) => console.log('Api fail Conductor', e));
    axios
      .get(`${BackendUrl}/app/v1/busDriverMapping/getUnAssignDriver`)
      .then((res) => setDriverData(res.data?.result))
      .catch((e) => console.log('Api fail Driver', e));
  }, []);
  // error handling
  const [vendorIdErr, setVendorIdErr] = useState(false);
  const [busNoErr, setBusNoErr] = useState(false);
  const [capacityErr, setCapacityErr] = useState(false);
  const [driverIdErr, setDriverIdErr] = useState(false);
  const [categoryErr, setCategoryErr] = useState(false);
  const [conductorIdErr, setConductorIdErr] = useState(false);
  const [fuelTypeErr, setFuelTypeErr] = useState(false);
  const [tabletIMEIErr, setTabletIMEIErr] = useState(false);
  const [makeDateErr, setMakeDateErr] = useState(false);
  const [tourImgErr, setTourImgErr] = useState(false);
  const [regCertErr, setRegCertErr] = useState(false);
  const [insurImgErr, setInsurErr] = useState(false);
  const [pollutionImgErr, setPollutionImgErr] = useState(false);
  const [carriageImgErr, setCarriageImgErr] = useState(false);
  const [fitnessImgErr, setFitnessImgErr] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [regDateErr, setRegDateErr] = useState(false);
  const [tourdateErr, setTourdateErr] = useState(false);
  const [insurdateErr, setInsurdateErr] = useState(false);
  const [pollutiondateErr, setPollutiondateErr] = useState(false);
  const [carriagedateErr, setCarriagedateErr] = useState(false);
  const [fitnessdateErr, setFitnessdateErr] = useState(false);
  const [regStartDateErr, setRegStartDateErr] = useState(false);
  const [tourStartdateErr, setTourStartdateErr] = useState(false);
  const [insurStartdateErr, setInsurStartdateErr] = useState(false);
  const [pollutionStartdateErr, setPollutionStartdateErr] = useState(false);
  const [carriageStartdateErr, setCarriageStartdateErr] = useState(false);
  const [fitnessdateStartErr, setFitnessStartdateErr] = useState(false);

  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, vehiclebucket);
    setAddBusForm({ ...addBusForm, [name]: link });
    setisLoading(false);
  };
  // const imageUploadApi = async (value) => {
  //   let result = await axios.request(value);
  //   // console.log(result.data.name);
  //   let imageName = result.data.name;
  //   return imageName;
  // };
  // const UploadDocumenttos3Bucket = async (e) => {
  //   console.log(e.target.files[0]);
  //   const reader = new FormData();
  //   reader.append('file', e.target.files[0]);
  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: `${AwsBucketUrl}/app/v1/aws/upload/driverimages`,
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     data: reader
  //   };
  //   let imageName = await imageUploadApi(config);
  //   let totalUrl = `${AwsBucketUrl}/app/v1/aws/getImage/driverimages/` + imageName;
  //   return totalUrl;
  // };
  const handleBus = () => {
    if (
      addBusForm.vendorId != '' &&
      addBusForm.busNo != '' &&
      addBusForm.capacity != '' &&
      addBusForm.driverId != '' &&
      addBusForm.category != '' &&
      addBusForm.conductorId != '' &&
      addBusForm.fuelType != '' &&
      addBusForm.tabletIMEI != '' &&
      addBusForm.makeDate != '' &&
      addBusForm.regDate != '' &&
      addBusForm.regCert != '' &&
      addBusForm.insuranceImg != '' &&
      addBusForm.insuranceStart != '' &&
      addBusForm.insuranceExpiry != '' &&
      addBusForm.pollutionImg != '' &&
      addBusForm.pollutionExpiry != '' &&
      addBusForm.tourPermitImg != '' &&
      addBusForm.tourPermitExpiry != '' &&
      addBusForm.tourPermitStart != '' &&
      addBusForm.carriagePermitStart != '' &&
      addBusForm.carriagePermitExpiry != '' &&
      addBusForm.carriagePermitImg != '' &&
      addBusForm.pollutionStart != '' &&
      addBusForm.fitnessStart != '' &&
      addBusForm.fitnessImg != '' &&
      addBusForm.fitnessExpiry != '' &&
      addBusForm.regEndDate != ''
    ) {
      //  start and end date
      const document = {
        pollutionCert: addBusForm.pollutionImg,
        touriestPermitCert: addBusForm.tourPermitImg,
        fitnessCert: addBusForm.fitnessImg,
        carriagePermitCert: addBusForm.carriagePermitImg,
        insuranceCert: addBusForm.insuranceImg,
        regCert: addBusForm.regCert
      };
      const body = {
        vendorid: addBusForm.vendorId,
        busNumber: addBusForm.busNo.trim(),
        capacity: +addBusForm.capacity,
        driverid: +addBusForm.driverId,
        category: addBusForm.category.trim(),
        conductorid: addBusForm.conductorId,
        fueltype: addBusForm.fuelType.trim(),
        tabletimei: addBusForm.tabletIMEI,
        femalebus: addBusForm.femaleBus,
        busDocuments: document,
        makeDate: addBusForm.makeDate,
        registrationDate: addBusForm.regDate,
        isBusAC: addBusForm.busAC,
        insuranceStart: addBusForm.insuranceStart,
        insuranceEnd: addBusForm.insuranceExpiry,
        pollutionStart: addBusForm.pollutionStart,
        pollutionEnd: addBusForm.pollutionExpiry,
        touristPermitStart: addBusForm.tourPermitStart,
        touristPermitEnd: addBusForm.tourPermitExpiry,
        contractCarriageStart: addBusForm.carriagePermitStart,
        contractCarriageEnd: addBusForm.carriagePermitExpiry,
        fitnessCertificateStart: addBusForm.fitnessStart,
        fitnessCertificateEnd: addBusForm.fitnessExpiry,
        registrationEnd: addBusForm.regEndDate
      };
      console.log(body);
      axios
        .post(`${BackendUrl}/app/v1/bus/insertBus`, body, { headers: {} })
        .then((res) => {
          if (res.data.isBusAdded) {
            toast.success(res.data.result);
          } else {
            toast.error(res.data.result);
          }
          console.log(res.data);
        })
        .catch((e) => {
          console.log('api Failed ', e);
          toast.error('Error');
        });
      setBusNoErr(false);
      setVendorIdErr(false);
      setCapacityErr(false);
      setDriverIdErr(false);
      setCategoryErr(false);
      setConductorIdErr(false);
      setFuelTypeErr(false);
      setTabletIMEIErr(false);
    } else {
      addBusForm.tourPermitImg == '' ? setTourImgErr(true) : setTourImgErr(false);
      addBusForm.makeDate == '' ? setMakeDateErr(true) : setMakeDateErr(false);
      addBusForm.carriagePermitImg == '' ? setCarriageImgErr(true) : setCarriageImgErr(false);
      addBusForm.regDate == '' ? setRegDateErr(true) : setRegDateErr(false);
      addBusForm.fitnessImg == '' ? setFitnessImgErr(true) : setFitnessImgErr(false);
      addBusForm.regCert == '' ? setRegCertErr(true) : setRegCertErr(false);
      addBusForm.pollutionImg == '' ? setPollutionImgErr(true) : setPollutionImgErr(false);
      addBusForm.insuranceImg == '' ? setInsurErr(true) : setInsurErr(false);
      addBusForm.vendorId == '' ? setVendorIdErr(true) : setVendorIdErr(false);
      addBusForm.busNo == '' ? setBusNoErr(true) : setBusNoErr(false);
      addBusForm.capacity == '' ? setCapacityErr(true) : setCapacityErr(false);
      addBusForm.driverId == '' ? setDriverIdErr(true) : setDriverIdErr(false);
      addBusForm.category == '' ? setCategoryErr(true) : setCategoryErr(false);
      addBusForm.conductorId == '' ? setConductorIdErr(true) : setConductorIdErr(false);
      addBusForm.fuelType == '' ? setFuelTypeErr(true) : setFuelTypeErr(false);
      addBusForm.tabletIMEI == '' ? setTabletIMEIErr(true) : setTabletIMEIErr(false);
      addBusForm.insuranceExpiry == '' ? setInsurdateErr(true) : setInsurdateErr(false);
      addBusForm.pollutionExpiry == '' ? setPollutiondateErr(true) : setPollutiondateErr(false);
      addBusForm.tourPermitExpiry == '' ? setTourdateErr(true) : setTourdateErr(false);
      addBusForm.carriagePermitExpiry == '' ? setCarriagedateErr(true) : setCarriagedateErr(false);
      addBusForm.fitnessExpiry == '' ? setFitnessdateErr(true) : setFitnessdateErr(false);
      addBusForm.fitnessStart == '' ? setFitnessStartdateErr(true) : setFitnessStartdateErr(false);
      addBusForm.tourPermitStart == '' ? setTourStartdateErr(true) : setTourStartdateErr(false);
      addBusForm.carriagePermitStart == '' ? setCarriageStartdateErr(true) : setCarriageStartdateErr(false);
      addBusForm.pollutionStart == '' ? setPollutionStartdateErr(true) : setPollutionStartdateErr(false);
      addBusForm.regEndDate == '' ? setRegStartDateErr(true) : setRegStartDateErr(false);
      addBusForm.insuranceStart == '' ? setInsurStartdateErr(true) : setInsurStartdateErr(false);
      toast.error('input Field Error ');
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}

      <div className=" flex flex-col gap-10 max-md:gap-6 bg-white py-10 px-5 rounded-xl">
        {/* heading */}
        <div>
          <div>
            <p className="text-3xl text-gray-600 text-center">Add Bus</p>
          </div>
        </div>
        <div>
          <div className="">
            {/* Vendor Id */}
            <FormControl fullWidth>
              <InputLabel id="vendor_id">Vendor Id</InputLabel>
              <Select
                labelId="vendor_id"
                id="demo-simple-select"
                label="Vendor Id"
                value={addBusForm.vendorId}
                onChange={(e) => setAddBusForm({ ...addBusForm, vendorId: e.target.value })}
              >
                {vendorData.map((item, i) => (
                  <MenuItem key={i} value={item.vendorId}>
                    {item.vendorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {vendorIdErr && <p className="text-xs text-red-500 ml-2">vender error</p>}
          </div>
        </div>
        {/* form */}
        {addBusForm.vendorId && (
          <>
            <div>
              <div className="grid grid-cols-3 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1 max-sm:gap-3 gap-6">
                {/* bus no */}
                <div className="w-full">
                  <FormControl fullWidth>
                    <TextField
                      id="demo-simple-seect"
                      label="Bus No."
                      value={addBusForm.busNo}
                      onChange={(e) => setAddBusForm({ ...addBusForm, busNo: e.target.value })}
                    ></TextField>
                  </FormControl>
                  {busNoErr && <p className="text-xs text-red-500 ml-2">Bus No Error</p>}
                </div>

                {/* Bus Capacity */}
                <div className="w-full">
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      id="outlined-basi"
                      label="Capacity"
                      variant="outlined"
                      type="number"
                      value={addBusForm.capacity}
                      onChange={(e) => setAddBusForm({ ...addBusForm, capacity: e.target.value })}
                    />
                  </FormControl>
                  {capacityErr && <p className="text-xs text-red-500 ml-2">CapacityError</p>}
                </div>

                {/* select Driver Id*/}
                <div className="w-full">
                  <FormControl fullWidth>
                    <InputLabel id="driver_id">Driver Id</InputLabel>
                    <Select
                      labelId="driver_id"
                      id="demo-simpl-select"
                      label="Driver Id"
                      value={addBusForm.driverId}
                      onChange={(e) => setAddBusForm({ ...addBusForm, driverId: e.target.value })}
                    >
                      {driverData.map((item, i) => (
                        <MenuItem value={item.driver_id} key={i}>
                          {item.driver_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {driverIdErr && <p className="text-xs text-red-500 ml-2">Driver Id Error</p>}
                </div>

                {/* Conductor Id */}
                <div className="w-full">
                  <FormControl fullWidth>
                    <InputLabel id="conductor_id">Conductor Id</InputLabel>
                    <Select
                      labelId="conductor_id"
                      id="demo-smple-select"
                      value={addBusForm.conductorId}
                      label="Conductor Id"
                      onChange={(e) => setAddBusForm({ ...addBusForm, conductorId: e.target.value })}
                    >
                      {conductorData.map((item, i) => (
                        <MenuItem value={item.conductor_id} key={i}>
                          {item.conductor_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {conductorIdErr && <p className="text-xs text-red-500 ml-2">Conductor ID Error</p>}
                </div>
                {/* Category */}
                <div className="w-full">
                  <FormControl fullWidth>
                    <TextField
                      id="demo-simle-select"
                      label="Category"
                      value={addBusForm.category}
                      onChange={(e) => setAddBusForm({ ...addBusForm, category: e.target.value })}
                    />
                  </FormControl>
                  {categoryErr && <p className="text-xs text-red-500 ml-2">Category Error</p>}
                </div>

                {/* Fuel Type */}
                <div className="w-full">
                  <FormControl fullWidth>
                    <InputLabel id="fuel_type">Fuel Type</InputLabel>
                    <Select
                      labelId="fuel_type"
                      id="demo-imple-select"
                      label="Fuel Type"
                      value={addBusForm.fuelType}
                      onChange={(e) => setAddBusForm({ ...addBusForm, fuelType: e.target.value })}
                    >
                      <MenuItem value="Petrol">Petrol</MenuItem>
                      <MenuItem value="Diesel">Diesel</MenuItem>
                      <MenuItem value="CNG">CNG</MenuItem>
                      <MenuItem value="Electric">Electric</MenuItem>
                    </Select>
                  </FormControl>
                  {fuelTypeErr && <p className="text-xs text-red-500 ml-2">Fuel Type Error</p>}
                </div>

                {/* Passenger Type */}
                <div className="w-full">
                  <FormControl fullWidth>
                    <InputLabel id="Passenger_type">Female Bus</InputLabel>
                    <Select
                      labelId="Passenger_type"
                      id="demo-sple-select"
                      label="Female Bus"
                      value={addBusForm.femaleBus}
                      onChange={(e) => setAddBusForm({ ...addBusForm, femaleBus: e.target.value })}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      id="outlind-basic"
                      label="Tablet IMEI"
                      variant="outlined"
                      value={addBusForm.tabletIMEI}
                      onChange={(e) => setAddBusForm({ ...addBusForm, tabletIMEI: e.target.value })}
                    />
                  </FormControl>
                  {tabletIMEIErr && <p className="text-xs text-red-500 ml-2">Tablet Imei Error</p>}
                </div>
                <div className="w-full">
                  <FormControl fullWidth>
                    <InputLabel id="busAc">Bus AC/Non-Ac</InputLabel>
                    <Select
                      labelId="busAc"
                      id="demo-simpl-select"
                      label="Bus AC/Non-Ac"
                      value={addBusForm.busAC}
                      onChange={(e) => setAddBusForm({ ...addBusForm, busAC: e.target.value })}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* document */}
            <div>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xl text-gray-500">Document</p>
                </div>

                {/* insurance */}
                <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-lg:gap-6 max-md:gap-4">
                  <div className="w-full">
                    <InputLabel>Make Date</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-seect"
                        label=""
                        value={addBusForm.makeDate}
                        onChange={(e) => setAddBusForm({ ...addBusForm, makeDate: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {makeDateErr && <p className="text-xs text-red-500 ml-2">make Date Error</p>}
                  </div>
                  <div className="max-md:hidden"></div>
                  <div className="max-md:hidden"></div>
                  <div className="w-full">
                    {addBusForm.regCert == '' ? (
                      <>
                        <InputLabel className="capitalize">Registration Certificate</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="regCert" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={addBusForm.regCert} alt="regCert" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setAddBusForm({ ...addBusForm, regCert: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {regCertErr && <p className="text-xs text-red-500 ml-2">Bus reg cert Error</p>}
                  </div>
                  <div className="w-full">
                    <InputLabel>Reg Start Date</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.regDate}
                        onChange={(e) => setAddBusForm({ ...addBusForm, regDate: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {regDateErr && <p className="text-xs text-red-500 ml-2">Reg date Error</p>}
                  </div>
                  {/* bus reg end date */}
                  <div className="">
                    <InputLabel>Reg End Date</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.regEndDate}
                        onChange={(e) => setAddBusForm({ ...addBusForm, regEndDate: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {regStartDateErr && <p className="text-xs text-red-500 ml-2">Reg end date Error</p>}
                  </div>
                  <div>
                    {addBusForm.insuranceImg == '' ? (
                      <>
                        <InputLabel className="capitalize">Insurance Certificate</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="insuranceImg" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={addBusForm.insuranceImg} alt="insuranceImg" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setAddBusForm({ ...addBusForm, insuranceImg: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {insurImgErr && <p className="text-red-500 text-xs ml-2">insuranceImg error</p>}
                  </div>
                  {/* insurance start date */}
                  <div className="">
                    <InputLabel>Insurance Start</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.insuranceStart}
                        onChange={(e) => setAddBusForm({ ...addBusForm, insuranceStart: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {insurStartdateErr && <p className="text-xs text-red-500 ml-2">Insurance start Error</p>}
                  </div>
                  {/* insurance expiry */}
                  <div className="w-full">
                    <InputLabel>Insurance Expiry</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple"
                        label=""
                        value={addBusForm.insuranceExpiry}
                        onChange={(e) => setAddBusForm({ ...addBusForm, insuranceExpiry: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {insurdateErr && <p className="text-xs text-red-500 ml-2">insurance Error</p>}
                  </div>
                  <div>
                    {addBusForm.pollutionImg == '' ? (
                      <>
                        <InputLabel className="capitalize">Pollution Cert</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="pollutionImg" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={addBusForm.pollutionImg} alt="pollutionImg" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setAddBusForm({ ...addBusForm, pollutionImg: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {pollutionImgErr && <p className="text-red-500 text-xs ml-2">Pollution Img error</p>}
                  </div>
                  {/*  polution start  */}
                  <div className="">
                    <InputLabel>Pollution Start Date</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.pollutionStart}
                        onChange={(e) => setAddBusForm({ ...addBusForm, pollutionStart: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {pollutionStartdateErr && <p className="text-xs text-red-500 ml-2">Pollution Start Error</p>}
                  </div>
                  {/* pollution cert Expiry */}
                  <div className="w-full">
                    <InputLabel>Pollution Expiry</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-seect"
                        label=""
                        value={addBusForm.pollutionExpiry}
                        onChange={(e) => setAddBusForm({ ...addBusForm, pollutionExpiry: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {pollutiondateErr && <p className="text-xs text-red-500 ml-2">pollution Error</p>}
                  </div>
                  <div>
                    {addBusForm.tourPermitImg == '' ? (
                      <>
                        <InputLabel className="capitalize">Tourist Permit Cert</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="tourPermitImg" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={addBusForm.tourPermitImg} alt="tourPermitImg" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setAddBusForm({ ...addBusForm, tourPermitImg: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {tourImgErr && <p className="text-red-500 text-xs ml-2">tour PermitImg error</p>}
                  </div>
                  {/*  Tourpermit start  */}
                  <div className="">
                    <InputLabel>Tourist Permit Start</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.tourPermitStart}
                        onChange={(e) => setAddBusForm({ ...addBusForm, tourPermitStart: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {tourStartdateErr && <p className="text-xs text-red-500 ml-2">TourPermit start date Error</p>}
                  </div>
                  {/* TourPermit Expiry */}
                  <div className="w-full">
                    <InputLabel>Tourist Permit Expiry</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="d-simple-seect"
                        label=""
                        value={addBusForm.tourPermitExpiry}
                        onChange={(e) => setAddBusForm({ ...addBusForm, tourPermitExpiry: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {tourdateErr && <p className="text-xs text-red-500 ml-2">tourPermitExpiry Error</p>}
                  </div>
                  <div>
                    {addBusForm.carriagePermitImg == '' ? (
                      <>
                        <InputLabel className="capitalize">Carriage Permit Cert</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="carriagePermitImg" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={addBusForm.carriagePermitImg} alt="carriagePermitImg" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setAddBusForm({ ...addBusForm, carriagePermitImg: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {carriageImgErr && <p className="text-red-500 text-xs ml-2">carriagePermitImg error</p>}
                  </div>
                  {/*  carriage start  */}
                  <div className="">
                    <InputLabel>Carriage Start Date</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.carriagePermitStart}
                        onChange={(e) => setAddBusForm({ ...addBusForm, carriagePermitStart: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {carriageStartdateErr && <p className="text-xs text-red-500 ml-2">carriageStartdateErr date Error</p>}
                  </div>
                  {/* carriagePermit expiry */}
                  <div className="w-full">
                    <InputLabel>Carriage Permit expiry</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demle-seect"
                        label=""
                        value={addBusForm.carriagePermitExpiry}
                        onChange={(e) => setAddBusForm({ ...addBusForm, carriagePermitExpiry: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {carriagedateErr && <p className="text-xs text-red-500 ml-2">carriage Error</p>}
                  </div>
                  <div>
                    {addBusForm.fitnessImg == '' ? (
                      <>
                        <InputLabel className="capitalize">Fitness Cert</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="fitnessImg" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={addBusForm.fitnessImg} alt="fitnessImg" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setAddBusForm({ ...addBusForm, fitnessImg: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {fitnessImgErr && <p className="text-red-500 text-xs ml-2">Fitness Cert error</p>}
                  </div>
                  {/*  fitness start  */}
                  <div className="">
                    <InputLabel>Fitness Start Date</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simple-ct"
                        label=""
                        value={addBusForm.fitnessStart}
                        onChange={(e) => setAddBusForm({ ...addBusForm, fitnessStart: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {fitnessdateStartErr && <p className="text-xs text-red-500 ml-2">fitnessdateStartErr Error</p>}
                  </div>
                  {/* fitness expriry */}
                  <div className="w-full">
                    <InputLabel>Fitness Cert expiry</InputLabel>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        id="demo-simect"
                        label=""
                        value={addBusForm.fitnessExpiry}
                        onChange={(e) => setAddBusForm({ ...addBusForm, fitnessExpiry: e.target.value })}
                      ></TextField>
                    </FormControl>
                    {fitnessdateErr && <p className="text-xs text-red-500 ml-2">fitness Error</p>}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-10 justify-between">
                <Button className={'bg-[#49c401] text-white hover:bg-green-500'} onClick={handleBus}>
                  Add Bus
                </Button>
                <Button variant="outlined" color="error">
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
