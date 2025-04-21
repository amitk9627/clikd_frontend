import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import LoaderCircular from 'ui-component/LoaderCircular';
import { BackendUrl } from 'utils/config';
import { UploadDocumenttos3Bucket } from 'utils/AwsS3Bucket';
import {conductorbucket} from 'utils/AwsS3bucketName';
export const AddConductor = () => {
  const [conductorForm, setConductorForm] = useState({
    conName: '',
    conMobile: '',
    vendorId: '',
    conPhoto: '',
    conAadharNO: '',
    conAadharFront: '',
    conAadharBack: '',
    conAlternatemobile: '',
    pccImg: '',
    pccEnd: '',
    pccStart: '',
    currAddress: '',
    currAddressProof: '',
    prmtAddress: '',
    prmtAddressProof: '',
    IMEI_No: '',
    conResume: ''
  });
  const [vendorData, setVendorData] = useState([]);
  useEffect(() => {
    axios
      .get(`${BackendUrl}/app/v1/vendor/getAllVendors`)
      .then((res) => setVendorData(res.data?.result))
      .catch((err) => console.log(err));
  }, []);
  const [conNameErr, setConNameErr] = useState(false);
  const [conMobileErr, setConMobileErr] = useState(false);
  const [conAltMobileErr, setConAltMobileErr] = useState(false);
  const [conIMEIErr, setConIMEIErr] = useState(false);
  const [conProfileErr, setConProfileErr] = useState(false);
  const [conAdharNoErr, setConAdharNoErr] = useState(false);
  const [conAdharFrontErr, setConAdharFrontErr] = useState(false);
  const [conPccEndErr, setConPccEndErr] = useState(false);
  const [conPccStartErr, setConPccStartErr] = useState(false);
  const [conAdharBackErr, setConAdharBackErr] = useState(false);
  const [currAddressErr, setCurrAddressErr] = useState(false);
  const [currAddressProofErr, setCurrAddressProofErr] = useState(false);
  const [prmtAddressErr, setPrmtAddressErr] = useState(false);
  const [prmtAddressProofErr, setPrmtAddressProofErr] = useState(false);
  const [pccVerifyErr, setPccVerifyErr] = useState(false);
  const [resumeErr, setResumeErr] = useState(false);

  const [isLoading, setisLoading] = useState(false);
  const handleDocumentPhoto = async (event) => {
    const name = event.target.name;
    setisLoading(true);
    const link = await UploadDocumenttos3Bucket(event, conductorbucket);
    setConductorForm({ ...conductorForm, [name]: link });
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
  // const clearAll = () => {
  //   setConductorForm({
  //     conName: '',
  //     conMobile: '',
  //     conAddress: '',
  //     vendorId: '',
  //     conProfile: '',
  //     conPancard: ''
  //   });
  //   setConNameErr(false);
  //   setConMobileErr(false);
  //   setConAddressErr(false);
  //   setConProfileErr(false);
  //   setConAdharFrontErr(false);
  //   setConPancardErr(false);
  // };
  const handleConductor = () => {
    if (
      conductorForm.conName != '' &&
      conductorForm.conMobile != '' &&
      conductorForm.vendorId != '' &&
      conductorForm.conPhoto != '' &&
      conductorForm.conAadharNO != '' &&
      conductorForm.conAadharFront != '' &&
      conductorForm.conAadharBack != '' &&
      conductorForm.conAlternatemobile != '' &&
      conductorForm.pccImg != '' &&
      conductorForm.pccEnd != '' &&
      conductorForm.currAddress != '' &&
      conductorForm.currAddressProof != '' &&
      conductorForm.prmtAddress != '' &&
      conductorForm.prmtAddressProof != '' &&
      conductorForm.IMEI_No != '' &&
      conductorForm.conResume != '' &&
      conductorForm.pccStart != ''
    ) {
      if (conductorForm.conMobile == conductorForm.conAlternatemobile) {
        window.alert('modile number and Alternate mobile number same');
        return;
      }
      const document = {
        profile: conductorForm.conPhoto,
        aadharfront: conductorForm.conAadharFront,
        aadharBack: conductorForm.conAadharBack,
        pcc: conductorForm.pccImg,
        curr_address: conductorForm.currAddressProof,
        permanent_address: conductorForm.prmtAddressProof,
        resume: conductorForm.conResume
      };
      // pcc end & start
      const body = {
        conductorName: String(conductorForm.conName).trim(),
        currentAddress: String(conductorForm.currAddress).trim(),
        permanentAddress: String(conductorForm.prmtAddress),
        primaryContact: conductorForm.conMobile,
        emergencyContact: conductorForm.conAlternatemobile,
        adhaarNumber: conductorForm.conAadharNO,
        imeiNumber: conductorForm.IMEI_No,
        conductorDocument: document,
        vendorId: conductorForm.vendorId
      };
      console.log(body);
      axios
        .post(`${BackendUrl}/app/v1/conductor/insertConductor`, body)
        .then((res) => {
          // console.log(res.data)
          if (!res.data.isConductorCreated) {
            toast.success(`${res.data.result}`);
          } else {
            toast.success(`${res.data.result}`);
          }

          // clearAll();
        })
        .catch((err) => {
          console.log('Api error ', err);
          toast.success('Error');
        });
    } else {
      conductorForm.conName == '' ? setConNameErr(true) : setConNameErr(false);
      conductorForm.conMobile == '' ? setConMobileErr(true) : setConMobileErr(false);
      conductorForm.conAlternatemobile == '' ? setConAltMobileErr(true) : setConAltMobileErr(false);
      conductorForm.conPhoto == '' ? setConProfileErr(true) : setConProfileErr(false);
      conductorForm.IMEI_No == '' ? setConIMEIErr(true) : setConIMEIErr(false);
      conductorForm.currAddress == '' ? setCurrAddressErr(true) : setCurrAddressErr(false);
      conductorForm.prmtAddress == '' ? setPrmtAddressErr(true) : setPrmtAddressErr(false);
      conductorForm.currAddressProof == '' ? setCurrAddressProofErr(true) : setCurrAddressProofErr(false);
      conductorForm.prmtAddressProof == '' ? setPrmtAddressProofErr(true) : setPrmtAddressProofErr(false);
      conductorForm.conAadharNO == '' ? setConAdharNoErr(true) : setConAdharNoErr(false);
      conductorForm.conAadharFront == '' ? setConAdharFrontErr(true) : setConAdharFrontErr(false);
      conductorForm.conAadharBack == '' ? setConAdharBackErr(true) : setConAdharBackErr(false);
      conductorForm.pccStart == '' ? setConPccStartErr(true) : setConPccStartErr(false);
      conductorForm.pccEnd == '' ? setConPccEndErr(true) : setConPccEndErr(false);
      conductorForm.pccImg == '' ? setPccVerifyErr(true) : setPccVerifyErr(false);

      conductorForm.conResume == '' ? setResumeErr(true) : setResumeErr(false);
    }
  };

  return (
    <div>
      <div>
        <Toaster />
      </div>
      {isLoading && (
        <div>
          <LoaderCircular />
        </div>
      )}
      <div className="flex flex-col gap-10 bg-white py-10 px-5 rounded-xl">
        {/* heading */}
        <div>
          <p className="text-3xl text-gray-600 text-center">Add Conductor</p>
          
        </div>
        <div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="Vendor Id">Vendors</InputLabel>
              <Select
                labelId="Vendor Id"
                id="demo-sple-select"
                label="Vendor Id"
                value={conductorForm.vendorId}
                onChange={(e) => setConductorForm({ ...conductorForm, vendorId: e.target.value })}
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
        {conductorForm.vendorId != '' && (
          <>
            <div>
              <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-6">
                <div>
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-basic"
                      type="text"
                      label="Name"
                      variant="outlined"
                      value={conductorForm.conName}
                      onChange={(e) => setConductorForm({ ...conductorForm, conName: e.target.value })}
                    />
                  </FormControl>
                  {conNameErr && <p className="text-red-500 text-xs ml-2">name error</p>}
                </div>
                <div>
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-basic"
                      label="IMEI NO"
                      type="text"
                      variant="outlined"
                      value={conductorForm.IMEI_No}
                      onChange={(e) => setConductorForm({ ...conductorForm, IMEI_No: e.target.value })}
                    />
                  </FormControl>
                  {conIMEIErr && <p className="text-red-500 text-xs ml-2">IMEI_No error</p>}
                </div>
                <div>
                  <FormControl fullWidth>
                    <TextField
                      type="tel"
                      inputProps={{ maxLength: 10, minLength: 10 }}
                      label="Mobile Number"
                      variant="outlined"
                      value={conductorForm.conMobile}
                      pattern="[0-9]{10}"
                      onChange={(e) => setConductorForm({ ...conductorForm, conMobile: e.target.value })}
                    />
                  </FormControl>
                  {conMobileErr && <p className="text-red-500 text-xs ml-2">number error</p>}
                </div>
                <div>
                  <FormControl fullWidth>
                    <TextField
                      type="tel"
                      inputProps={{ maxLength: 10, minLength: 10 }}
                      label="Alternate Number"
                      variant="outlined"
                      value={conductorForm.conAlternatemobile}
                      pattern="[0-9]{10}"
                      onChange={(e) => setConductorForm({ ...conductorForm, conAlternatemobile: e.target.value })}
                    />
                  </FormControl>
                  {conAltMobileErr && <p className="text-red-500 text-xs ml-2">alternatemobile error</p>}
                </div>

                <div>
                  {conductorForm.conPhoto == '' ? (
                    <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                      <label htmlFor="photo" className="w-full block text-gray-500">
                        Upload pofile{' '}
                      </label>{' '}
                      <input type="file" id="photo" name="conPhoto" onChange={(e) => handleDocumentPhoto(e)} className="text-xs w-24" />
                    </p>
                  ) : (
                    <div className="flex justify-between">
                      <img src={conductorForm.conPhoto} alt="" className="w-20 h-20 rounded-xl" />
                      <Button onClick={() => setConductorForm({ ...drPhoto, conPhoto: '' })} variant="outlined" color="error">
                        remove
                      </Button>
                    </div>
                  )}
                  {conProfileErr && <p className="text-red-500 text-xs ml-2">upload photo</p>}
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xl text-gray-500">Address details</p>
                 
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex gap-6 max-md:flex-col items-center w-full">
                    <div className="w-full ">
                      <FormControl fullWidth>
                        <TextField
                          type="text"
                          id="outlined-basic"
                          label="Current Address"
                          variant="outlined"
                          value={conductorForm.currAddress}
                          onChange={(e) => setConductorForm({ ...conductorForm, currAddress: e.target.value })}
                        />
                      </FormControl>
                      {currAddressProofErr && <p className="text-red-500 text-xs ml-2">currAddress error</p>}
                    </div>
                    <div className="w-full ">
                      {conductorForm.currAddressProof == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="currAddress" className="w-full block text-gray-500">
                            Upload current Address{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="currAddress"
                            name="currAddressProof"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-24"
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={conductorForm.currAddressProof} alt="currAddress" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setVendorForm({ ...conductorForm, currAddressProof: '' })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      )}
                      {currAddressErr && <p className="text-red-500 text-xs ml-2">upload Curr Address </p>}
                    </div>
                  </div>
                  <div className="flex gap-6 max-md:flex-col items-center w-full">
                    <div className="w-full">
                      <FormControl fullWidth>
                        <TextField
                          type="text"
                          id="outlined-basic"
                          label="Parmanent Address"
                          variant="outlined"
                          value={conductorForm.prmtAddress}
                          onChange={(e) => setConductorForm({ ...conductorForm, prmtAddress: e.target.value })}
                        />
                      </FormControl>
                      {prmtAddressProofErr && <p className="text-red-500 ml-2">prmtAddress error</p>}
                    </div>
                    <div className="w-full ">
                      {conductorForm.prmtAddressProof == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="prmtAddress" className="w-full block text-gray-500">
                            Upload permanent Address{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="prmtAddress"
                            name="prmtAddressProof"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-24"
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={conductorForm.prmtAddressProof} alt="prmtAddressProof" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setConductorForm({ ...conductorForm, prmtAddressProof: '' })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      )}
                      {prmtAddressErr && <p className="text-red-500 text-xs ml-2">upload parmanent Address </p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xl text-gray-500">Document</p>
                
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
                          value={conductorForm.conAadharNO}
                          onChange={(e) => setConductorForm({ ...conductorForm, conAadharNO: e.target.value })}
                        />
                      </FormControl>
                      {conAdharNoErr && <p className="text-red-500  ml-2">Adhar number error</p>}
                    </div>
                    <div>
                      {conductorForm.conAadharFront == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3 border-gray-400">
                          <label htmlFor="aadharFront" className="w-full block text-gray-500 ">
                            Upload aadharFront{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="aadharFront"
                            name="conAadharFront"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-28 "
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={conductorForm.conAadharFront} alt="aadharFront" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setConductorForm({ ...conductorForm, conAadharFront: '' })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      )}
                      {conAdharFrontErr && <p className="text-red-500 text-xs ml-2">upload AadharFront card </p>}
                    </div>
                    <div>
                      {conductorForm.conAadharBack == '' ? (
                        <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                          <label htmlFor="aadharBack" className="w-full block text-gray-500  ">
                            Upload aadharBack{' '}
                          </label>{' '}
                          <input
                            type="file"
                            id="aadharBack"
                            name="conAadharBack"
                            onChange={(e) => handleDocumentPhoto(e)}
                            className="text-xs w-28"
                          />
                        </p>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={conductorForm.conAadharBack} alt="aadharBack" className="w-20 h-20 rounded-xl" />
                          <Button
                            onClick={() => setConductorForm({ ...conductorForm, conAadharBack: '' })}
                            variant="outlined"
                            color="error"
                          >
                            remove
                          </Button>
                        </div>
                      )}
                      {conAdharBackErr && <p className="text-red-500 text-xs ml-2">upload aadharBack card </p>}
                    </div>
                  </div>
                </div>
                {/* PCC */}
                <div>
                  <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-md:gap-3">
                    <div>
                      {conductorForm.pccImg == '' ? (
                        <>
                          <p className="w-full flex justify-between border rounded-xl p-3  border-gray-400">
                            <label htmlFor="pancard" className="w-full block text-gray-500 ">
                              police_verification{' '}
                            </label>{' '}
                            <input
                              type="file"
                              id="police"
                              name="pccImg"
                              onChange={(e) => handleDocumentPhoto(e)}
                              className="text-xs w-28"
                            />
                          </p>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          {' '}
                          <img src={conductorForm.pccImg} alt="pccImg" className="w-20 h-20 rounded-xl" />
                          <Button onClick={() => setConductorForm({ ...conductorForm, pccImg: '' })} variant="outlined" color="error">
                            remove
                          </Button>
                        </div>
                      )}
                      {pccVerifyErr && <p className="text-red-500 text-xs ml-2">upload police Verification </p>}
                    </div>
                    <div>
                      <p className="w-full border border-gray-400 rounded-xl px-2 py-1">
                        <label htmlFor="pccstart" className="text-md w-full block">
                          pcc Start
                        </label>
                        <input
                          type="date"
                          className="outline-none border-none w-full"
                          id="pccstart"
                          value={conductorForm.pccStart}
                          onChange={(e) => setConductorForm({ ...conductorForm, pccStart: e.target.value })}
                        />
                      </p>
                      {conPccStartErr && <p className="text-red-500  ml-2">PCC start error</p>}
                    </div>

                    <div>
                      <p className="w-full border border-gray-400 rounded-xl px-2 py-1">
                        <label htmlFor="pccEnd" className="text-md w-full block">
                          pcc end
                        </label>
                        <input
                          type="date"
                          className="outline-none border-none w-full"
                          id="pccEnd"
                          value={conductorForm.pccEnd}
                          onChange={(e) => setConductorForm({ ...conductorForm, pccEnd: e.target.value })}
                        />
                      </p>
                      {conPccEndErr && <p className="text-red-500  ml-2">PCC end error</p>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 max-md:grid-cols-1 max-lg:gap-7 gap-5">
                  <div>
                    {conductorForm.conResume == '' ? (
                      <>
                        {' '}
                        <InputLabel>Resume</InputLabel>
                        <FormControl fullWidth>
                          <TextField type="file" variant="outlined" name="conResume" onChange={(e) => handleDocumentPhoto(e)} />
                        </FormControl>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <img src={conductorForm.conResume} alt="conResume" className="w-20 h-20 rounded-xl" />
                        <Button onClick={() => setConductorForm({ ...conductorForm, conResume: '' })} variant="outlined" color="error">
                          remove
                        </Button>
                      </div>
                    )}
                    {resumeErr && <p className="text-red-500 text-xs ml-2">upload Resume</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* button */}
            <div>
              <div className="flex justify-between">
                <Button variant="contained" className="bg-blue-700" onClick={handleConductor}>
                  Add Conductor
                </Button>
                <Button variant="outlined" color="error">
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
