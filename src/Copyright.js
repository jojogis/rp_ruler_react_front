import {Link, Typography} from "@material-ui/core";
import * as React from "react";

export function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                RP Ruler
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
