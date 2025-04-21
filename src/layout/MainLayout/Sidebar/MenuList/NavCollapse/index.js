import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router'; //  remove useNavigate

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  // const navigate = useNavigate(); line no 4

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
    if (menu?.id !== 'authentication') {
      // navigate(menu.children[0]?.url);
    }
  };

  const { pathname } = useLocation();
  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false);
    setSelected(null);
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (item.url === pathname) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);

  // menu collapse & item
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? (
    <Icon
      strokeWidth={1.5}
      size="1.3rem"
      style={{ marginTop: 'auto', marginBottom: 'auto' }}
      className={`group-hover:text-[#49c401] ${selected==menu.id ? ' text-white group-hover:text-white':""} `}
      // sx={{
      //   '&.Mui-selected': {
      //     // Light blue background when selected
      //     backgroundColor: '#49C401',
      //     color: '#fff', // Blue text when selected
      //     '&:hover': {
      //       backgroundColor: 'red',
      //       color: '#fff' // Slightly darker blue on hover
      //     } 
      //   },
      //   '&:hover': {
      //     backgroundColor: 'red',
      //     color: '#fff' // Slightly darker blue on hover
      //   } 
      // }}
      selected={selected == menu.id}
    />
  ) : (
    <FiberManualRecordIcon
      className="text-[#49c401]"
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6,
        '&.Mui-selected': {
          backgroundColor: '#49c401',
          color: '#fff' // Light blue background when selected.
          // Blue text when selected
        }
        // '&:hover': {
        //   backgroundColor: 'rgba(0, 0, 0, 0.04)' // Light grey background on hover when not selected
        // }
      }}
      selected={selected === menu.id}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  return (
    <>
      <ListItemButton
        className={`group text-gray-400 hover:text-[#49c401]  rounded-[10px]`}
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 2,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? '#fff !important' : '#222',
          py: level > 1 ? 0 : 0.25,
          pl: `${level * 24}px`,
          '&.Mui-selected': {
            backgroundColor: '#49c401', // Light blue background when selected
            color: '#fff',
            '&:hover': {
              backgroundColor: '#49c401',
              color: '#fff' // Slightly darker blue on hover
            } // Blue text when selected
          },
          '&:hover': {
            backgroundColor: '#eee', // tab change on hover
            color:'#111'
          }
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon
          // className="group-hover:text-[#49C401] "
          sx={{
            my: 'auto',
            minWidth: !menu.icon ? 18 : 36,
            '&.Mui-selected': {
              backgroundColor: '#49c401', // Light blue background when selected
              color: '#fff',
              '&:hover': {
                backgroundColor: '#49c401',
                color: '#000' // Slightly darker blue on hover
              } // Blue text when selected
            },
           
          }}
          className={`${selected == menu.id ? 'text-white':'text-gray-400'}`}
          selected={selected == menu.id}
        >
          {menuIcon}
        </ListItemIcon>
        {/* route,stop menu collapse */}
        <ListItemText
          primary={
            <Typography
              variant={selected === menu.id ? 'h5' : 'body1'}
              sx={{
                my: 'auto'
              }}
              className={`${selected === menu.id && 'text-white'}`}
              selected={selected === menu.id}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? (
          <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} selected={selected == menu.id} />
        ) : (
          <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1

              // background: theme.palette.primary.light
            }
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
};

export default NavCollapse;
