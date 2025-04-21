import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Loader from 'ui-component/Loadable';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket';
import {driverbucket} from 'utils/AwsS3bucketName'


export const AddDriver = () => {
  const [driverForm, setDriverForm] = useState({
    drName: '',
    drmobile: '',
    vendorId: '',
    drAadharNO: '',
    drAadharFront: '',
    drAadharBack: '',
    drPhoto: '',
    drAlternatemobile: '',
    currAddress: '',
    currAddressProof: '',
    prmtAddress: '',
    prmtAddressProof: '',
    IMEI_No: '',
    drResume: '',
    drLicenseNo: '',
    dlImg: '',
    dlExpiry: '',
    dlStart: '',
    police_verification: '',
    pccEnd: '',
    pccStart: ''
  });
  //  console.log(driverForm);
  const [vendorData, setVendorData] = useState([]);
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/vendor/getAllVendors`)
      .then((res) => setVendorData(res.data?.result))
      .catch((err) => console.log(err));
  }, []);
  const [drNameErr, setDrNameErr] = useState(false);
  const [drmobileErr, setDrMobileErr] = useState(false);
  const [drAltMobileErr, setDrAltMobileErr] = useState(false);
  const [drIMEIErr, setDrIMEIErr] = useState(false);
  const [drProfileErr, setDrProfileErr] = useState(false);
  const [drAdharNoErr, setDrAdharNoErr] = useState(false);
  const [drAdharFrontErr, setDrAdharFrontErr] = useState(false);
  const [drPccEndErr, setDrPccEndErr] = useState(false);
  const [drAdharBackErr, setDrAdharBackErr] = useState(false);
  const [currAddressErr, setCurrAddressErr] = useState(false);
  const [currAddressProofErr, setCurrAddressProofErr] = useState(false);
  const [prmtAddressErr, setPrmtAddressErr] = useState(false);
  const [prmtAddressProofErr, setPrmtAddressProofErr] = useState(false);
  const [pccVerifyErr, setPccVerifyErr] = useState(false);
  const [resumeErr, setResumeErr] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [drLicenseNoErr, setDrLicenseNoErr] = useState(false);
  const [drLicenseImgErr, setDrLicenseImgErr] = useState(false);
  const [drLicenseExpiryErr, setDrLicenseExpiryErr] = useState(false);
  const [drLicenseStartErr, setDrLicenseStartErr] = useState(false);
  //  handle image upload
  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, driverbucket);
    setDriverForm({ ...driverForm, [name]: link });
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
  const handleDriver = () => {
    if (
      driverForm.drName != '' &&
      driverForm.drmobile != '' &&
      driverForm.vendorId != '' &&
      driverForm.drAadharNO != '' &&
      driverForm.drAadharFront != '' &&
      driverForm.drAadharBack != '' &&
      driverForm.drPhoto != '' &&
      driverForm.drAlternatemobile != '' &&
      driverForm.currAddress != '' &&
      driverForm.currAddressProof != '' &&
      driverForm.prmtAddress != '' &&
      driverForm.prmtAddressProof != '' &&
      driverForm.police_verification != '' &&
      driverForm.IMEI_No != '' &&
      driverForm.drResume != '' &&
      driverForm.drLicenseNo != '' &&
      driverForm.dlImg != '' &&
      driverForm.dlExpiry != '' &&
      driverForm.pccStart != '' &&
      driverForm.pccEnd != '' &&
      driverForm.dlStart != ''
    ) {
      if (driverForm.drmobile == driverForm.drAlternatemobile) {
        window.alert('modile number and Alternate mobile number same');
        return;
      }
      const document = {
        profile: driverForm.drPhoto,
        aadharfront: driverForm.drAadharFront,
        aadharBack: driverForm.drAadharBack,
        dl: driverForm.dlImg,
        pcc: driverForm.police_verification,
        curr_address: driverForm.currAddressProof,
        permanent_address: driverForm.prmtAddressProof,
        resume: driverForm.drResume
      };

      const body = {
        driverName: String(driverForm.drName).trim(),
        currentAddress:String(driverForm.currAddress).trim(),
        permanentAddress: String(driverForm.prmtAddress).trim(),
        primaryContact: driverForm.drmobile,
        emergencyContact: driverForm.drAlternatemobile,
        adhaarNumber: driverForm.drAadharNO,
        dlNumber: driverForm.drLicenseNo,
        imeiNumber: driverForm.IMEI_No,
        driverDocument: document,
        vendorId: driverForm.vendorId,
        policeVerificationStart: driverForm.pccStart,
        policeVerificationEnd: driverForm.pccEnd,
        drivingLicenseStart: driverForm.dlStart,
        drivingLicenseEnd: driverForm.dlExpiry,
        rating: 5
      };
      // console.log(body);
      axios
        .post(`${BackendUrl}/app/v1/driver/createDriver`, body)
        .then((res) => {
          toast.success(res.data.result || 'Driver Added SuccessFully');
          console.log(res);
        })
        .catch((err) => {
          console.log('Api error ', err);
          toast.error('Error');
        });
      setDrNameErr(false);
      setDrMobileErr(false);
    } else {
      driverForm.drName == '' ? setDrNameErr(true) : setDrNameErr(false);
      driverForm.drmobile == '' ? setDrMobileErr(true) : setDrMobileErr(false);
      driverForm.IMEI_No == '' ? setDrIMEIErr(true) : setDrIMEIErr(false);
      driverForm.drLicenseNo == '' ? setDrLicenseNoErr(true) : setDrLicenseNoErr(false);
      driverForm.dlImg == '' ? setDrLicenseImgErr(true) : setDrLicenseImgErr(false);

      driverForm.drAlternatemobile == '' ? setDrAltMobileErr(true) : setDrAltMobileErr(false);
      driverForm.drPhoto == '' ? setDrProfileErr(true) : setDrProfileErr(false);
      driverForm.IMEI_No == '' ? setDrIMEIErr(true) : setDrIMEIErr(false);

      driverForm.drAadharNO == '' ? setDrAdharNoErr(true) : setDrAdharNoErr(false);
      driverForm.drAadharFront == '' ? setDrAdharFrontErr(true) : setDrAdharFrontErr(false);
      driverForm.drAadharBack == '' ? setDrAdharBackErr(true) : setDrAdharBackErr(false);

      driverForm.currAddress == '' ? setCurrAddressErr(true) : setCurrAddressErr(false);
      driverForm.currAddressProof == '' ? setCurrAddressProofErr(true) : setCurrAddressProofErr(false);
      driverForm.prmtAddressProof == '' ? setPrmtAddressProofErr(true) : setPrmtAddressProofErr(false);

      driverForm.prmtAddress == '' ? setPrmtAddressErr(true) : setPrmtAddressErr(false);

      driverForm.police_verification == '' ? setPccVerifyErr(true) : setPccVerifyErr(false);

      driverForm.drResume == '' ? setResumeErr(true) : setResumeErr(false);
      driverForm.dlExpiry == '' ? setDrLicenseExpiryErr(true) : setDrLicenseExpiryErr(false);
      driverForm.dlStart == '' ? setDrLicenseStartErr(true) : setDrLicenseErr(false);
      driverForm.pccEnd == '' ? setDrPccEndErr(true) : setDrPccEndErr(false);
    }
  };
  // console.log(driverForm);
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
      <div className="flex flex-col gap-10 bg-white py-10 px-5 rounded-xl">
        {/* heading */}
        <div>
          <p className="text-3xl text-gray-600 text-center">Add Driver</p>
        </div>
        <div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="Vendor Id">Select Vendor</InputLabel>
              <Select
                labelId="Vendor Id"
                id="demo-sple-select"
                label="Select Vendor"
                value={driverForm.vendorId}
                onChange={(e) => setDriverForm({ ...driverForm, vendorId: e.target.value })}
              >
                {vendorData.map((item, i) => (
                  <MenuItem key={i} value={item.vendorId}>
                    {item.vendorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {driverForm.vendorId != '' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8">
              <div>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    type="text"
                    label="Name"
                    variant="outlined"
                    value={driverForm.drName}
                    onChange={(e) => setDriverForm({ ...driverForm, drName: e.target.value })}
                  />
                </FormControl>
                {drNameErr && <p className="text-red-500 text-xs ml-2">name error</p>}
              </div>
              <div>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="IMEI NO"
                    type="text"
                    variant="outlined"
                    value={driverForm.IMEI_No}
                    onChange={(e) => setDriverForm({ ...driverForm, IMEI_No: e.target.value })}
                  />
                </FormControl>
                {drIMEIErr && <p className="text-red-500 text-xs ml-2">IMEI_No error</p>}
              </div>
              <div>
                <FormControl fullWidth>
                  <TextField
                    type="tel"
                    inputProps={{ maxLength: 10, minLength: 10 }}
                    label="Mobile Number"
                    variant="outlined"
                    value={driverForm.drmobile}
                    pattern="[0-9]{10}"
                    onChange={(e) => setDriverForm({ ...driverForm, drmobile: e.target.value })}
                  />
                </FormControl>
                {drmobileErr && <p className="text-red-500 text-xs ml-2">number error</p>}
              </div>
              <div>
                <FormControl fullWidth>
                  <TextField
                    type="tel"
                    inputProps={{ maxLength: 10, minLength: 10 }}
                    label="Alternate Number"
                    variant="outlined"
                    value={driverForm.drAlternatemobile}
                    pattern="[0-9]{10}"
                    onChange={(e) => setDriverForm({ ...driverForm, drAlternatemobile: e.target.value })}
                  />
                </FormControl>
                {drAltMobileErr && <p className="text-red-500 text-xs ml-2">alternatemobile error</p>}
              </div>

              <div>
                {driverForm.drPhoto == '' ? (
                  <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                    <label htmlFor="photo" className="w-full block text-gray-500">
                      Upload Photo{' '}
                    </label>{' '}
                    <input type="file" id="photo" name="drPhoto" onChange={(e) => handleDocumentPhoto(e)} className="text-xs w-28" />
                  </p>
                ) : (
                  <div className="flex justify-between">
                    <img src={driverForm.drPhoto} alt="" className="w-20 h-20 rounded-xl" />
                    <Button onClick={() => setDriverForm({ ...driverForm, drPhoto: '' })} variant="outlined" color="error">
                      remove
                    </Button>
                  </div>
                )}
                {drProfileErr && <p className="text-red-500 text-xs ml-2">upload photo</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xl text-gray-500">Address details</p>
                  <p className=" border border-gray-300 mt-1"></p>
                </div>

                <div className="flex flex-col gap-10">
                  <div className="flex gap-10 max-md:flex-col items-center w-full">
                    <div className="w-full ">
                      <FormControl fullWidth>
                        <TextField
                          type="text"
                          id="outlined-basic"
                          label="Current Address"
                          variant="outlined"
                          value={driverForm.currAddress}
                          onChange={(e) => setDriverForm({ ...driverForm, currAddress: e.target.value })}
                        />
                      </FormControl>
                      {currAddressErr && <p className="text-red-500 text-xs ml-2">currAddress error</p>}
                    </div>
                    <div className="w-full ">
                      {driverForm.currAddressProof == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="currAddress" className="w-full block max-lg:text-[12px] max-md:text-[10px]">
                            Upload current Address{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="currAddress"
                            name="currAddressProof"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-28"
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={driverForm.currAddressProof} alt="currAddress" className="w-20 h-20 rounded-xl" />
                          <Button onClick={() => setDriverForm({ ...driverForm, currAddressProof: '' })} variant="outlined" color="error">
                            remove
                          </Button>
                        </div>
                      )}
                      {currAddressProofErr && <p className="text-red-500 text-xs ml-2">upload Curr Address </p>}
                    </div>
                  </div>
                  <div className="flex gap-10 max-md:flex-col  items-center w-full">
                    <div className="w-full">
                      <FormControl fullWidth>
                        <TextField
                          type="text"
                          id="outlined-basic"
                          label="Parmanent Address"
                          variant="outlined"
                          value={driverForm.prmtAddress}
                          onChange={(e) => setDriverForm({ ...driverForm, prmtAddress: e.target.value })}
                        />
                      </FormControl>
                      {prmtAddressErr && <p className="text-red-500  ml-2">currAddress error</p>}
                    </div>
                    <div className="w-full ">
                      {driverForm.prmtAddressProof == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="currAddress" className="w-full block max-lg:text-[12px] max-md:text-[10px]">
                            Upload permanent Address{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="prmtAddress"
                            name="prmtAddressProof"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-28"
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={driverForm.prmtAddressProof} alt="prmtAddressProof" className="w-20 h-20 rounded-xl" />
                          <Button onClick={() => setDriverForm({ ...driverForm, prmtAddressProof: '' })} variant="outlined" color="error">
                            remove
                          </Button>
                        </div>
                      )}
                      {prmtAddressProofErr && <p className="text-red-500 text-xs ml-2">parmanent Address error</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* document */}
            <div>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xl text-gray-500">Document</p>
                  <p className="border border-gray-300 mt-2"></p>
                </div>
                {/* Adhar card */}
                <div>
                  <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-md:gap-3">
                    <div>
                      <FormControl fullWidth>
                        <TextField
                          type="number"
                          id="outlined-basic"
                          label="Aadhar Number"
                          variant="outlined"
                          value={driverForm.drAadharNO}
                          onChange={(e) => setDriverForm({ ...driverForm, drAadharNO: e.target.value })}
                        />
                      </FormControl>
                      {drAdharNoErr && <p className="text-red-500  ml-2">Adhar number error</p>}
                    </div>
                    <div>
                      {driverForm.drAadharFront == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3 border-gray-400">
                          <label htmlFor="aadharFront" className="w-full block max-lg:text-[12px] max-md:text-[10px]">
                            Upload aadharFront{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="aadharFront"
                            name="drAadharFront"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-28 "
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={driverForm.drAadharFront} alt="aadharFront" className="w-20 h-20 rounded-xl" />
                          <Button onClick={() => setDriverForm({ ...driverForm, drAadharFront: '' })} variant="outlined" color="error">
                            remove
                          </Button>
                        </div>
                      )}
                      {drAdharFrontErr && <p className="text-red-500 text-xs ml-2">upload AadharFront card </p>}
                    </div>
                    <div>
                      {driverForm.drAadharBack == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="aadharBack" className="w-full block max-lg:text-[12px] max-md:text-[10px]">
                            Upload aadharBack{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="aadharBack"
                            name="drAadharBack"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-28"
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={driverForm.drAadharBack} alt="aadharBack" className="w-20 h-20 rounded-xl" />
                          <Button onClick={() => setDriverForm({ ...driverForm, drAadharBack: '' })} variant="outlined" color="error">
                            remove
                          </Button>
                        </div>
                      )}
                      {drAdharBackErr && <p className="text-red-500 text-xs ml-2">upload aadharBack card </p>}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-md:gap-3">
                    <div>
                      {driverForm.police_verification == '' ? (
                        <>
                          <InputLabel>Police Verification</InputLabel>
                          <FormControl fullWidth>
                            <TextField type="file" variant="outlined" name="police_verification" onChange={(e) => handleDocumentPhoto(e)} />
                          </FormControl>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <img src={driverForm.police_verification} alt="police_verification" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setDriverForm({ ...driverForm, police_verification: '' })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      )}
                      {pccVerifyErr && <p className="text-red-500 text-xs ml-2">upload police Verification </p>}
                    </div>
                    <div>
                      <label htmlFor="pccStart" className="text-md w-full block">
                        Pcc Start Date
                      </label>
                      <p className="w-full border border-gray-400 rounded-xl px-2 py-3">
                        <input
                          type="date"
                          className="outline-none border-none w-full"
                          id="pccStart"
                          value={driverForm.pccStart}
                          onChange={(e) => setDriverForm({ ...driverForm, pccStart: e.target.value })}
                        />
                      </p>
                      {drPccEndErr && <p className="text-red-500  ml-2">PCC end error</p>}
                    </div>
                    <div>
                      <label htmlFor="pccEnd" className="text-md w-full block">
                        Pcc End Date
                      </label>
                      <p className="w-full border border-gray-400 rounded-xl px-2 py-3">
                        <input
                          type="date"
                          className="outline-none border-none w-full"
                          id="pccEnd"
                          value={driverForm.pccEnd}
                          onChange={(e) => setDriverForm({ ...driverForm, pccEnd: e.target.value })}
                        />
                      </p>
                      {drPccEndErr && <p className="text-red-500  ml-2">PCC end error</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-7 ">
                  <div>
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Driving LicenseNo"
                        type="text"
                        variant="outlined"
                        value={driverForm.drLicenseNo}
                        onChange={(e) => setDriverForm({ ...driverForm, drLicenseNo: e.target.value })}
                      />
                    </FormControl>
                    {drLicenseNoErr && <p className="text-red-500 text-xs ml-2">IMEI_No error</p>}
                  </div>
                  <div>
                    {driverForm.dlImg == '' ? (
                      <>
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="DL" className="w-full block max-lg:text-[12px] max-md:text-[10px]">
                            Upload DL
                          </label>
                          <input type="file" id="DL" name="dlImg" onChange={(e) => handleDocumentPhoto(e)} className="text-xs w-28" />
                        </p>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={driverForm.dlImg} alt="dlImg" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setDriverForm({ ...driverForm, dlImg: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {drLicenseImgErr && <p className="text-red-500 text-xs ml-2">upload dlImg </p>}
                  </div>
                  {/* dl start date */}
                  <div>
                    <p className="w-full border border-gray-400 rounded-xl px-2">
                      <label htmlFor="dlStart" className="text-md w-full block">
                        License start validity
                      </label>
                      <input
                        type="date"
                        className="outline-none border-none w-full"
                        id="dlStart"
                        value={driverForm.dlStart}
                        onChange={(e) => setDriverForm({ ...driverForm, dlStart: e.target.value })}
                      />
                    </p>
                    {drLicenseStartErr && <p className="text-red-500 text-xs ml-2">dl start error</p>}
                  </div>
                  {/* dl end time */}
                  <div>
                    <p className="w-full border border-gray-400 rounded-xl px-2">
                      <label htmlFor="dlExpiry" className="text-md w-full block">
                        License Expiry validity
                      </label>
                      <input
                        type="date"
                        className="outline-none border-none w-full"
                        id="dlExpiry"
                        value={driverForm.dlExpiry}
                        onChange={(e) => setDriverForm({ ...driverForm, dlExpiry: e.target.value })}
                      />
                    </p>
                    {drLicenseExpiryErr && <p className="text-red-500 text-xs ml-2">Dl expiry error</p>}
                  </div>

                  <div>
                    {driverForm.drResume == '' ? (
                      <>
                        {' '}
                        <InputLabel>Resume</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="drResume" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={driverForm.drResume} alt="drResume" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setDriverForm({ ...driverForm, drResume: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {resumeErr && <p className="text-red-500 text-xs ml-2">upload dr Resume</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* button */}
            <div>
              <div className="flex justify-between">
                <Button variant="contained" className="bg-blue-700" onClick={handleDriver}>
                  Add Driver
                </Button>
                <Button variant="outlined" color="error">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
