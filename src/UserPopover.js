import * as React from "react";
import {Avatar, Button, Popover, Typography, withStyles} from "@material-ui/core";

class UserPopover extends React.Component {


    render() {
        const {classes} = this.props;
        if(this.props.user == null)return(<div/>);
        return(<Popover
            open={this.props.open}
            anchorEl={this.props.anchorEl}
            onClose={this.props.onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <div className={classes.rootUser}>
            <Avatar className={classes.avatar} alt={this.props.user.login} src={"https://rp-ruler.ru/upload/"+this.props.user.avatar}/>
            <Typography variant="h6">{this.props.user.login}</Typography>
            <Typography paragraph={true} variant="caption" >{this.props.user.status}</Typography>
                <Button onClick={this.props.onWriteToUser} variant="contained" color="primary">
                    Написать
                </Button>
            </div>
        </Popover>);
    }
}

const styles = {
    rootUser:{
        "text-align":"center",
        "width":"200px",
        'padding':"20px"

    },
    avatar:{
        "margin":"auto",
        "width":"80px",
        "height":"80px",
    }
};
export default withStyles(styles)(UserPopover);