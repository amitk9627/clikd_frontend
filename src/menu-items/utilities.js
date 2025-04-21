import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Man3Icon from '@mui/icons-material/Man3';
import PaymentIcon from '@mui/icons-material/Payment';
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconKey } from '@tabler/icons';
import {
  IconBus,
  IconArrowRightRhombus,
  IconRoute,
  IconSteeringWheel,
  IconEdit,
  Icon360,
  IconPlus,
  IconBusStop,
  IconSearch,
  IconUser
} from '@tabler/icons-react';

import { store } from '../store/index';
// import { UpdateRounded } from '@mui/icons-material';

const icons = {
  DirectionsCarIcon,
  IconWindmill,
  PersonAddIcon,
  LocalAtmIcon,
  IconKey,
  AttachMoneyIcon,
  PostAddIcon,
  Man3Icon,
  PaymentIcon,
  IconBus,
  IconRoute,
  IconSteeringWheel,
  IconEdit,
  IconPlus,
  IconBusStop,
  IconSearch,
  IconTypography,
  IconPalette,
  IconShadow,
  Icon360,
  IconArrowRightRhombus,
  IconUser
};

var role = '';
var arrAdmin = [];
// var arrOperation = [];
// var arrMarketing = [];
var makerChecker = [];

store.subscribe(() => {
  var updatedRole = localStorage.getItem('role');
  // console.log(updatedRole);
  if (updatedRole != null) {
    role = updatedRole;
    arrAdmin = [
      // dummy delhi tab
      // {
      //   id: 'delhiroute',
      //   title: 'Delhi Route',
      //   type: 'collapse',
      //   icon: icons.IconRoute,
      //   children: [
      //     {
      //       id: 'delhi_route',
      //       title: 'Delhi Route',
      //       type: 'item',
      //       url: '/delhi_route',
      //       icon: icons.IconSteeringWheel,
      //       breadcrumbs: false,
      //       target: false
      //     }
      //   ]
      // },
      // route
      {
        id: 'route',
        title: 'Route',
        type: 'collapse',
        icon: icons.IconRoute,
        children: [
          {
            id: 'add_route',
            title: 'Add Route',
            type: 'item',
            url: '/add_route',
            icon: icons.IconRoute,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all_route',
            title: 'All Route',
            type: 'item',
            url: '/all_route',
            icon: icons.IconArrowRightRhombus,
            breadcrumbs: false
          }
        ]
      },
      // stop
      {
        id: 'stop',
        title: 'Stop',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'add_stop',
            title: 'Add Stop',
            type: 'item',
            url: '/add_stop',
            icon: icons.IconBusStop,
            target: false,
            breadcrumbs: false
          },
          {
            id: 'all_stop',
            title: 'All Stop',
            type: 'item',
            url: '/all_stop',
            icon: icons.IconArrowRightRhombus,
            breadcrumbs: false
          }
        ]
      },
      // vendor
      {
        id: 'vendor',
        title: 'Vendor',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'add vendor',
            title: 'Add Vendor',
            type: 'item',
            url: '/add_vendor',
            icon: icons.IconPlus,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all_vendor',
            title: 'All Vendor',
            type: 'item',
            url: '/all_vendor',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          },

          {
            id: 'search_vendor',
            title: 'Search By Bus No.',
            type: 'item',
            url: '/search_vendor_by_busNo',
            icon: icons.IconSearch,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      // bus
      {
        id: 'bus',
        title: 'Bus',
        type: 'collapse',
        icon: icons.IconBus,
        children: [
          {
            id: 'add_bus',
            title: 'Add Bus',
            type: 'item',
            url: '/add_bus',
            icon: icons.IconPlus,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all_bus',
            title: 'All Bus',
            type: 'item',
            url: '/all_bus',
            icon: icons.IconArrowRightRhombus,
            breadcrumbs: false
          }
        ]
      },
      // driver
      {
        id: 'driver',
        title: 'Driver',
        type: 'collapse',
        icon: icons.IconSteeringWheel,
        children: [
          {
            id: 'add_driver',
            title: 'Add Driver',
            type: 'item',
            url: '/add_driver',
            icon: icons.IconSteeringWheel,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all_driver',
            title: 'All Driver',
            type: 'item',
            url: '/all_driver',
            icon: icons.IconArrowRightRhombus,
            breadcrumbs: false
          }
        ]
      },
      // conductor
      {
        id: 'conductor',
        title: 'Conductor',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'add_conductor',
            title: 'Add Conductor',
            type: 'item',
            url: '/add_conductor',
            icon: icons.IconShadow,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all_conductor',
            title: 'All Conductor',
            type: 'item',
            url: '/all_conductor',
            icon: icons.IconArrowRightRhombus,
            breadcrumbs: false
          }
        ]
      },
      // trip
      {
        id: 'trip',
        title: 'Trip',
        type: 'collapse',
        icon: icons.Icon360,
        children: [
          {
            id: 'add_trip',
            title: 'Add Trip',
            type: 'item',
            url: '/add_trip',
            icon: icons.IconPlus,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all_trip',
            title: 'All Trip',
            type: 'item',
            url: '/all_trip',
            icon: icons.IconPlus,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      // Pair bus driver
      {
        id: 'pairbusdriver',
        title: 'Pair Bus Driver',
        type: 'collapse',
        icon: icons.Icon360,
        children: [
          {
            id: 'pair_bus_driver',
            title: 'Pair Bus Diver',
            type: 'item',
            url: '/pairBusDriver',
            icon: icons.IconPlus,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      // trip management
      {
        id: 'tripmanagement',
        title: 'Trip Management',
        type: 'collapse',
        icon: icons.Icon360,
        children: [
          {
            id: 'trip_management',
            title: 'Trip Management',
            type: 'item',
            url: '/trip_management',
            icon: icons.IconPlus,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      // user
      {
        id: 'users',
        title: 'User',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'all_user',
            title: 'All User',
            type: 'item',
            url: '/all_user',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'search_user',
            title: 'Search User',
            type: 'item',
            url: '/search_user',
            icon: icons.IconSearch,
            breadcrumbs: false
          },
          {
            id: 'all_Booking',
            title: 'All Booking',
            type: 'item',
            url: '/all_booking',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      // make trip
      {
        id: 'maketrip',
        title: 'Make Trip',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'make_trip',
            title: 'Make Trip',
            type: 'item',
            url: '/make_trip',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      {
        id: 'stateroute',
        title: 'State Route',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'state_route',
            title: 'State Route',
            type: 'item',
            url: '/state_route',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      //
      {
        id: 'usermanagement',
        title: 'User Management',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'user_management',
            title: 'User Management',
            type: 'item',
            url: '/user_management',
            icon: icons.IconSteeringWheel,
            breadcrumbs: false,
            target: false
          }
        ]
      },
      // booking
      {
        id: 'booking',
        title: 'Reservation',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'all_reservation',
            title: 'All Reservation',
            type: 'item',
            url: '/all_booking',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          }
        ]
      }
    ];
    makerChecker = [
      // user
      {
        id: 'users',
        title: 'User',
        type: 'collapse',
        icon: icons.IconUser,
        children: [
          {
            id: 'search user',
            title: 'Search User',
            type: 'item',
            url: '/search_user',
            icon: icons.IconSearch,
            breadcrumbs: false
          },
          {
            id: 'all user',
            title: 'All User',
            type: 'item',
            url: '/all_user',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          },
          {
            id: 'all Booking',
            title: 'All Booking',
            type: 'item',
            url: '/all_booking',
            icon: icons.IconUser,
            breadcrumbs: false,
            target: false
          }
        ]
      }
    ];
  }
  createUtilitiesObject();
});
const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: []
};

function createUtilitiesObject() {
  utilities.children = role ? (role === 'ADMIN' ? arrAdmin : role === 'checker' ? makerChecker : []) : [];
  // utilities.children =  arrAdmin ;
}

export default utilities;
