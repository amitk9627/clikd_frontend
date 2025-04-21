import React, { useState } from 'react';
import { AlreadyContactedUser } from './AlreadyContactedUser';
import { NewUser } from './NewUser';
import { ToBeContacted } from './ToBeContacted';

export const UserManagement = () => {
  const [showUserDetails, setShowUserDetails] = useState({
    newUser: true,
    userContacted: false,
    alreadyContacted: false
  });
  return (
    <>
      <div className="py-6 px-4 bg-white flex flex-col gap-6">
        <div className="flex max-md:flex-wrap max-md:gap-2">
          <p>
            <button
              className={`p-2 max-md:p-1 font-semibold rounded ${showUserDetails.newUser ? 'bg-[#49c401] text-white' : 'text-gray-600'}`}
              onClick={() => setShowUserDetails({ ...showUserDetails, newUser: true, userContacted: false, alreadyContacted: false })}
            >
              Active
            </button>
          </p>
          <p>
            <button
              onClick={() => setShowUserDetails({ ...showUserDetails, newUser: false, userContacted: true, alreadyContacted: false })}
              className={`p-2 max-md:p-1 font-semibold rounded ${
                showUserDetails.userContacted ? 'bg-[#49c401] text-white' : 'text-gray-600'
              }`}
            >
              InActive
            </button>
          </p>
          <p>
            <button
              onClick={() => setShowUserDetails({ ...showUserDetails, newUser: false, userContacted: false, alreadyContacted: true })}
              className={`p-2 max-md:p-1 font-semibold rounded ${
                showUserDetails.alreadyContacted ? 'bg-[#49c401] text-white' : 'text-gray-600'
              }`}
            >
              Contacted
            </button>
          </p>
        </div>
        <div>
          {showUserDetails.newUser && <NewUser />}
          {showUserDetails.alreadyContacted && <AlreadyContactedUser />}
          {showUserDetails.userContacted && <ToBeContacted />}
        </div>
      </div>
    </>
  );
};
