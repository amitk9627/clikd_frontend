import React, { useState, useEffect } from 'react';
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
  Pagination,
  Stack
} from '@mui/material';
import axios from 'axios';
// import FilterListIcon from '@mui/icons-material/FilterList';
import { IconX, IconPencil, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket';
import { vendorbucket } from 'utils/AwsS3bucketName';

const columns = [
  { id: 'vendorName', label: 'Name', align: 'center', minWidth: 150 },
  {
    id: 'vendorEmail',
    label: 'Email',
    minWidth: 100,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'vendorMobile',
    label: 'Mobile',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'vendorAddress',
    label: 'Address',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },

  {
    id: 'holderName',
    label: 'Holder Name',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'ifsc',
    label: 'IFSC code',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'accountNumber',
    label: 'Account Number',
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
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
export const AllVendor = () => {
  const [vendorData, setVendorData] = useState([]);
  const [loader, setLoader] = useState(false);
  let [filterData, setFilterData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [IsActive, setIsActive] = useState(true);
  // update state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  // filter State
  const [sVendorName, setSvendorName] = useState('');
  const [sVendorNo, setSvendorNo] = useState('');
  // update error state
  const [currAddressErr, setCurrAddressErr] = useState(false);
  const [prmtAddressErr, setPrmtAddressErr] = useState(false);
  const [currAddressProofErr, setCurrAddressProofErr] = useState(false);
  const [prmtAddressProofErr, setPrmtAddressProofErr] = useState(false);
  const [holderNameErr, setHolderNameErr] = useState(false);
  const [ifscErr, setIFSCErr] = useState(false);
  const [aadharFrontErr, setAdharFrontErr] = useState(false);
  const [aadharBackErr, setAdharBackErr] = useState(false);
  const [pancardErr, setPancardErr] = useState(false);
  const [photoErr, setPhotoErr] = useState(false);
  const [bankNameErr, setBankNameErr] = useState(false);
  const [bankDetailsErr, setBankDetailsErr] = useState(false);
  const [adharNoErr, setAdharNoErr] = useState(false);
  const [panNoErr, setPanNoErr] = useState(false);
  const [gstNoErr, setGstNoErr] = useState(false);
  const [gstImgErr, setGstImgErr] = useState(false);
  const [pccErr, setPccErr] = useState(false);
  const [vagreeErr, setvagreeErr] = useState(false);
  const [accountNumberErr, setAccountNumberErr] = useState(false);
  const [vendorEmailErr, setVendorEmailErr] = useState(false);
  const [vendorNameErr, setVendorNameErr] = useState(false);
  const [vendorMobileErr, setVendorMobileErr] = useState(false);
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/vendor/getAllVendors`)
      .then((res) => setVendorData(res?.data?.result))
      .catch((err) => console.log('Api Error ', err));
    setLoader(false);
  }, [loader]);
  // filter
  useEffect(() => {
    let res = vendorData.filter((item) => item.activeStatus == IsActive);
    if (sVendorName != '') {
      res = res?.filter((item) => item['vendorName']?.toLocaleLowerCase().includes(String(sVendorName).toLocaleLowerCase()));
      console.log(res);
    }
    if (sVendorNo != '') {
      res = res?.filter((item) => String(item['vendorMobile'])?.includes(String(sVendorNo).toLocaleLowerCase()));
      console.log(res);
    }
    setFilterData(res);
  }, [vendorData, sVendorName, sVendorNo, IsActive]);

  // handle document upload
  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    // console.log(event, field);
    //   setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, vendorbucket);
    setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, [name]: link } });
    //   setisLoading(false);
  };
  // const imageUploadApi = async (value) => {
  //   let result = await axios.request(value);
  //   console.log(result.data.name);
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
  //   setTitleImage(totalUrl);
  //   return totalUrl;
  // };

  //update vendor
  const updateVendor = () => {
    if (
      updateObj.vendorName != '' &&
      validateEmail(updateObj.vendorEmail) &&
      updateObj.vendorMobile?.length == 10 &&
      updateObj.vendorAddress != '' &&
      updateObj.currentAddress != '' &&
      updateObj.permanentAddress != '' &&
      updateObj.adhaarNumber != '' &&
      updateObj.panNumber != '' &&
      updateObj.gstNumber != '' &&
      updateObj.ifsc != '' &&
      updateObj.holderName != '' &&
      updateObj.accountNumber != '' &&
      updateObj.bankName != '' &&
      updateObj.vendorDocument?.pcc != '' &&
      updateObj.vendorDocument?.gstImg != '' &&
      updateObj.vendorDocument?.pancard != '' &&
      updateObj.vendorDocument?.profile != '' &&
      updateObj.vendorDocument?.aadharBack != '' &&
      updateObj.vendorDocument?.aadharFront != '' &&
      updateObj.vendorDocument?.bankDetails != '' &&
      updateObj.vendorDocument?.venderAggrement != '' &&
      updateObj.vendorDocument?.currentAddressProof != '' &&
      updateObj.vendorDocument?.parmanentAddressProof != ''
    ) {
      const document = {
        aadharFront: updateObj.vendorDocument?.aadharFront,
        aadharBack: updateObj.vendorDocument?.aadharBack,
        pancard: updateObj.vendorDocument?.pancard,
        gstImg: updateObj.vendorDocument.gstImg,
        pcc: updateObj.vendorDocument?.pcc,
        venderAggrement: updateObj.vendorDocument?.venderAggrement,
        bankDetails: updateObj.vendorDocument?.bankDetails,
        currentAddressProof: updateObj.vendorDocument?.currentAddressProof,
        parmanentAddressProof: updateObj.vendorDocument?.parmanentAddressProof,
        profile: updateObj.vendorDocument?.profile
      };

      const body = {
        vendorId: updateObj.vendorId,
        vendorName: String(updateObj.vendorName).trim(),
        vendorEmail: String(updateObj.vendorEmail).trim(),
        vendorMobile: String(updateObj.vendorMobile).trim(),
        currentAddress: String(updateObj.currentAddress).trim(),
        permanentAddress: String(updateObj.permanentAddress).trim(),
        vendorDocuments: document,
        ifsc: String(updateObj.ifsc).trim(),
        holderName: String(updateObj.holderName).trim(),
        accountNumber: updateObj.accountNumber,
        bankName: String(updateObj.bankName).trim(),
        activeStatus: Boolean(updateObj.activeStatus),
        adhaarNumber: updateObj.adhaarNumber,
        panNumber: updateObj.panNumber,
        gstNumber: updateObj.gstNumber
      };
      console.log(body);
      axios
        .patch(`${BackendUrl}/app/v1/vendor/updateVendors`, body)
        .then((res) => {
          window.alert(`${res.data.result}`);
          // console.log(res.data);
          setLoader(true);
          clearAllField();
        })
        .catch((err) => {
          console.log('Api Err ', err);
          toast.error('Api Error');
        });
    } else {
      updateObj.vendorName == '' ? setVendorNameErr(true) : setVendorNameErr(false);
      validateEmail(updateObj.vendorEmail) ? setVendorEmailErr(false) : setVendorEmailErr(true);
      updateObj.vendorMobile == '' ? setVendorMobileErr(true) : setVendorMobileErr(false);
      updateObj.accountNumber == '' ? setAccountNumberErr(true) : setAccountNumberErr(false);
      updateObj.ifsc == '' ? setIFSCErr(true) : setIFSCErr(false);
      updateObj.holderName == '' ? setHolderNameErr(true) : setHolderNameErr(false);
      updateObj.vendorDocument.pcc == '' ? setPccErr(true) : setPccErr(false);
      updateObj.vendorDocument.gstImg == '' ? setGstImgErr(true) : setGstImgErr(false);
      updateObj.vendorDocument.pancard == '' ? setPancardErr(true) : setPancardErr(false);
      updateObj.vendorDocument.profile == '' ? setPhotoErr(true) : setPhotoErr(false);
      updateObj.vendorDocument.aadharBack == '' ? setAdharBackErr(true) : setAdharBackErr(false);
      updateObj.vendorDocument.aadharFront == '' ? setAdharFrontErr(true) : setAdharFrontErr(false);
      updateObj.vendorDocument.bankDetails == '' ? setBankDetailsErr(true) : setBankDetailsErr(false);
      updateObj.vendorDocument.venderAggrement == '' ? setvagreeErr(true) : setvagreeErr(false);
      updateObj.vendorDocument.currentAddressProof == '' ? setCurrAddressProofErr(true) : setCurrAddressProofErr(false);
      updateObj.vendorDocument.parmanentAddressProof == '' ? setPrmtAddressProofErr(true) : setPrmtAddressProofErr(false);
      updateObj.currentAddress == '' ? setCurrAddressErr(true) : setCurrAddressErr(false);
      updateObj.permanentAddress == '' ? setPrmtAddressErr(true) : setPrmtAddressErr(false);
      updateObj.adhaarNumber == '' ? setAdharNoErr(true) : setAdharNoErr(false);
      updateObj.panNumber == '' ? setPanNoErr(true) : setPanNoErr(false);
      updateObj.gstNumber == '' ? setGstNoErr(true) : setGstNoErr(false);
      updateObj.bankName == '' ? setBankNameErr(true) : setBankNameErr(false);
    }
  };
  const clearAllField = () => {
    setLoader(false);
    setUpdateOpen(false);
    setVendorNameErr(false);
    setVendorEmailErr(false);
    setVendorMobileErr(false);
    setAccountNumberErr(false);
    setIFSCErr(false);
    setHolderNameErr(false);
    setPancardErr(false);
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4
  };
  //update
  const handleOpen = (item) => {
    setUpdateObj(item);
    // console.log(item);
    setUpdateOpen(true);
  };
  const handleClose = () => setUpdateOpen(false);
  // for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filterData.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // filterData = filterData.sort((a, b) => b.activeStatus - a.activeStatus);
    return filterData.slice(startIndex, endIndex);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <div className=" flex flex-col bg-white p-10 gap-5 rounded-xl relative">
        <div>
          <p className="text-3xl text-gray-600 text-center max-lg:text-xl">All Vendor Details</p>
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
              <TextField
                type="text"
                label="Vendor Name"
                className=""
                onChange={(e) => setSvendorName(e.target.value)}
                value={sVendorName}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField type="text" label="Vendor Number" className="" onChange={(e) => setSvendorNo(e.target.value)} value={sVendorNo} />
            </FormControl>
          </div>
        </div>
        {/* dropdown */}

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
                          <TableCell className="capitalize font-medium">{item.vendorName || 'NA'}</TableCell>
                          <TableCell className="font-medium">{item.vendorEmail || 'NA'}</TableCell>
                          <TableCell className="font-medium">{item.vendorMobile || 'NA'}</TableCell>
                          <TableCell className="uppercase font-medium">{item.currentAddress || 'NA'}</TableCell>
                          <TableCell className="font-medium uppercase">{item?.holderName || 'NA'}</TableCell>
                          <TableCell className="font-medium uppercase">{item.ifsc || 'NA'}</TableCell>
                          <TableCell className="font-medium">{item.accountNumber || 'NA'}</TableCell>
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
            {totalPages > 0 && (
              <div className="flex justify-center mt-2">
                <Stack spacing={2}>
                  <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
                </Stack>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* update api */}
      <Modal
        open={updateOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
      >
        <Box sx={style} className=" w-full h-full  p-4 overflow-hidden">
          <div>
            <Toaster />
          </div>
          <div className=" max-lg:w-full flex flex-col gap-1 bg-white p-4 rounded-xl ">
            <div className="flex justify-between pb-3">
              <p className="text-xl font-bold">Update Vendor</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <div className="overflow-y-scroll h-[480px] max-md:h-[640px] py-3">
              <div className="">
                <div className="grid grid-cols-4 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-3 gap-5">
                  {/* vendor ID*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField id="demo-simple-set" label="vendorId" disabled={true} value={updateObj.vendorId} />
                    </FormControl>
                  </div>

                  {/* vendor name */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="demo-simple-seect"
                        label="Name"
                        value={updateObj.vendorName}
                        onChange={(e) => setUpdateObj({ ...updateObj, vendorName: e.target.value })}
                      />
                    </FormControl>
                    {vendorNameErr && <p className="text-red-500 ml-2 text-xs">vendor Name error</p>}
                  </div>
                  {/* vendor email*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={updateObj.vendorEmail}
                        onChange={(e) => setUpdateObj({ ...updateObj, vendorEmail: e.target.value })}
                      />
                    </FormControl>
                    {vendorEmailErr && <p className="text-red-500 ml-2 text-xs">email error</p>}
                  </div>

                  {/* vendor mobile */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="Mobile"
                        variant="outlined"
                        type="tel"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        value={updateObj.vendorMobile}
                        onChange={(e) => setUpdateObj({ ...updateObj, vendorMobile: e.target.value })}
                      />
                      {vendorMobileErr && <p className="text-red-500 ml-2 text-xs">mobile number error</p>}
                    </FormControl>
                  </div>

                  {/* vendor current address*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="current Address"
                        variant="outlined"
                        type="text"
                        value={updateObj.currentAddress}
                        onChange={(e) => setUpdateObj({ ...updateObj, currentAddress: e.target.value })}
                      />
                    </FormControl>
                    {currAddressErr && <p className="text-red-500 ml-2 text-xs">Address Error</p>}
                  </div>

                  {/* vendor PERMANENT address*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="parmanent Address"
                        variant="outlined"
                        type="text"
                        value={updateObj.permanentAddress}
                        onChange={(e) => setUpdateObj({ ...updateObj, permanentAddress: e.target.value })}
                      />
                    </FormControl>
                    {prmtAddressErr && <p className="text-red-500 ml-2 text-xs">permanent Address Error</p>}
                  </div>
                  {/* Adhar card*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="Adhaar Number"
                        variant="outlined"
                        type="text"
                        value={updateObj.adhaarNumber}
                        onChange={(e) => setUpdateObj({ ...updateObj, adhaarNumber: e.target.value })}
                      />
                    </FormControl>
                    {adharNoErr && <p className="text-red-500 ml-2 text-xs">adhaarNumber Error</p>}
                  </div>
                  {/* Bank name*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="Bank Name"
                        variant="outlined"
                        type="text"
                        value={updateObj.bankName}
                        onChange={(e) => setUpdateObj({ ...updateObj, bankName: e.target.value })}
                      />
                    </FormControl>
                    {bankNameErr && <p className="text-red-500 ml-2 text-xs">bank name error</p>}
                  </div>
                  {/* IFSC code */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        label="IFSC code"
                        type="text"
                        value={updateObj.ifsc}
                        onChange={(e) => setUpdateObj({ ...updateObj, ifsc: e.target.value })}
                      />
                    </FormControl>
                    {ifscErr && <p className="text-red-500 ml-2 text-xs">IFSC Error</p>}
                  </div>

                  {/* holder name */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        id="outlind-basic"
                        label="Holder Name"
                        variant="outlined"
                        value={updateObj.holderName}
                        onChange={(e) => setUpdateObj({ ...updateObj, holderName: e.target.value })}
                      />
                    </FormControl>
                    {holderNameErr && <p className="text-red-500 ml-2 text-xs">Holder name err</p>}
                  </div>
                  {/* Account Number */}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        label="Account Number"
                        type="number"
                        value={updateObj.accountNumber}
                        onChange={(e) => setUpdateObj({ ...updateObj, accountNumber: e.target.value })}
                      />
                    </FormControl>
                    {accountNumberErr && <p className="text-red-500 ml-2 text-xs">Account Number Error</p>}
                  </div>
                  {/* vendor PERMANENT address*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="pan number"
                        variant="outlined"
                        type="text"
                        value={updateObj.panNumber}
                        onChange={(e) => setUpdateObj({ ...updateObj, panNumber: e.target.value })}
                      />
                    </FormControl>
                    {panNoErr && <p className="text-red-500 ml-2 text-xs">pan card Error</p>}
                  </div>
                  {/* gstNO*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="GST Number"
                        variant="outlined"
                        type="text"
                        value={updateObj.gstNumber}
                        onChange={(e) => setUpdateObj({ ...updateObj, gstNumber: e.target.value })}
                      />
                    </FormControl>
                    {gstNoErr && <p className="text-red-500 ml-2 text-xs">Gst number Error</p>}
                  </div>
                </div>{' '}
                <div className=" grid grid-cols-3 gap-6 mt-4 max-lg:grid-cols-2 max-lg:gap-4  max-md:grid-cols-1">
                  {/* Aadhar front */}
                  <div>
                    {' '}
                    <p className="text-md font-semibold">Aadhar front</p>
                    {updateObj?.vendorDocument?.aadharFront == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="aadharFront" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {aadharFrontErr && <p className="text-red-500 ml-2 text-xs">upload Aadhar front</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <a href={updateObj?.vendorDocument?.aadharFront} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.aadharFront} alt="aadharFront" className="w-20 h-20 rounded-xl" />
                          </a>{' '}
                          <Button
                            className=""
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, aadharFront: undefined } })
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
                  {/* Aadhar back */}
                  <div>
                    {' '}
                    <p className="text-md font-semibold">Aadhar Back</p>
                    {updateObj?.vendorDocument?.aadharBack == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="aadharBack" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {aadharBackErr && <p className="text-red-500 ml-2 text-xs">Adhar back Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.aadharBack} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.aadharBack} alt="aadharBack" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, aadharBack: undefined } })
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
                  {/* pancard */}
                  <div>
                    <p className="text-md font-semibold">Pan Card</p>
                    {updateObj?.vendorDocument?.pancard == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="pancard" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {pancardErr && <p className="text-red-500 ml-2 text-xs">Pan Card Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.pancard} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.pancard} alt="pancard" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, pancard: undefined } })
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

                  {/* gstImg */}
                  <div>
                    <p className="text-md font-semibold">GST document</p>
                    {updateObj?.vendorDocument?.gstImg == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="gstImg" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {gstImgErr && <p className="text-red-500 ml-2 text-xs">gstImg Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.gstImg} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.gstImg} alt="gstImg" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, gstImg: undefined } })
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

                  {/* pcc */}
                  <div>
                    <p className="text-md font-semibold">Pcc</p>
                    {updateObj?.vendorDocument?.pcc == undefined ? (
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
                          <a href={updateObj?.vendorDocument?.pcc} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.pcc} alt="pcc" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() => setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, pcc: undefined } })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* venderAggrement */}
                  <div>
                    <p className="text-md font-semibold">Vender Aggrement</p>
                    {updateObj?.vendorDocument?.venderAggrement == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="venderAggrement" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {vagreeErr && <p className="text-red-500 ml-2 text-xs">venderAggrement Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.venderAggrement} target="_blank" rel="noreferrer">
                            {' '}
                            <img src={updateObj?.vendorDocument?.venderAggrement} alt="venderAggrement" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, venderAggrement: undefined } })
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

                  {/* bankDetails */}
                  <div>
                    <p className="text-md font-semibold">Bank Details</p>
                    {updateObj?.vendorDocument?.bankDetails == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="bankDetails" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {bankDetailsErr && <p className="text-red-500 ml-2 text-xs">Pan Card Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.bankDetails} target="_blank" rel="noreferrer">
                            {' '}
                            <img src={updateObj?.vendorDocument?.bankDetails} alt="bankDetails" className="w-20 h-20 rounded-xl" />
                          </a>{' '}
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, bankDetails: undefined } })
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

                  {/* currentAddressProof */}
                  <div>
                    <p className="text-md font-semibold">Current Address Proof</p>
                    {updateObj?.vendorDocument?.currentAddressProof == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="currentAddressProof" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {currAddressProofErr && <p className="text-red-500 ml-2 text-xs">currentAddressProof Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.currentAddressProof} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.currentAddressProof} alt="pancard" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                vendorDocument: { ...updateObj.vendorDocument, currentAddressProof: undefined }
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
                  {/* parmanentAddressProof: */}
                  <div>
                    <p className="text-md font-semibold">Parmanent Address Proof</p>
                    {updateObj?.vendorDocument?.parmanentAddressProof == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="parmanentAddressProof" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {prmtAddressProofErr && <p className="text-red-500 ml-2 text-xs">parmanentAddressProof Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.parmanentAddressProof} target="_blank" rel="noreferrer">
                            <img
                              src={updateObj?.vendorDocument?.parmanentAddressProof}
                              alt="parmanentAddressProof"
                              className="w-20 h-20 rounded-xl"
                            />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({
                                ...updateObj,
                                vendorDocument: { ...updateObj.vendorDocument, parmanentAddressProof: undefined }
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
                  {/* profile: */}
                  <div>
                    <p className="text-md font-semibold">Profile</p>
                    {updateObj?.vendorDocument?.profile == undefined ? (
                      <>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="profile" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {photoErr && <p className="text-red-500 ml-2 text-xs">profile Error</p>}
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          {' '}
                          <a href={updateObj?.vendorDocument?.profile} target="_blank" rel="noreferrer">
                            <img src={updateObj?.vendorDocument?.profile} alt="profile" className="w-20 h-20 rounded-xl" />
                          </a>
                          <Button
                            onClick={() =>
                              setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, profile: undefined } })
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
                </div>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={Boolean(updateObj.activeStatus)}
                    id="status"
                    onChange={(e) => setUpdateObj({ ...updateObj, activeStatus: e.target.checked })}
                  />{' '}
                  <label htmlFor="status"> Active Status</label>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateVendor}>
                    update vendor
                  </Button>
                  <Button variant="outlined" color="error" onClick={clearAllField}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {/* update modal end */}
    </>
  );
};
