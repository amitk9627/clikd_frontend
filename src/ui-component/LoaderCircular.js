import { CircularProgress } from '@mui/material';
// material-ui

import { styled } from '@mui/material/styles';

// styles
const LoaderWrapper = styled('div')({
  position: 'fixed',
  top: '50%',
  left: '50%',
  zIndex: 1301,
  width: '50%'
});

// ==============================|| LOADER ||============================== //
const LoaderCircular = () => (
  <div className="w-[100vw] h-[110vh]  absolute top-0 z-50 opacity-70">
    <LoaderWrapper>
      <CircularProgress color="primary" className="opacity-95" />
    </LoaderWrapper>
  </div>
);

export default LoaderCircular;
