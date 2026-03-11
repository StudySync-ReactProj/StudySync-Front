import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";
import { Alert as MuiAlertComp, Typography } from '@mui/material';
import { snackbarSx, alertSx, alertTitleStyle } from './Notifications.style';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({ open, title, message, severity, onClose, autoHideDuration = 3500 }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={snackbarSx}
        >
            <Alert onClose={onClose} severity={severity} sx={alertSx}>
                {title ? <Typography sx={alertTitleStyle}>{title}</Typography> : null}
                <div>{message}</div>
            </Alert>
        </Snackbar>
    );
}