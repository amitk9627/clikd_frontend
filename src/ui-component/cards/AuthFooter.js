// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://myportfolio-alpha-ten-22.vercel.app/" target="_blank" underline="hover">
      Amit-portfolio
    </Typography>
    <Typography
      variant="subtitle2"
      component={Link}
      href="https://www.linkedin.com/in/amit-kumar-2666b624b/"
      target="_blank"
      underline="hover"
    >
      Amit-Linkedin
    </Typography>
  </Stack>
);

export default AuthFooter;
