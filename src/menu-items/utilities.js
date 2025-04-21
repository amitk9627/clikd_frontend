import { IconRoute } from '@tabler/icons-react';

import { store } from '../store/index';
// import { UpdateRounded } from '@mui/icons-material';

const icons = {
  IconRoute
};

var role = '';
var arrAdmin = [];

store.subscribe(() => {
  var updatedRole = 'Amit Kumar'; //localStorage.getItem('role');
  // console.log(updatedRole);
  if (updatedRole != null) {
    role = updatedRole;
    arrAdmin = [
      {
        id: 'tasks',
        title: 'Tasks',
        type: 'item',
        url: '/tasks',
        icon: icons.IconRoute,
        breadcrumbs: true,
        target: false
      },
      {
        id: 'profile',
        title: 'My Profile',
        type: 'item',
        url: '/profile',
        icon: icons.IconRoute,
        breadcrumbs: false,
        target: false
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
  utilities.children = arrAdmin;
  // utilities.children =  arrAdmin ;
}

export default utilities;
