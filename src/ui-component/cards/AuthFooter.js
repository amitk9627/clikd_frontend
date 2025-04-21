// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="http://www.aaveg.com/" target="_blank" underline="hover">
      Aaveg-Shuttle
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://www.wticabs.com/" target="_blank" underline="hover">
      WTI cabs
    </Typography>
  </Stack>
);

export default AuthFooter;
