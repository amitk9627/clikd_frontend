import React from 'react'

import { IconPhone } from '@tabler/icons-react';
export const DriverCard = ({item}) => {
  return (
    <>
    <p className="text-right">
      <span
        className={`px-2 py-1 rounded  ${item.pairStatus == 0 ? 'bg-[#FFE070] text-black' : 'bg-[#49c401] text-white'}`}
      >
        {item.pairStatus == 0 ? 'Unassigned' : 'Assigned'}
      </span>
    </p>

    <p className="flex gap-2">
      <span className="text-[#484848]">Driver Name : </span>
      <span className="text-black font-medium max-md:text-sm uppercase">{item.driver_name}</span>
    </p>
    <p className="flex">
      <span>
        <IconPhone className="h-4" />
      </span>
      <span className="text-black font-medium">+91-{item.primary_contact}</span>
    </p>
    <p className="bg-gray-300 p-2 rounded flex gap-2">
      <span className="">Bus No. -</span>
      <span className="text-black font-medium">{item.bus_number == null ? '------' : item.bus_number}</span>
    </p>
  </>
  )
}
