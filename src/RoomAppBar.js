import * as React from "react";
import {AppBar, Toolbar, Typography, withStyles} from "@material-ui/core";

class RoomAppBar extends React.Component{
    render(){
        const {classes} = this.props;
        return(<AppBar color="default" position="static">
                    <Toolbar>
                        <Typography  variant="h6" noWrap>
                            {this.props.name}
                    </Typography>
                </Toolbar>
            </AppBar>);
    }
}

const styles = {


};
export default withStyles(styles)(RoomAppBar);