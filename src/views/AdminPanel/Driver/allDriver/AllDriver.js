import { useState, useEffect } from 'react';
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
  Button,
  Pagination,
  Stack
} from '@mui/material';
import { IconX, IconPencil, IconAdjustmentsHorizontal } from '@tabler/icons-react';
// import FilterListIcon from '@mui/icons-material/FilterList';
import LoaderCircular from 'ui-component/LoaderCircular';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket';
import { driverbucket } from 'utils/AwsS3bucketName';

const columns = [
  { id: 'sr_no', label: 'S.R No.', align: 'center', minWidth: 80 },
  { id: 'driver_name', label: 'Driver Name', align: 'center', minWidth: 150 },
  {
    id: 'driver_address',
    label: 'Address',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'driver_phonenumber',
    label: 'Phone Number',
    minWidth: 130,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  { id: 'dlnumber', label: 'DL No', align: 'center', minWidth: 100 },
  {
    id: 'vendor_name',
    label: 'Vendor Name',
    minWidth: 150,
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

export const AllDriver = () => {
  const [driverData, setDriverData] = useState([]);
  let [filterData, setFilterData] = useState([]);
  const [IsActive, setIsActive] = useState(true);
  // update state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // filter state
  const [sDriverName, setSdriverName] = useState('');
  const [sDriverNo, setSdriverNo] = useState('');

  useEffect(() => {
    setRefreshPage(false);
    axios
      .get(`${BackendUrl}/app/v1/driver/getAllDriver`)
      .then((res) => {
        // console.log(res.data);
        setDriverData(res.data?.result);
      })
      .catch((e) => console.log('Api fail ', e));
  }, [refreshPage]);
  // console.log(driverData);
  // filter
  useEffect(() => {
    let res = driverData.filter((item) => item.activeStatus == IsActive);
    if (sDriverNo != '') {
      res = res?.filter((item) => String(item['primary_contact'])?.includes(String(sDriverNo).toLocaleLowerCase()));
    }
    if (sDriverName != '') {
      res = res?.filter((item) => item['driver_name']?.toLocaleLowerCase().includes(String(sDriverName).toLocaleLowerCase()));
    }
    setFilterData(res);
  }, [driverData, sDriverName, sDriverNo, IsActive]);

  // update error
  const [dlNoErr, setDlNoErr] = useState(false);
  const [driverNameErr, setDriverNameErr] = useState(false);
  const [primaryNoErr, setPrimaryNoErr] = useState(false);
  const [secondNoErr, setSecondNoErr] = useState(false);
  const [currAddressErr, setCurrAddressErr] = useState(false);
  const [prmtAddressErr, setPrmtAddressErr] = useState(false);
  const [imeiNoErr, setIMEINoErr] = useState(false);
  const [currAddressProofErr, setCurrAddressProofErr] = useState(false);
  const [prmtAddressProofErr, setPrmtAddressProofErr] = useState(false);
  const [aadharNoErr, setAdharNoErr] = useState(false);
  const [aadharFrontErr, setAdharFrontErr] = useState(false);
  const [aadharBackErr, setAdharBackErr] = useState(false);
  const [photoErr, setPhotoErr] = useState(false);
  const [pccErr, setPccErr] = useState(false);
  const [dlErr, setDlErr] = useState(false);
  const [resumeErr, setResumeErr] = useState(false);
  const [pccStartErr, setPccStartErr] = useState(false);
  const [pccEndErr, setPccEndErr] = useState(false);
  const [dlStartErr, setDlStartErr] = useState(false);
  const [dlEndErr, setDlEndErr] = useState(false);

  //update driver
  const updateDriver = () => {
    if (
      updateObj.driver_name != undefined &&
      updateObj.current_address != undefined &&
      updateObj.permanent_address != undefined &&
      updateObj.primary_contact.length == 10 &&
      updateObj.emergency_contact.length == 10 &&
      updateObj.adhaar_number != undefined &&
      updateObj.dl_number != undefined &&
      updateObj.imei_number != undefined &&
      updateObj.vendor_name != undefined &&
      updateObj.driver_document.dl != undefined &&
      updateObj.driver_document.pcc != undefined &&
      updateObj.driver_document.resume != undefined &&
      updateObj.driver_document.profile != undefined &&
      updateObj.driver_document.aadharBack != undefined &&
      updateObj.driver_document.aadharfront != undefined &&
      updateObj.driver_document.curr_address != undefined &&
      updateObj.driver_document.permanent_address != undefined
    ) {
      const document = {
        dl: updateObj.driver_document?.dl,
        pcc: updateObj.driver_document?.pcc,
        resume: updateObj.driver_document?.resume,
        profile: updateObj.driver_document?.profile,
        aadharBack: updateObj.driver_document?.aadharBack,
        aadharfront: updateObj.driver_document?.aadharfront,
        curr_address: updateObj.driver_document?.curr_address,
        permanent_address: updateObj.driver_document?.permanent_address
      };

      const body = {
        driverId: updateObj.driver_id,
        driverName: String(updateObj.driver_name).trim(),
        currentAddress: String(updateObj.current_address).trim(),
        permanentAddress: String(updateObj.permanent_address).trim(),
        primaryContact: updateObj.primary_contact,
        emergencyContact: updateObj.emergency_contact,
        adhaarNumber: updateObj.adhaar_number,
        dlNumber: updateObj.dl_number,
        imeiNumber: updateObj.imei_number,
        driverDocument: document,
        vendorId: updateObj.vendor_id,
        policeVerificationStart: updateObj.police_verification_start_india,
        policeVerificationEnd: updateObj.police_verification_end_india,
        drivingLicenseStart: updateObj.driving_license_start_india,
        drivingLicenseEnd: updateObj.driving_license_end_india,
        activeStatus: Boolean(updateObj.activeStatus)
      };
      console.log(body);

      axios
        .patch(`${BackendUrl}/app/v1/driver/updateDriver`, body)
        .then((res) => {
          console.log(res.data);
          if (res.data.isDriverUpdated) {
            window.alert(res.data.result);
            handleClose();
          } else {
            window.alert(res.data.result);
          }
          setRefreshPage(true);
        })
        .catch((err) => {
          console.log('Api Err ', err);
          window.alert('Api Error');
        });
    } else {
      updateObj.driver_name == undefined ? setDriverNameErr(true) : setDriverNameErr(false);
      updateObj.primary_contact.length != 10 || undefined ? setPrimaryNoErr(true) : setPrimaryNoErr(false);
      updateObj.emergency_contact.length != 10 || undefined ? setSecondNoErr(true) : setSecondNoErr(false);
      updateObj.current_address == undefined ? setCurrAddressErr(true) : setCurrAddressErr(false);
      updateObj.permanent_address == undefined ? setPrmtAddressErr(true) : setPrmtAddressErr(false);
      updateObj.driver_document.pcc == undefined ? setPccErr(true) : setPccErr(false);
      updateObj.driver_document.dl == undefined ? setDlErr(true) : setDlErr(false);
      updateObj.driver_document.resume == undefined ? setResumeErr(true) : setResumeErr(false);
      updateObj.driver_document.profile == undefined ? setPhotoErr(true) : setPhotoErr(false);
      updateObj.driver_document.aadharfront == undefined ? setAdharFrontErr(true) : setAdharFrontErr(false);
      updateObj.driver_document.aadharBack == undefined ? setAdharBackErr(true) : setAdharBackErr(false);
      updateObj.driver_document.curr_address == undefined ? setCurrAddressProofErr(true) : setCurrAddressProofErr(false);
      updateObj.driver_document.permanent_address == undefined ? setPrmtAddressProofErr(true) : setPrmtAddressProofErr(false);
      updateObj.adhaar_number == undefined ? setAdharNoErr(true) : setAdharNoErr(false);
      updateObj.dl_number == undefined ? setDlNoErr(true) : setDlNoErr(false);
      updateObj.imei_number == undefined ? setIMEINoErr(true) : setIMEINoErr(false);
      updateObj.driving_license_end_india == undefined ? setDlEndErr(true) : setDlEndErr(false);
      updateObj.driving_license_start_india == undefined ? setDlStartErr(true) : setDlStartErr(false);
      updateObj.police_verification_end_india == undefined ? setPccEndErr(true) : setPccEndErr(false);
      updateObj.police_verification_start_india == undefined ? setPccStartErr(true) : setPccStartErr(false);
    }
  };
  // console.log(updateObj);

  // modal open
  const handleOpen = (item) => {
    // console.log(item);
    setUpdateObj(item);
    setUpdateOpen(true);
  };
  // modal close
  const handleClose = () => {
    setUpdateOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -40%)',
    p: 4
  };
  // for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // const [itemsPerPage,setItemPerPAge]=useState(5);
  const totalPages = Math.ceil(filterData?.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // filterData=filterData.sort((a,b)=>b.activeStatus-a.activeStatus);
    return filterData?.slice(startIndex, endIndex);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  // S3BUCKET
  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, driverbucket);
    setUpdateObj({ ...updateObj, driver_document: { ...updateObj.driver_document, [name]: link } });
    setisLoading(false);
  };
  // const imageUploadApi = async (value) => {
  //   let result = await axios.request(value);
  //   // console.log(result.data.name);
  //   let imageName = result.data.name;
  //   return imageName;
  // };

  // const UploadDocumenttos3Bucket = async (e) => {
  //   // console.log(e.target.files[0]);
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
  //   // console.log(totalUrl);
  //   return totalUrl;
  // };
  return (
    <div>
      <div className=" flex flex-col gap-10 bg-white py-10 px-5 max-lg:p-4 max-lg:gap-5 rounded-xl relative">
        <div>
          <p className="text-3xl text-gray-600 text-center">All Driver Details</p>
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
        {/* dropdown */}
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
              <TextField label="Driver Name" className="" onChange={(e) => setSdriverName(e.target.value)} value={sDriverName} />
            </FormControl>

            <FormControl fullWidth>
              <TextField label="Driver Number" className="" onChange={(e) => setSdriverNo(e.target.value)} value={sDriverNo} />
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
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }} className="bg-gray-300">
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayItems()?.map((item, i) => {
                      return (
                        <TableRow key={i} className={`${item.activeStatus == 1 ? 'bg-green-300' : 'bg-red-300'}`}>
                          <TableCell className="font-medium">{i}</TableCell>
                          <TableCell className="font-medium">{item.driver_name}</TableCell>
                          <TableCell className="font-medium">{item.current_address}</TableCell>
                          <TableCell className="font-medium">{item.primary_contact}</TableCell>
                          <TableCell className="font-medium">{item.dl_number}</TableCell>
                          <TableCell className="font-medium">{item.vendor_name}</TableCell>
                          <TableCell>
                            <button className="p-2 text-lg text-blue-600" onClick={() => handleOpen(item)}>
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
            <div className="flex justify-center mt-2">
              <Stack spacing={2}>
                <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
              </Stack>{' '}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={updateOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="overflow-y-scroll mb-4"
      >
        <Box sx={style} className=" w-full h-screen  p-4 ">
          {isLoading && (
            <div>
              <LoaderCircular />
            </div>
          )}
          <div className=" max-lg:w-full flex flex-col gap-1 bg-white my-4 p-4 rounded-xl">
            <div className="flex justify-between pb-5">
              <p className="text-xl font-bold">Update Driver</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <>
              <div>
                <div className="grid grid-cols-4 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1 max-sm:gap-3 gap-10">
                  {/* driver ID*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField id="demo-simple-set" label="driverId" disabled={true} value={updateObj.driver_id} />
                    </FormControl>
                  </div>
                  {/* vendor ID*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField id="demo-simple-set" label="vendorID" disabled={true} value={updateObj.vendor_id} />
                    </FormControl>
                  </div>
                  {/* vendor name*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField id="demo-simple-set" label="Vendor name" disabled={true} value={updateObj.vendor_name} />
                    </FormControl>
                  </div>

                  {/* driver name */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="demo-simple-seect"
                        label="Name"
                        value={updateObj.driver_name}
                        onChange={(e) => setUpdateObj({ ...updateObj, driver_name: e.target.value })}
                      />
                    </FormControl>
                    {driverNameErr && <p className="text-red-500 ml-2 text-xs">driver Name error</p>}
                  </div>

                  {/* driver mobile */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="Primary contact"
                        variant="outlined"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        type="tel"
                        value={updateObj.primary_contact}
                        onChange={(e) => setUpdateObj({ ...updateObj, primary_contact: e.target.value })}
                      />
                      {primaryNoErr && <p className="text-red-500 ml-2 text-xs">mobile number error</p>}
                    </FormControl>
                  </div>
                  {/* emergency_contact */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basi"
                        label="Emergency Contact"
                        variant="outlined"
                        type="tel"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        value={updateObj.emergency_contact}
                        onChange={(e) => setUpdateObj({ ...updateObj, emergency_contact: e.target.value })}
                      />
                      {secondNoErr && <p className="text-red-500 ml-2 text-xs">emergency number error</p>}
                    </FormControl>
                  </div>
                  {/* current_address */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="current_address"
                        variant="outlined"
                        type="text"
                        value={updateObj.current_address}
                        onChange={(e) => setUpdateObj({ ...updateObj, current_address: e.target.value })}
                      />
                    </FormControl>
                    {currAddressErr && <p className="text-red-500 ml-2 text-xs">current_address Error</p>}
                  </div>

                  {/* permanent_address */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="permanent_address"
                        variant="outlined"
                        type="text"
                        value={updateObj.permanent_address}
                        onChange={(e) => setUpdateObj({ ...updateObj, permanent_address: e.target.value })}
                      />
                    </FormControl>
                    {prmtAddressErr && <p className="text-red-500 ml-2 text-xs">permanent_address Error</p>}
                  </div>

                  {/* adhaar_number */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="adhaar_number"
                        variant="outlined"
                        type="number"
                        value={updateObj.adhaar_number}
                        onChange={(e) => setUpdateObj({ ...updateObj, adhaar_number: e.target.value })}
                      />
                    </FormControl>
                    {aadharNoErr && <p className="text-red-500 ml-2 text-xs">adhaar_number Error</p>}
                  </div>
                  {/* dl_number */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="dl_number"
                        variant="outlined"
                        type="text"
                        value={updateObj.dl_number}
                        onChange={(e) => setUpdateObj({ ...updateObj, dl_number: e.target.value })}
                      />
                    </FormControl>
                    {dlNoErr && <p className="text-red-500 ml-2 text-xs">driving_number Error</p>}
                  </div>
                  {/* imei_number */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="imei_number"
                        variant="outlined"
                        type="number"
                        value={updateObj.imei_number}
                        onChange={(e) => setUpdateObj({ ...updateObj, imei_number: e.target.value })}
                      />
                    </FormControl>
                    {imeiNoErr && <p className="text-red-500 ml-2 text-xs">imei_number Error</p>}
                  </div>
                </div>{' '}
                <div className="grid grid-cols-2  gap-4 my-6">
                  <div className="w-full">
                    <p className="w-full border border-gray-400 rounded-xl px-2">
                      <label htmlFor="dlStart" className="text-md w-full block">
                        License start validity
                      </label>
                      <input
                        type="date"
                        className="outline-none border-none w-full"
                        id="dlStart"
                        value={updateObj.driving_license_start_india}
                        onChange={(e) => setUpdateObj({ ...updateObj, driving_license_start_india: e.target.value })}
                      />
                    </p>
                    {dlStartErr && <p className="text-red-500 ml-2">dl start error</p>}
                  </div>
                  {/* dl end time */}
                  <div className="w-full">
                    <p className="w-full border border-gray-400 rounded-xl px-2">
                      <label htmlFor="dlExpiry" className="text-md w-full block">
                        License Expiry validity
                      </label>
                      <input
                        type="date"
                        className="outline-none border-none w-full"
                        id="dlExpiry"
                        value={updateObj.driving_license_end_india}
                        onChange={(e) => setUpdateObj({ ...updateObj, driving_license_end_india: e.target.value })}
                      />
                    </p>
                    {dlEndErr && <p className="text-red-500  ml-2">Dl expiry error</p>}
                  </div>
                  <div>
                    <label htmlFor="pccStart" className="text-md w-full block">
                      pcc start
                    </label>
                    <p className="w-full border border-gray-400 rounded-xl px-2 py-3">
                      <input
                        type="date"
                        className="outline-none border-none w-full"
                        id="pccStart"
                        value={updateObj.police_verification_start_india}
                        onChange={(e) => setUpdateObj({ ...updateObj, police_verification_start_india: e.target.value })}
                      />
                    </p>
                    {pccStartErr && <p className="text-red-500  ml-2">PCC start error</p>}
                  </div>
                  <div>
                    <label htmlFor="pccEnd" className="text-md w-full block">
                      pcc end
                    </label>
                    <p className="w-full border border-gray-400 rounded-xl px-2 py-3">
                      <input
                        type="date"
                        className="outline-none border-none w-full"
                        id="pccEnd"
                        value={updateObj.police_verification_end_india}
                        onChange={(e) => setUpdateObj({ ...updateObj, police_verification_end_india: e.target.value })}
                      />
                    </p>
                    {pccEndErr && <p className="text-red-500  ml-2">PCC end error</p>}
                  </div>
                </div>
                <div className=" grid grid-cols-3 gap-6 mt-4 max-lg:grid-cols-2 max-lg:gap-4  max-md:grid-cols-1">
                  <div>
                    <p className="text-md font-semibold">Aadhar Front</p>
                    {updateObj?.driver_document?.aadharfront === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="aadharfront" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {aadharFrontErr && <p className="text-red-500 ml-2 text-xs">upload Aadhar Front</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj.driver_document?.aadharBack} target="_blank" rel="noreferrer">
                            <img src={updateObj?.driver_document?.aadharfront} alt="aadharfront" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                driver_document: { ...updateObj.driver_document, aadharfront: undefined }
                              })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-md font-semibold">Aadhar Back</p>
                    {updateObj?.driver_document?.aadharBack === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="aadharBack" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {aadharBackErr && <p className="text-red-500 ml-2 text-xs">upload aadharBack</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj.driver_document?.aadharBack} target="_blank" rel="noreferrer">
                            <img src={updateObj?.driver_document?.aadharBack} alt="aadharBack" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                driver_document: { ...updateObj.driver_document, aadharBack: undefined }
                              })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {' '}
                    <p className="text-md font-semibold">Resume</p>
                    {updateObj?.driver_document?.resume === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="resume" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {resumeErr && <p className="text-red-500 ml-2 text-xs">resume Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.driver_document?.resume} target="_blank" rel="noreferrer">
                            <img src={updateObj?.driver_document?.resume} alt="resume" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, driver_document: { ...updateObj.driver_document, resume: undefined } })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-md font-semibold">Profile</p>
                    {updateObj?.driver_document?.profile === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="profile" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {photoErr && <p className="text-red-500 ml-2 text-xs">profile Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.driver_document?.profile} target="_blank" rel="noreferrer">
                            <img src={updateObj?.driver_document?.profile} alt="profile" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, driver_document: { ...updateObj.driver_document, profile: undefined } })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {' '}
                    <p className="text-md font-semibold">Current Address</p>
                    {updateObj?.driver_document?.curr_address === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="curr_address" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {currAddressProofErr && <p className="text-red-500 ml-2 text-xs">curr_address Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.driver_document?.curr_address} target="_blank" rel="noreferrer">
                            <img src={updateObj?.driver_document?.curr_address} alt="cur_address" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                driver_document: { ...updateObj.driver_document, curr_address: undefined }
                              })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {' '}
                    <p className="text-md font-semibold">Permanent Address</p>
                    {updateObj?.driver_document?.permanent_address === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="permanent_address" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {prmtAddressProofErr && <p className="text-red-500 ml-2 text-xs">permanent_address Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.driver_document?.permanent_address} target="_blank" rel="noreferrer">
                            <img
                              src={updateObj?.driver_document?.permanent_address}
                              alt="permanent_address"
                              className="w-20 h-20 rounded-xl"
                            />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                driver_document: { ...updateObj.driver_document, permanent_address: undefined }
                              })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {' '}
                    <p className="text-md font-semibold">PCC</p>
                    {updateObj?.driver_document?.pcc === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="pcc" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {pccErr && <p className="text-red-500 ml-2 text-xs">PCC Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.driver_document?.pcc} target="_blank" rel="noreferrer">
                            {' '}
                            <img src={updateObj?.driver_document?.pcc} alt="pcc" className="w-20 h-20 rounded-xl" />
                          </a>{' '}
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, driver_document: { ...updateObj.driver_document, pcc: undefined } })
                            }
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-md font-semibold">Driver License</p>
                    {updateObj?.driver_document?.dl === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="dl" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {dlErr && <p className="text-red-500 ml-2 text-xs">DL Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.driver_document?.dl} target="_blank" rel="noreferrer">
                            <img src={updateObj?.driver_document?.dl} alt="dl" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() => setUpdateObj({ ...updateObj, driver_document: { ...updateObj.driver_document, dl: undefined } })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-lg flex items-center justify-center">
                    <label>
                      <input
                        type="checkbox"
                        className=""
                        checked={Boolean(updateObj.activeStatus)}
                        onChange={(e) => setUpdateObj({ ...updateObj, activeStatus: e.target.checked })}
                      />{' '}
                      {'  '}Active Status
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateDriver}>
                    update Driver
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
