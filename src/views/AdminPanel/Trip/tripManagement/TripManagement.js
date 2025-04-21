import React, { useState } from 'react';
import { CompletedTrip } from './CompletedTrip';
import { OngoingTrip } from './OngoingTrip';
import { PendingTrip } from './PendingTrip';

const TripManagement = () => {
  const [show, setShow] = useState({
    pending: true,
    ongoing: false,
    completed: false
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  return (
    <div>
      <div className="bg-white py-8 px-3 rounded-lg relative">
        {/* <div>
          <p className="text-3xl text-gray-600 text-center max-lg:text-xl">Trip Management</p>
          <p className=" border border-gray-300 mt-3"></p>
        </div> */}

        {/* my-7 */}
        <div className=" flex justify-between max-md:flex-col items-center relative max-md:gap-2">
          <div className="flex max-md:flex-wrap max-md:gap-2">
            <span className="p-2 max-md:p-1">Trip Status :</span>
            <button
              onClick={() => setShow({ ...show, pending: true, ongoing: false, completed: false })}
              className={`p-2 max-md:p-1 font-semibold rounded ${show.pending ? 'bg-green-600 text-white' : 'text-gray-600'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setShow({ ...show, pending: false, ongoing: true, completed: false })}
              className={`p-2 max-md:p-1 font-semibold rounded ${show.ongoing ? 'bg-green-600 text-white' : 'text-gray-600'}`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setShow({ ...show, pending: false, ongoing: false, completed: true })}
              className={`p-2 max-md:p-1 font-semibold rounded ${show.completed ? 'bg-green-600 text-white' : 'text-gray-600'}`}
            >
              Completed
            </button>
          </div>{' '}
          <div className=" text-gray-500 ">
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
        </div>
        {/*  */}
        <div className="my-4">
          {show.pending && <PendingTrip itemsPerPage={itemsPerPage} />}
          {show.ongoing && <OngoingTrip itemsPerPage={itemsPerPage} />}
          {show.completed && <CompletedTrip itemsPerPage={itemsPerPage} />}
        </div>
      </div>
    </div>
  );
};
export default TripManagement;
