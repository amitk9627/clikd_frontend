import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  TableRow,
  TextField,
  FormControl,
  Box,
  Modal,
  Stack,
  Pagination
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { IconX, IconAdjustmentsHorizontal, IconPencil } from '@tabler/icons-react';
import LoaderCircular from 'ui-component/LoaderCircular';
import axios from 'axios';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket';
import { conductorbucket } from 'utils/AwsS3bucketName';

const columns = [
  { id: 'conductor_name', label: 'Name', align: 'center', minWidth: 150 },
  {
    id: 'conductor_phonenumber',
    label: 'Phone Number',
    minWidth: 25,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'conductor_address',
    label: 'Address',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'vendor_name',
    label: 'vendor Name',
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
export const AllConductor = () => {
  const [conductorData, setConductorData] = useState([]);
  console.log(conductorData[0]);
  let [filterData, setFilterData] = useState([]);
  // update state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [IsActive, setIsActive] = useState(true);
  // for refresh the page
  const [refreshPage, setRefreshPage] = useState(false);
  // filter state
  const [sConductorName, setSconductorName] = useState('');
  const [sConductorNo, setSconductorNo] = useState('');

  useEffect(() => {
    setRefreshPage(false);
    axios
      .get(`${BackendUrl}/app/v1/conductor/getAllConductors`)
      .then((res) => setConductorData(res.data?.result))
      .catch((e) => console.log('Api fail ', e));
  }, [refreshPage]);

  // filter
  useEffect(() => {
    let res = conductorData.filter((item) => item.activeStatus == IsActive);
    if (sConductorNo != '') {
      res = res?.filter((item) => String(item['primary_contact'])?.includes(String(sConductorNo).toLocaleLowerCase()));
    }
    if (sConductorName != '') {
      res = res?.filter((item) => item['conductor_name']?.toLocaleLowerCase().includes(String(sConductorName).toLocaleLowerCase()));
    }
    setFilterData(res);
  }, [conductorData, sConductorName, sConductorNo, IsActive]);

  const [conductorNameErr, setConductorNameErr] = useState(false);
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
  const [resumeErr, setResumeErr] = useState(false);

  // handle document upload
  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    // console.log(event, field);
    setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, conductorbucket);
    setUpdateObj({ ...updateObj, conductor_document: { ...updateObj.conductor_document, [name]: link } });
    setisLoading(false);
  };

  // const imageUploadApi = async (value) => {
  //   let result = await axios.request(value);
  //   // console.log(result.data.name);
  //   let imageName = result.data.name;
  //   return imageName;
  // };

  // const UploadDocumenttos3Bucket = async (e) => {
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

  const updateConductor = () => {
    if (
      updateObj.conductor_name != '' &&
      updateObj.conductor_id != '' &&
      updateObj.current_address != '' &&
      updateObj.permanent_address != '' &&
      updateObj.primary_contact != '' &&
      updateObj.emergency_contact != '' &&
      updateObj.adhaar_number != '' &&
      updateObj.imei_number != '' &&
      updateObj.vendor_name != '' &&
      updateObj.vendor_id != '' &&
      updateObj.conductor_document?.pcc != '' &&
      updateObj.conductor_document?.resume != '' &&
      updateObj.conductor_document?.profile != '' &&
      updateObj.conductor_document?.aadharBack != '' &&
      updateObj.conductor_document?.aadharfront != '' &&
      updateObj.conductor_document?.curr_address != '' &&
      updateObj.conductor_document?.permanent_address != ''
    ) {
      if (updateObj.primary_contact == updateObj.emergency_contact) {
        window.alert('primary and emergency contact is same');
        return;
      }
      const document = {
        profile: updateObj.conductor_document?.profile,
        aadharfront: updateObj.conductor_document?.aadharfront,
        aadharBack: updateObj.conductor_document?.aadharBack,
        pcc: updateObj.conductor_document?.pcc,
        curr_address: updateObj.conductor_document?.curr_address,
        permanent_address: updateObj.conductor_document?.permanent_address,
        resume: updateObj.conductor_document?.resume
      };

      const body = {
        conductorId: updateObj.conductor_id,
        conductorName: String(updateObj.conductor_name).trim(),
        conductorMobile: updateObj.conductor_mobile,
        conductorDocument: document,
        vendorId: updateObj.vendor_id,
        activeStatus: Boolean(updateObj.activeStatus),
        currentAddress: String(updateObj.current_address).trim(),
        permanentAddress: String(updateObj.permanent_address).trim(),
        primaryContact: updateObj.primary_contact,
        emergencyContact: updateObj.emergency_contact,
        adhaarNumber: updateObj.adhaar_number,
        imeiNumber: updateObj.imei_number
      };

      console.log(body);
      axios
        .patch(`${BackendUrl}/app/v1/conductor/updateconductors`, body)
        .then((res) => {
          console.log(res.data);
          toast.success('update successfully');
          clearAllField();
        })
        .catch((err) => {
          console.log('Api Err ', err);
          toast.error('Api Error');
        });
    } else {
      updateObj.conductor_name == '' ? setConductorNameErr(true) : setConductorNameErr(false);
      updateObj.primary_contact == '' ? setPrimaryNoErr(true) : setPrimaryNoErr(false);
      updateObj.emergency_contact == '' ? setSecondNoErr(true) : setSecondNoErr(false);
      updateObj.current_address == '' ? setCurrAddressErr(true) : setCurrAddressErr(false);
      updateObj.permanent_address == '' ? setPrmtAddressErr(true) : setPrmtAddressErr(false);
      updateObj.adhaar_number == '' ? setAdharNoErr(true) : setAdharNoErr(false);
      updateObj.imei_number == '' ? setIMEINoErr(true) : setIMEINoErr(false);
      updateObj.conductor_document.pcc == '' ? setPccErr(true) : setPccErr(false);
      updateObj.conductor_document.resume == '' ? setResumeErr(true) : setResumeErr(false);
      updateObj.conductor_document.profile == '' ? setPhotoErr(true) : setPhotoErr(false);
      updateObj.conductor_document.aadharfront == '' ? setAdharFrontErr(true) : setAdharFrontErr(false);
      updateObj.conductor_document.aadharBack == '' ? setAdharBackErr(true) : setAdharBackErr(false);

      updateObj.conductor_document.curr_address == '' ? setCurrAddressProofErr(true) : setCurrAddressProofErr(false);

      updateObj.conductor_document.permanent_address == '' ? setPrmtAddressProofErr(true) : setPrmtAddressProofErr(false);
    }
    setRefreshPage(true);
  };
  const clearAllField = () => {
    setUpdateOpen(false);
  };
  //handle field

  // modal open
  const handleOpen = (item) => {
    setUpdateObj(item);
    // console.log(item);
    setUpdateOpen(true);
  };
  // modal close
  const handleClose = () => setUpdateOpen(false);

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -40%)',
    p: 4
  };
  // for pagination
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filterData?.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    filterData = filterData.sort((a, b) => b.activeStatus - a.activeStatus);
    return filterData.slice(startIndex, endIndex);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  // console.log(updateObj);

  return (
    <div>
      <div className=" flex flex-col bg-white py-10 px-5 gap-5 rounded-xl relative">
        <div>
          <p className="text-3xl text-gray-600 text-center">All Conductor Details</p>
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
              <TextField label="Conductor Name" className="" onChange={(e) => setSconductorName(e.target.value)} value={sConductorName} />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Conductor Number"
                inputProps={{ maxLength: 10, minLength: 10 }}
                className=""
                onChange={(e) => setSconductorNo(e.target.value)}
                value={sConductorNo}
              />
            </FormControl>
          </div>
        </div>
        {/*  */}
        <div>
          <div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead className="bg-gray-300">
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }} className="bg-gray-300 font-semibold uppercase">
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayItems()?.map((item, i) => {
                      return (
                        <TableRow key={i} className={`${item.activeStatus == 1 ? 'bg-green-300' : 'bg-red-300'}`}>
                          <TableCell className="font-medium uppercase">{item.conductor_name}</TableCell>
                          <TableCell className="font-medium uppercase">{item.primary_contact}</TableCell>
                          <TableCell className="font-medium uppercase">{item.current_address}</TableCell>
                          <TableCell className="font-medium uppercase">{item.vendor_name}</TableCell>
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
            <div className="flex  justify-center mt-3">
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
        className=""
      >
        <Box sx={style} className=" w-full h-screen p-4 overflow-y-scroll">
          <div>
            <Toaster />
          </div>
          {isLoading && (
            <div>
              <LoaderCircular />
            </div>
          )}
          <div className=" max-lg:w-full flex flex-col gap-1 bg-white my-4 p-4 rounded-xl">
            <div className="flex justify-between pb-5">
              <p className="text-xl font-bold">Update conductor</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <>
              <div>
                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1 max-sm:gap-3 gap-5">
                  {/* conductor ID*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField id="demo-simple-set" label="conductorId" disabled={true} value={updateObj.conductor_id} />
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

                  {/* conductor name */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="demo-simple-seect"
                        label="Name"
                        value={updateObj.conductor_name}
                        onChange={(e) => setUpdateObj({ ...updateObj, conductor_name: e.target.value })}
                      />
                    </FormControl>
                    {conductorNameErr && <p className="text-red-500 ml-2 text-xs">conductor Name error</p>}
                  </div>

                  {/* primary_contact */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basi"
                        label="Primary Contact"
                        variant="outlined"
                        type="tel"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        value={updateObj.primary_contact}
                        onChange={(e) => setUpdateObj({ ...updateObj, primary_contact: e.target.value })}
                      />
                      {primaryNoErr && <p className="text-red-500 ml-2 text-xs">primary number error</p>}
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
                <div className=" grid grid-cols-3 gap-6 mt-4 max-lg:grid-cols-2 max-lg:gap-4  max-md:grid-cols-1">
                  <div>
                    <p className="text-md font-semibold">Aadhar Front</p>
                    {updateObj?.conductor_document?.aadharfront === undefined ? (
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
                          <a href={updateObj.conductor_document?.aadharBack} target="_blank" rel="noreferrer">
                            <img src={updateObj?.conductor_document?.aadharfront} alt="aadharfront" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                conductor_document: { ...updateObj.conductor_document, aadharfront: undefined }
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
                    {updateObj?.conductor_document?.aadharBack === undefined ? (
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
                          <a href={updateObj.conductor_document?.aadharBack} target="_blank" rel="noreferrer">
                            <img src={updateObj?.conductor_document?.aadharBack} alt="aadharBack" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                conductor_document: { ...updateObj.conductor_document, aadharBack: undefined }
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
                    {updateObj?.conductor_document?.resume === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="resume" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {resumeErr && <p className="text-red-500 ml-2 text-xs">resume Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.conductor_document?.resume} target="_blank" rel="noreferrer">
                            <img src={updateObj?.conductor_document?.resume} alt="resume" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, conductor_document: { ...updateObj.conductor_document, resume: undefined } })
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
                    {updateObj?.conductor_document?.profile === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="profile" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {photoErr && <p className="text-red-500 ml-2 text-xs">profile Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.conductor_document?.profile} target="_blank" rel="noreferrer">
                            <img src={updateObj?.conductor_document?.profile} alt="profile" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, conductor_document: { ...updateObj.conductor_document, profile: undefined } })
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
                    {updateObj?.conductor_document?.curr_address === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="curr_address" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {currAddressProofErr && <p className="text-red-500 ml-2 text-xs">curr_address Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.conductor_document?.curr_address} target="_blank" rel="noreferrer">
                            <img src={updateObj?.conductor_document?.curr_address} alt="cur_address" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                conductor_document: { ...updateObj.conductor_document, curr_address: undefined }
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
                    {updateObj?.conductor_document?.permanent_address === undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="permanent_address" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {prmtAddressProofErr && <p className="text-red-500 ml-2 text-xs">permanent_address Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.conductor_document?.permanent_address} target="_blank" rel="noreferrer">
                            <img
                              src={updateObj?.conductor_document?.permanent_address}
                              alt="permanent_address"
                              className="w-20 h-20 rounded-xl"
                            />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                conductor_document: { ...updateObj.conductor_document, permanent_address: undefined }
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
                    {updateObj?.conductor_document?.pcc === undefined ? (
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
                          <a href={updateObj?.conductor_document?.pcc} target="_blank" rel="noreferrer">
                            {' '}
                            <img src={updateObj?.conductor_document?.pcc} alt="pcc" className="w-20 h-20 rounded-xl" />
                          </a>{' '}
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, conductor_document: { ...updateObj.conductor_document, pcc: undefined } })
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

                  <div className="text-lg flex items-center justify-center">
                    <label>
                      <input
                        type="checkbox"
                        className=""
                        checked={Boolean(updateObj.activeStatus)}
                        onChange={(e) => setUpdateObj({ ...updateObj, activeStatus: e.target.checked })}
                      />
                      <span className="ml-2">Active Status</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateConductor}>
                    Update Conductor
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
