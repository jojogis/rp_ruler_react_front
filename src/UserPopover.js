import * as React from "react";
import {
    Avatar,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    Typography,
    withStyles
} from "@material-ui/core";
import {blue, cyan, green, lime, orange, pink, purple, red, yellow} from "@material-ui/core/colors";
import TokenContext from "./AppContext";
import Utils from "./Utils";

class UserPopover extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.handleRoleChange = this.handleRoleChange.bind(this);
    }

    handleRoleChange(e){

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token=" + this.context.token + "&server_id=" + this.props.server.id + "&user_id="+this.props.user.id+"&role_id="+e.target.value
        };
        fetch("https://rp-ruler.ru/api/set_user_role.php", requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.props.onClose();
                this.props.onMessagesUpdate();
                this.props.onUsersUpdate();
            })


    }

    render() {
        const {classes} = this.props;
        if(this.props.user == null)return(<div/>);
        let role_id = this.props.user.role_id;
        let canChangeRole = this.props.user.role_order > this.props.role.role_order;

        let curRole = Utils.getElById(this.props.server.roles,role_id);
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
            <Avatar className={classes.avatar} alt={this.props.user.login} src={Utils.uploadDir+this.props.user.avatar}/>
            <Typography variant="h6">{this.props.user.login}</Typography>
                {curRole != null ? <Typography variant="subtitle1" className={classes[curRole.color+"Text"]}>{curRole.name}</Typography>: ""}
            <Typography paragraph={true} variant="caption" >{this.props.user.status}</Typography>
                {this.props.doWrite ? <Button onClick={this.props.onWriteToUser} variant="contained" color="primary">
                    Написать
                </Button> : ""}

                {canChangeRole ? <FormControl className={classes.roleSelect} fullWidth>
                    <InputLabel id="role-select-label">Роль</InputLabel>
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        className={curRole != null ? classes[curRole.color+"Text"] : ""}
                        onChange={this.handleRoleChange}
                        value={role_id}
                    >
                        {this.props.server.roles.map((role) => (<MenuItem disabled={role.role_order <= this.props.role.role_order} className={classes[role.color+"Text"]} value={role.id}>{role.name}</MenuItem>) )}

                    </Select>
                </FormControl> : ""}

            </div>
        </Popover>);
    }
}

const styles = {
    roleSelect:{
        marginTop:"20px"
    },
    rootUser:{
        "text-align":"center",
        "width":"200px",
        'padding':"20px"

    },
    avatar:{
        "margin":"auto",
        "width":"80px",
        "height":"80px",
    },
    redText:{
        color:red[400]
    },
    pinkText:{
        color:pink[400],
    },
    purpleText:{
        color:purple[400],
    },
    limeText:{
        color:lime[400],
    },
    blueText:{
        color:blue[400],
    },
    cyanText:{
        color:cyan[400],
    },
    greenText:{
        color:green[400],
    },
    yellowText:{
        color:yellow[400],
    },
    orangeText:{
        color:orange[400],
    }
};
export default withStyles(styles)(UserPopover);