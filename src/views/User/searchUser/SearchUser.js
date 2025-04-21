import React, { useState } from 'react';
import { TextField, Button, TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BackendUrl } from 'utils/config';
export const SearchUser = () => {
  const [phNo, setPhNO] = useState('');
  const [found, setFound] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleSearch = () => {
    if (phNo != '' && phNo.length > 9) {
      axios
        .get(`${BackendUrl}/app/v1/user/getUserByMobile/${phNo}`)
        .then((res) => {
          if (res?.data?.userExists) {
            setUserData(res.data.message[0]);
            setFound(true);
            toast.success('user Found Successfully');
          } else {
            toast.error('User Not Found');
            setUserData([]);
            setFound(false);
          }
        })
        .catch((e) => {
          console.log(e);
          setFound(false);
          toast.error('API issue');
          setErrorMsg({ ...errorMsg, dbuser: true });
        });
    }
  };
  return (
    <div>
      <div>
        <Toaster />
      </div>
      <div className=" flex flex-col gap-10 bg-white p-4 rounded-xl">
        {/* heading */}
        <div>
          <p className="text-3xl text-gray-600 text-center">Search User</p>
          <p className=" border border-gray-300 mt-5"></p>
        </div>
        <div>
          <div>
            <div className="flex justify-center gap-1">
              <TextField
                id="outlined-basic"
                type="number"
                label="Phone number"
                variant="outlined"
                className="grow-[4]"
                value={phNo}
                required
                onChange={(e) => setPhNO(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                className="bg-blue-700 grow"
                onClick={() => handleSearch()}
                disabled={phNo.length == 10 ? false : true}
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
                <Table className="border-2 rounded-xl" aria-label="simple table">
                  <TableBody>
                    <TableRow hover>
                      <TableCell className="text-lg">Name</TableCell>
                      <TableCell className="text-lg">{userData.user_name}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="">Email :</TableCell>
                      <TableCell className="text-lg">{userData.email}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">gender :</TableCell>
                      <TableCell className="text-lg">{userData.gender}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">mobile :</TableCell>
                      <TableCell className="text-lg">{userData.mobile}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">home location addressline:</TableCell>
                      <TableCell className="text-lg">{userData.home_location_addressline1}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">home location city :</TableCell>
                      <TableCell className="text-lg">{userData.home_location_city}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">home location postal code</TableCell>
                      <TableCell className="text-lg">{userData.home_location_postal_code}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">home location state :</TableCell>
                      <TableCell className="text-lg">{userData.home_location_state}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">office location address</TableCell>
                      <TableCell className="text-lg">{userData.office_location_addressline1}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">office location city</TableCell>
                      <TableCell className="text-lg">{userData.office_location_city}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">office location postal code</TableCell>
                      <TableCell className="text-lg">{userData.office_location_postal_code}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">office location state</TableCell>
                      <TableCell className="text-lg">{userData.office_location_state}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">OTP</TableCell>
                      <TableCell className="text-lg">{userData.user_otp}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Otp created At</TableCell>
                      <TableCell className="text-lg">{userData.otp_createdAt}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className="text-lg">Otp expired At</TableCell>
                      <TableCell className="text-lg">{userData.otp_expiredAt}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
