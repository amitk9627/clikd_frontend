// assets

import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import {
  IconArrowRightRhombus,
  IconSteeringWheel,
  IconEdit,
  Icon360,
  IconPlus,
  IconBusStop,
  IconSearch,
  IconUser
} from '@tabler/icons-react';

// constant
const icons = {
  IconUser,
  IconSteeringWheel,
  IconEdit,
  IconPlus,
  IconBusStop,
  IconSearch,
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  Icon360,
  IconArrowRightRhombus
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //
// inside children object key target=true route on new page
const user = {
  id: 'users',
  title: 'User',
  caption: 'User Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
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
  ]
};

export default user;
