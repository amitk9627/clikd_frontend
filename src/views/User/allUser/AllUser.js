import { useState, useEffect } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
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
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { IconX, IconPencil } from '@tabler/icons-react';
import axios from 'axios';
import { BackendUrl } from 'utils/config';

const columns = [
  { id: 'user_id', label: 'S.R No.', align: 'center', minWidth: 100 },
  { id: 'user_name', label: 'User Name', align: 'center', minWidth: 150 },
  {
    id: 'gender',
    label: 'Gender',
    minWidth: 80,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'mobile',
    label: 'Mobile',
    minWidth: 120,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'home_location_postal_code',
    label: 'Home Location Postal Code',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'home_location_city',
    label: 'Home Location City',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'home_location_state',
    label: 'Home Location State',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'home_location_addressline1',
    label: 'Home Location Addressline',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'office_location_postal_code',
    label: 'Office Location Postal Code',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'office_location_city',
    label: 'Office Location City',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'office_location_state',
    label: 'Office Location State',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'office_location_addressline1',
    label: 'Office Location Addressline1',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'update',
    label: 'Update',
    minWidth: 200,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  }
];
export const AllUser = () => {
  const [userData, setUserData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [searchBool, setSearchBool] = useState(false);
  // update state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  // console.log(updateObj);

  //----------------UPDATE ERROR STATE------------------

  const [userNameErr, setUserNameErr] = useState(false);
  const [userMobileErr, setUserMobileErr] = useState(false);
  const [userEmailErr, setUserEmailErr] = useState(false);
  const [userGenderErr, setUserGenderErr] = useState(false);
  const [homePostalCodeErr, setHomePostalCodeErr] = useState(false);
  const [homeStateErr, setHomeStateErr] = useState(false);
  const [homeAddressErr, setHomeAddressErr] = useState(false);
  const [homeCityErr, setHomeCityErr] = useState(false);
  const [officePostalCodeErr, setOfficePostalCodeErr] = useState(false);
  const [officeStateErr, setOfficeStateErr] = useState(false);
  const [officeCityErr, setOfficeCityErr] = useState(false);
  const [officeAddressErr, setOfficeAddressErr] = useState(false);
  useEffect(() => {
    fetch(`${BackendUrl}/app/v1/user/getAllusers`)
      .then((res) => res.json())
      .then((data) => setUserData(data.users))
      .catch((e) => console.log('Api fail error', e));
  }, []);
  useEffect(() => {
    if (value.length > 0) {
      let res = userData.filter((item) => item[field]?.includes(value));
      setFilterData(res);
    } else {
      setFilterData(userData);
    }
  }, [value, userData, field]);

  // handle input field
  const handleSearchField = (inputField) => {
    switch (inputField) {
      case 'user_name': {
        setField('user_name');
        break;
      }
      case 'email':
        setField('email');
        break;
      case 'mobile':
        setField('mobile');
        break;
      default:
        setField('');
    }
    setSearchBool(false);
  };
  // modal open with data
  const handleOpen = (item) => {
    setUpdateObj(item);
    // console.log(item);
    setUpdateOpen(true);
  };
  const handleClose = () => setUpdateOpen(false);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filterData.length / itemsPerPage);

  const displayItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterData.slice(startIndex, endIndex);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  const updateUser = () => {
    if (
      updateObj.user_name != '' &&
      updateObj.email != '' &&
      updateObj.home_location_postal_code != '' &&
      updateObj.home_location_city != '' &&
      updateObj.home_location_state != '' &&
      updateObj.home_location_addressline1 != '' &&
      updateObj.office_location_postal_code != '' &&
      updateObj.office_location_city != '' &&
      updateObj.office_location_state != '' &&
      updateObj.office_location_addressline1 != ''
    ) {
      const body = {
        userid: updateObj.user_id,
        username: updateObj.user_name,
        useremail: updateObj.email,
        userhomepostalcode: updateObj.home_location_postal_code,
        userhomecity: updateObj.home_location_city,
        userhomestate: updateObj.home_location_state,
        userhomeaddressline1: updateObj.home_location_addressline1,
        userofficepostalcode: updateObj.office_location_postal_code,
        userofficecity: updateObj.office_location_city,
        userofficestate: updateObj.office_location_state,
        userofficeaddressline1: updateObj.office_location_addressline1
      };
      console.log(body);
      axios
        .patch(`${BackendUrl}/app/v1/user/editUser`, body)
        .then((res) => {
          toast.success(`${res.data.message}`);
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log('Api Error : ', err);
          toast.error('error');
        });
    } else {
      updateObj.user_name == '' ? setUserNameErr(true) : setUserNameErr(false);
      updateObj.gender == '' ? setUserGenderErr(true) : setUserGenderErr(false);
      updateObj.mobile == '' ? setUserMobileErr(true) : setUserMobileErr(false);
      updateObj.email == '' ? setUserEmailErr(true) : setUserEmailErr(false);
      updateObj.home_location_postal_code == '' ? setHomePostalCodeErr(true) : setHomePostalCodeErr(false);
      updateObj.home_location_city == '' ? setHomeCityErr(true) : setHomeCityErr(false);
      updateObj.home_location_state == '' ? setHomeStateErr(true) : setHomeStateErr(false);
      updateObj.home_location_addressline1 == '' ? setHomeAddressErr(true) : setHomeAddressErr(false);
      updateObj.office_location_postal_code == '' ? setOfficePostalCodeErr(true) : setOfficePostalCodeErr(false);
      updateObj.office_location_city == '' ? setOfficeCityErr(true) : setOfficeCityErr(false);
      updateObj.office_location_state == '' ? setOfficeStateErr(true) : setOfficeStateErr(false);
      updateObj.office_location_addressline1 == '' ? setOfficeAddressErr(true) : setOfficeAddressErr(false);
    }
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4
  };
  return (
    <div>
      <div className=" flex flex-col gap-10 bg-white p-8 max-lg:p-4 max-lg:gap-5 rounded-xl relative">
        <div>
          <p className="text-3xl text-gray-600 text-center">All User Details</p>
          <p className=" border border-gray-300 mt-5"></p>
        </div>
        {/* dropdown */}
        <div className="absolute right-6 max-md:right-2 max-sm:right-0 z-10">
          <button onClick={() => setSearchBool(!searchBool)} className="absolute right-2 max-md:right-1 bg-gray-200 rounded-full p-1">
            <FilterListIcon className="text-3xl max-lg:text-2xl max-md:text-lg " />
          </button>
          {searchBool && (
            <div className="flex flex-col gap-1 bg-gray-100 rounded p-4 absolute top-10 right-0 w-32">
              <button onClick={() => handleSearchField('user_name')} className="py-1 text-sm rounded hover:bg-gray-300">
                user_name
              </button>
              <button onClick={() => handleSearchField('mobile')} className="py-1 text-sm rounded hover:bg-gray-300">
                mobile
              </button>
              <button onClick={() => handleSearchField('email')} className="py-1 text-sm rounded hover:bg-gray-300">
                email
              </button>
            </div>
          )}
        </div>
        {field != '' && (
          <div className=" px-4 -my-3 w-full">
            <TextField label={field} className="w-1/2 max-lg:w-full" onChange={(e) => setValue(e.target.value)} value={value} />
          </div>
        )}

        <div>
          <div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead className="bg-gray-300">
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }} className="uppercase font-semibold bg-gray-300">
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayItems()?.map((item, i) => {
                      return (
                        <TableRow key={i} hover>
                          <TableCell className="font-medium">{i + 1}</TableCell>
                          <TableCell className="font-medium uppercase">{item.user_name}</TableCell>
                          <TableCell className="font-medium">{item.gender}</TableCell>
                          <TableCell className="font-medium">{item.mobile}</TableCell>
                          <TableCell className="font-medium">{item.email}</TableCell>
                          <TableCell className="font-medium">{item.home_location_postal_code}</TableCell>
                          <TableCell className="font-medium">{item.home_location_city}</TableCell>
                          <TableCell className="font-medium">{item.home_location_state}</TableCell>
                          <TableCell className="font-medium uppercase">{item.home_location_addressline1}</TableCell>
                          <TableCell className="font-medium">{item.office_location_postal_code}</TableCell>
                          <TableCell className="font-medium">{item.office_location_city}</TableCell>
                          <TableCell className="font-medium">{item.office_location_state}</TableCell>
                          <TableCell className="font-medium uppercase">{item.office_location_addressline1}</TableCell>
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
            <div className="flex  justify-center">
              <Stack spacing={2}>
                <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
              </Stack>{' '}
            </div>
          </div>
        </div>
      </div>

      {/* update api */}
      <Modal open={updateOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style} className=" w-full max-lg:h-screen max-lg:w-screen p-4 overflow-y-scroll">
          <div>
            <Toaster />
          </div>
          <div className=" max-lg:w-full flex flex-col gap-1 bg-white my-4 p-4 rounded-xl">
            <div className="flex justify-between pb-5">
              <p className="text-xl font-bold">Update User</p>
              <button onClick={handleClose} className="">
                <IconX />
              </button>
            </div>
            <>
              <div>
                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-lg:gap-7 gap-10">
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        label="User ID"
                        variant="outlined"
                        disabled={true}
                        value={updateObj.user_id}
                      />
                    </FormControl>
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        type="text"
                        label="User Name"
                        variant="outlined"
                        required
                        value={updateObj.user_name}
                        onChange={(e) => setUpdateObj({ ...updateObj, user_name: e.target.value })}
                      />
                    </FormControl>
                    {userNameErr && <p className="text-red-400 p-1 ml-2">User name error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Mobile number"
                        required={true}
                        type="tel"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        value={updateObj.mobile}
                        onChange={(e) => setUpdateObj({ ...updateObj, mobile: e.target.value })}
                      />
                    </FormControl>
                    {/* check */}
                    {userMobileErr && <p className="text-red-400 p-1 ml-2">mobile number error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        required={true}
                        value={updateObj.email}
                        onChange={(e) => setUpdateObj({ ...updateObj, email: e.target.value })}
                      />
                    </FormControl>
                    {userEmailErr && <p className="text-red-400 p-1 ml-2">Email error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <InputLabel id="gender">Gender</InputLabel>
                      <Select
                        required={true}
                        labelId="gender"
                        id="demo-simple-st"
                        value={updateObj.gender}
                        label="Gender"
                        onChange={(e) => setUpdateObj({ ...updateObj, gender: e.target.value })}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                    {userGenderErr && <p className="text-red-400 p-1 ml-2">Gender error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Home location postal code"
                        variant="outlined"
                        value={updateObj.home_location_postal_code}
                        onChange={(e) => setUpdateObj({ ...updateObj, home_location_postal_code: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {homePostalCodeErr && <p className="text-red-400 p-1 ml-2">Home location postal code error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Home location state"
                        variant="outlined"
                        value={updateObj.home_location_state}
                        onChange={(e) => setUpdateObj({ ...updateObj, home_location_state: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {homeStateErr && <p className="text-red-400 p-1 ml-2">Home location state error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Home location city"
                        variant="outlined"
                        value={updateObj.home_location_city}
                        onChange={(e) => setUpdateObj({ ...updateObj, home_location_city: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {homeCityErr && <p className="text-red-400 p-1 ml-2">Home location city error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Home location address line"
                        variant="outlined"
                        value={updateObj.home_location_addressline1}
                        onChange={(e) => setUpdateObj({ ...updateObj, home_location_addressline1: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {homeAddressErr && <p className="text-red-400 p-1 ml-2">Home location address line error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Office location postal code"
                        variant="outlined"
                        value={updateObj.office_location_postal_code}
                        onChange={(e) => setUpdateObj({ ...updateObj, office_location_postal_code: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {officePostalCodeErr && <p className="text-red-400 p-1 ml-2">Office location postal code error</p>}
                  </div>{' '}
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Office location state"
                        variant="outlined"
                        value={updateObj.office_location_state}
                        onChange={(e) => setUpdateObj({ ...updateObj, office_location_state: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {officeStateErr && <p className="text-red-400 p-1 ml-2">Office location state error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Office location city"
                        variant="outlined"
                        value={updateObj.office_location_city}
                        onChange={(e) => setUpdateObj({ ...updateObj, office_location_city: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {officeCityErr && <p className="text-red-400 p-1 ml-2">Office location city error</p>}
                  </div>
                  <div className="w-full">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Office location address line"
                        variant="outlined"
                        value={updateObj.office_location_addressline1}
                        onChange={(e) => setUpdateObj({ ...updateObj, office_location_addressline1: e.target.value })}
                        required={true}
                      />
                    </FormControl>
                    {officeAddressErr && <p className="text-red-400 p-1 ml-2">Office location address line error</p>}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex gap-10 justify-between mb-3">
                  <Button variant="contained" className={'bg-blue-700'} onClick={updateUser}>
                    update User
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
