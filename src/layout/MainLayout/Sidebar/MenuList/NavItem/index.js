import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

  const Icon = item.icon;
  // const itemIcon = item?.icon ? (
  //   <Icon
  //     stroke={1.5}
  //     size="1rem"
  //     className={` group-hover:text-[#49C401] ${
  //       customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'text-[#49c401] ' : 'text-white'
  //     } `}
  //   />
  // ) : (
  //   <FiberManualRecordIcon
  //     sx={{
  //       width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 6 : 4,
  //       height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 6 : 4
  //     }}
  //     fontSize={level > 0 ? 'inherit' : 'medium'}
  //   />
  // );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: true });
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }

    // eslint-disable-next-line
  }, [pathname]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 2,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 0 : 0.25,
        pl: `${level * 24}px`,
        '&.Mui-selected': {
          backgroundColor: '#49c401', // Light blue background when selected
          color: '#fff',
          borderRadius:'10px'
        },
        '&:hover': {
          backgroundColor: '#eee', // tab change on hover
          color: '#fff'
        }
      }}
      className="group  text-white rounded-md"
      selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon
        sx={{
          my: 'auto',
          minWidth: !item?.icon ? 18 : 36
        }}
        className={'text-[#49C401] group-hover:text-white hover:text-white'}
        selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      >
        {item?.icon ? (
          <Icon
            stroke={1.5}
            size="1rem"
            className={` group-hover:text-[#49C401] ${
              customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'text-[#fff]' : 'text-white'
            } `}
          />
        ) : (
          <FiberManualRecordIcon
            sx={{
              width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 6 : 4,
              height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 6 : 4
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
          />
        )}
      </ListItemIcon>

      <ListItemText
        primary={
          <Typography
            variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
            className={`group-hover:text-[#49C401]  ${
              customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'text-[#fff] group-hover:text-[#49C401]' : 'text-white'
            } `}
            // sx={{
            //   '&.Mui-selected': {
            //     backgroundColor: 'red', // Light blue background when selected
            //     color: '#49C401', // Blue text when selected
            //   }
            // }}
            selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
