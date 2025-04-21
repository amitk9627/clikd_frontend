import React, { useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import { getCurrentDate } from 'utils/TimeDate';
import axios from 'axios';
export const MakeTrip = () => {
  const [tripDays, setTripDays] = useState(0);
  const date = '2024-05-31';
 
  return (
    <div className="h-[100%] w-[100%]  bg-white p-8">
      <div className=" flex flex-col gap-10">
        <div>
          <h1 className="text-3xl text-center font-semibold text-[#555]">Make Trip Sheet</h1>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <FormControl fullWidth>
              <TextField
                label="Enter Day"
                type="number"
                inputProps={{ min: 0 }}
                value={tripDays}
                onChange={(e) => setTripDays(e.target.value)}
              />
            </FormControl>
          </div>
          <div>
            <button className="bg-[#49C401] p-3 text-xl text-white rounded-xl" >
              Make Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
