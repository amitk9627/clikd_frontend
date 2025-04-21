import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, useMediaQuery } from '@mui/material';

// import { AppBar, Box, CssBaseline, Toolbar,  } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // console.log(matchDownMd);
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  // const Page = useSelector((state) => state.customization.isOpen[0]).split('_');

  const animateStyle = {
    backgroundColor: 'black',
    transition: 'all 0.1s ease-in-out'
  };

  return (
    <>
      {/* logo & toggler button */}
      <div className={`h-20 w-[260px]  max-lg:w-auto my-animation `} style={leftDrawerOpened && !matchDownMd ? animateStyle : {}}>
        <Box
          sx={{
            width: 260,
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              width: 'auto'
            }
          }}
          className="h-full flex justify-between"
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }} className="m-3 pl-3">
            <LogoSection />
          </Box>
          <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }} className="mr-2 max-lg:ml-3">
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                '&:hover': {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light
                }
              }}
              onClick={handleLeftDrawerToggle}
              color="inherit"
              className={`text-[#666] bg-[#EEE] hover:bg-[#49C401] hover:text-white ${matchDownMd && 'text-[#49c401]' }`}
            >
              <IconMenu2 stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Box>
      </div>

      {/* header search */}
      <SearchSection />
      {/* <Box sx={{ flexGrow: 1 }} >{Page[0] +" " + Page[1]}</Box> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
