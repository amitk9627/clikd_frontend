import { lazy } from 'react';
// import { ProtectedRoutes } from '../protectRoute/ProtectedRoutes';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// bus
import { AddBus } from 'views/AdminPanel/Bus/addBus/AddBus';
import { AllBus } from 'views/AdminPanel/Bus/allBus/AllBus';
// Route
import { AddRoute } from 'views/AdminPanel/Route/addRoute/AddRoute';
import { AllRoute } from 'views/AdminPanel/Route/allRoute/AllRoute';
// driver
import { AddDriver } from 'views/AdminPanel/Driver/addDriver/AddDriver';
import { AllDriver } from 'views/AdminPanel/Driver/allDriver/AllDriver';

// conductor
import { AddConductor } from 'views/AdminPanel/Conductor/addConductor/AddConductor';
import { AllConductor } from 'views/AdminPanel/Conductor/allConductor/AllConductor';
// trip
import { AddTrip } from 'views/AdminPanel/Trip/addTrip/AddTrip';
import { AllTrip } from 'views/AdminPanel/Trip/allTrip/AllTrip';
// User
import { AllUser } from 'views/User/allUser/AllUser';
import { SearchUser } from 'views/User/searchUser/SearchUser';

import { AllBooking } from 'views/allBooking/AllBooking';
// Vendor
import { AllVendor } from 'views/AdminPanel/Vendor/allVendor/AllVendor';
import { AddVendor } from 'views/AdminPanel/Vendor/addVendor/AddVendor';
import { SearchVendorByBusNo } from 'views/AdminPanel/Vendor/searchVendorByBusNo/SearchVendorByBusNo';
// stop
import { AddStop } from 'views/AdminPanel/Stop/addStop/AddStop';
import { AllStop } from 'views/AdminPanel/Stop/allStop/AllStop';

// Pair Bus Driver
import { PairBusDriver } from 'views/AdminPanel/Bus/pairBusDriver/PairBusDriver';
// maker checker
import { MakerChecker } from 'views/MakerChecker/MakerChecker';
import { MakeTrip } from 'views/AdminPanel/MakeTrip/MakeTrip';
import { AllRoutes } from 'views/AdminPanel/AllRoutes/AllRoutes';
// User Details ( New User )
import { UserManagement } from 'views/AdminPanel/userManagement/UserManagement';

// trail
// import { DelhiRoute } from 'views/AdminPanel/DelhiRoute/DelhiRoute';
// trip management
const TripManagement = Loadable(lazy(() => import('views/AdminPanel/Trip/tripManagement/TripManagement')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'add_route',
      element: <AddRoute />
    },
    {
      path: 'all_route',
      element: <AllRoute />
    },
    {
      path: 'add_bus',
      element: <AddBus />
    },
    {
      path: 'add_driver',
      element: <AddDriver />
    },
    {
      path: 'add_conductor',
      element: <AddConductor />
    },
    {
      path: 'all_bus',
      element: <AllBus />
    },
    {
      path: 'all_driver',
      element: <AllDriver />
    },
    {
      path: 'all_conductor',
      element: <AllConductor />
    },
    {
      path: 'add_trip',
      element: <AddTrip />
    },
    {
      path: 'add_stop',
      element: <AddStop />
    },
    {
      path: 'search_user',
      element: <SearchUser />
    },
    {
      path: 'all_user',
      element: <AllUser />
    },
    {
      path: 'all_booking',
      element: <AllBooking />
    },
    {
      path: 'all_stop',
      element: <AllStop />
    },
    {
      path: 'all_vendor',
      element: <AllVendor />
    },
    {
      path: 'add_vendor',
      element: <AddVendor />
    },
    {
      path: 'search_vendor_by_busNo',
      element: <SearchVendorByBusNo />
    },
    {
      path: 'all_trip',
      element: <AllTrip />
    },
    {
      path: 'pairBusDriver',
      element: <PairBusDriver />
    },
    {
      path: 'trip_management',
      element: <TripManagement />
    },
    {
      path: 'makerChecker',
      element: <MakerChecker />
    },
    {
      path: 'make_trip',
      element: <MakeTrip />
    },
    {
      path: 'state_route',
      element: <AllRoutes />
    },
    {
      path: 'user_management',
      element: <UserManagement />
    }
    // ,
    // {
    //   path: 'delhi_route',
    //   element: <DelhiRoute />
    // }
  ]
};

export default MainRoutes;
