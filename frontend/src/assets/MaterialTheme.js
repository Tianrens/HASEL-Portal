import { adaptV4Theme, createTheme } from '@mui/material/styles';

const theme = createTheme(adaptV4Theme({
    palette: {
        primary: {
            main: '#00467F',
        },
        secondary: {
            main: '#0080A7',
        },
    },
}));

export default theme;
