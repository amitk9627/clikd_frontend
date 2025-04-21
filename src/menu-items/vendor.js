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
const vendor = {
  id: 'vendor',
  title: 'Vendor',
  // caption: 'User Caption',
  type: 'group',
  children: [
    {
      id: 'vendor',
      title: 'Vendor',
      type: 'collapse',
      icon: icons.IconUser,
      children: [
        {
          id: 'all vendor',
          title: 'All Vendor',
          type: 'item',
          url: '/all_vendor',
          icon: icons.IconUser,
          breadcrumbs: false,
          target: false
        },
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
          id: 'search vendor',
          title: 'Search Vendor',
          type: 'item',
          url: '/search_bus',
          icon: icons.IconSearch,
          breadcrumbs: false,
          target: false
        }
      ]
    }
  ]
};

export default vendor;
