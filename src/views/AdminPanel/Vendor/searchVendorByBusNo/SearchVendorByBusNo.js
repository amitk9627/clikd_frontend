import React, { useState } from 'react';
import {
  TextField,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Modal,
  Box,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IconX, IconPencil } from '@tabler/icons-react';
import LoaderCircular from 'ui-component/LoaderCircular';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket';
import { vendorbucket } from 'utils/AwsS3bucketName';
// email function for validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
export const SearchVendorByBusNo = () => {
  const [busNo, setBusNO] = useState('');
  const [found, setFound] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  // update state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [isLoading, setisLoading] = useState(false);
  // error state
  const [pancardErr, setPancardErr] = useState(false);
  const [adharErr, setAdharErr] = useState(false);
  const [accountNumberErr, setAccountNumberErr] = useState(false);
  const [holderNameErr, setHolderNameErr] = useState(false);
  const [ifscErr, setifscErr] = useState(false);
  const [vendorAddressErr, setVendorAddressErr] = useState(false);
  const [vendorEmailErr, setVendorEmailErr] = useState(false);
  const [vendorNameErr, setVendorNameErr] = useState(false);
  const [vendorMobileErr, setVendorMobileErr] = useState(false);
  const handleSearchBus = () => {
    if (busNo != '') {
      axios
        .get(`${BackendUrl}/app/v1/vendor/getVendorsByBusNo/${busNo}`)
        .then((res) => {
          if (res?.data?.vendorExists) {
            setVendorData(res.data.message[0]);
            console.log(res.data.message[0]);
            setFound(true);
            toast.success('Bus Found Successfully');
          } else {
            toast.error('User Not Found');
            setVendorData([]);
            setFound(false);
          }
        })
        .catch((e) => {
          console.log(e);
          setFound(false);
          toast.error('API issue');
        });
    }
  };
  // handle document upload
  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    // console.log(event, field);
    setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, vendorbucket);
    setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, [name]: link } });
    setisLoading(false);
  };
  // const imageUploadApi = async (value) => {
  //   let result = await axios.request(value);
  //   console.log(result.data.name);
  //   let imageName = result.data.name;
  //   return imageName;
  // };
  // // console.log(vendorForm);
  // const UploadDocumenttos3Bucket = async (e) => {
  //   console.log(e.target.files[0]);
  //   const reader = new FormData();
  //   reader.append('file', e.target.files[0]);
  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: `${BackendUrl}/app/v1/aws/upload/driverimages`,
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     data: reader
  //   };
  //   let imageName = await imageUploadApi(config);
  //   let totalUrl = `${BackendUrl}/app/v1/aws/getImage/driverimages/` + imageName;
  //   console.log(totalUrl);
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
      updateObj.accountNumber != '' &&
      updateObj.ifsc != '' &&
      updateObj.holderName != '' &&
      updateObj.vendorDocument?.aadhar != '' &&
      updateObj.vendorDocument?.pancard != ''
    ) {
      const document = {
        aadhar: updateObj.vendorDocument?.aadhar,
        pancard: updateObj.vendorDocument?.pancard
      };
      if (updateObj?.vendorDocument?.voterId != '') {
        document.voterId = updateObj.vendorDocument?.voterId;
      }
      const body = {
        vendorId: updateObj.vendorId,
        vendorName: updateObj.vendorName,
        vendorEmail: updateObj.vendorEmail,
        vendorMobile: updateObj.vendorMobile,
        vendorAddress: updateObj.vendorAddress,
        vendorDocuments: document,
        ifsc: updateObj.ifsc,
        holderName: updateObj.holderName,
        accountNumber: updateObj.accountNumber,
        activeStatus: Boolean(updateObj.activeStatus)
      };
      // console.log(body);
      axios
        .patch(`${BackendUrl}/app/v1/vendor/updateVendors`, body)
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
      updateObj.vendorName == '' ? setVendorNameErr(true) : setVendorNameErr(false);
      validateEmail(updateObj.vendorEmail) ? setVendorEmailErr(false) : setVendorEmailErr(true);
      updateObj.vendorMobile == '' ? setVendorMobileErr(true) : setVendorMobileErr(false);
      updateObj.accountNumber == '' ? setAccountNumberErr(true) : setAccountNumberErr(false);
      updateObj.vendorAddress == '' ? setVendorAddressErr(true) : setVendorAddressErr(false);
      updateObj.ifsc == '' ? setifscErr(true) : setifscErr(false);
      updateObj.holderName == '' ? setHolderNameErr(true) : setHolderNameErr(false);
      updateObj.vendorDocument?.aadhar == '' ? setAdharErr(true) : setAdharErr(false);
      updateObj.vendorDocument?.pancard == '' ? setPancardErr(true) : setPancardErr(false);
    }
  };
  const clearAllField = () => {
    setVendorNameErr(false);
    setVendorEmailErr(false);
    setVendorMobileErr(false);
    setAccountNumberErr(false);
    setVendorAddressErr(false);
    setifscErr(false);
    setHolderNameErr(false);
    setPancardErr(false);
    setAdharErr(false);
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
  const document = [];
  for (const ele in vendorData.vendorDocument) {
    document.push(ele);
  }

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <div className=" flex flex-col gap-10 bg-white p-4 rounded-xl">
        {/* heading */}
        <div>
          <p className="text-3xl text-gray-600 text-center">Search Vendor</p>
          <p className="border border-gray-300 mt-5"></p>
        </div>
        <div>
          <div>
            <div className="flex justify-center gap-1">
              <TextField
                id="outlined-basic"
                type="text"
                label="Bus Number"
                variant="outlined"
                className="grow-[4]"
                value={busNo}
                required
                onChange={(e) => setBusNO(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                className="bg-blue-700 grow"
                onClick={() => handleSearchBus()}
                disabled={busNo.length != '' ? false : true}
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          {found && (
            <>
              <TableContainer component={Paper}>
                <div className="flex justify-end">
                  <button className="text-center text-xl" onClick={() => handleOpen(vendorData)}>
                    {' '}
                    <IconPencil className="text-blue-600" />
                  </button>
                </div>
                <Table className="border-2 rounded-xl" aria-label="simple table">
                  <TableBody>
                    <TableRow hover>
                      <TableCell className="text-lg">Name</TableCell>
                      <TableCell className="text-lg">{vendorData.vendorName}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="">Email :</TableCell>
                      <TableCell className="text-lg">{vendorData.vendorEmail}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Mobile :</TableCell>
                      <TableCell className="text-lg">{vendorData.vendorMobile}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Address :</TableCell>
                      <TableCell className="text-lg">{vendorData.vendorAddress}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Document:</TableCell>
                      <TableCell className="text-lg">
                        {document.map((text, i) => (
                          <span key={i} className="capitalize">
                            {text}{' '}
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">IFSC code:</TableCell>
                      <TableCell className="text-lg">{vendorData.ifsc}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Holder Name :</TableCell>
                      <TableCell className="text-lg">{vendorData.holderName}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">bankDetailId</TableCell>
                      <TableCell className="text-lg">{vendorData.bankDetailId}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Account Number:</TableCell>
                      <TableCell className="text-lg">{vendorData.accountNumber}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
      </div>
      {/* update api */}
      <Modal open={updateOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style} className="w-full max-lg:h-screen max-lg:w-screen p-4 overflow-y-scroll">
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
              <p className="text-xl font-bold">Update Vendor</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <>
              <div>
                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-lg:gap-5 max-sm:grid-cols-1 max-sm:gap-3 gap-10">
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

                  {/* vendor address*/}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basi"
                        label="vendorAddress"
                        variant="outlined"
                        type="text"
                        value={updateObj.vendorAddress}
                        onChange={(e) => setUpdateObj({ ...updateObj, vendorAddress: e.target.value })}
                      />
                    </FormControl>
                    {vendorAddressErr && <p className="text-red-500 ml-2 text-xs">Address Error</p>}
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
                </div>{' '}
                <div className=" grid grid-cols-3 gap-6 mt-4 max-lg:grid-cols-2 max-lg:gap-4  max-md:grid-cols-1">
                  <div>
                    {updateObj?.vendorDocument?.aadhar == undefined ? (
                      <>
                        <InputLabel id="aadhar">Aadhar Card</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="aadhar" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {adharErr && <p className="text-red-500 ml-2 text-xs">upload Aadhar</p>}
                      </>
                    ) : (
                      <div>
                        <p className="text-md">Aadhar Card</p>
                        <div className="flex justify-between">
                          {' '}
                          <img src={updateObj?.vendorDocument?.aadhar} alt="aadhar" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, aadhar: '' } })}
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
                    {updateObj?.vendorDocument?.pancard == undefined ? (
                      <>
                        {/* onChange={(e) => handleDocumentPhoto(e)} */}
                        <InputLabel id="pancard">Pan Card</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="pancard" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                        {pancardErr && <p className="text-red-500 ml-2 text-xs">Pan Card Error</p>}
                      </>
                    ) : (
                      <div>
                        <p>Pan Card</p>
                        <div className="flex justify-between">
                          {' '}
                          <img src={updateObj?.vendorDocument?.pancard} alt="pancard" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, pancard: '' } })}
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
                    {updateObj?.vendorDocument?.voterId == undefined ? (
                      <>
                        {/*  */}
                        <InputLabel>Voter Id</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="voterId" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div>
                        <p>VoterId</p>
                        <div className="flex justify-between">
                          {' '}
                          <img src={updateObj?.vendorDocument?.voterId} alt="voterId" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setUpdateObj({ ...updateObj, vendorDocument: { ...updateObj.vendorDocument, voterId: '' } })}
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
                <div className="mt-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(updateObj.activeStatus)}
                      onChange={(e) => setUpdateObj({ ...updateObj, activeStatus: e.target.checked })}
                    />
                    Active Status
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateVendor}>
                    Update Vendor
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
