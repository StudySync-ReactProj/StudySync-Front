import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";

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
            sx={{ mt: 4 }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: 480, borderRadius: 2 }}>
                {title ? <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div> : null}
                <div>{message}</div>
            </Alert>
        </Snackbar>
    );
}