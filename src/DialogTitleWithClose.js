import {DialogTitle, IconButton, Typography, withStyles} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import * as React from "react";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    rootNoPadding:{
        margin:0,
        padding: 0
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitleWithClose = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={props.noPadding ? classes.rootNoPadding : classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});
export default DialogTitleWithClose;