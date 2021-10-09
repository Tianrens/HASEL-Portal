import { createTheme } from '@mui/material/styles';
import colors from './_colours.module.scss';

const theme = createTheme({
    palette: {
        primary: {
            main: colors.purple700,
        },
        secondary: {
            main: colors.purple300,
        },
    },
});

export default theme;
