import * as React from "react";
import TokenContext from "./AppContext";
import {Avatar, Badge, List, ListItem, ListItemAvatar, ListItemText, withStyles} from "@material-ui/core";
import UserPopover from "./UserPopover";
import StyledBadge from "./StyledBadge";
import {blue, cyan, green, lime, orange, pink, purple, red, yellow} from "@material-ui/core/colors";



class UsersList extends React.Component{
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            popoverOpen:false,
            anchorEl:null,
            clickedUser:null
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleWriteClick = this.handleWriteClick.bind(this);
    }

    handleWriteClick(event,id){
        this.handleClose();
        this.props.onWriteToUser(event,id);

    }
    getElById(arr,id){
        if(arr === undefined)return null;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id)return arr[i];
        }
        return null;
    }

    handleClose(){
        this.setState({popoverOpen:false})
    }

    handleClick(event,id){
        this.setState({anchorEl:event.currentTarget,
            clickedUser:this.getElById(this.props.users,id),
            popoverOpen:true
        });
    }

    render() {
        const {classes} = this.props;
        if(this.props.users == null)return(<List/>);
        return(<div><List>
            {this.props.users.map((user)=>(
            <ListItem button key={user.id} onClick={(event)=>this.handleClick(event,user.id)}
                      onContextMenu={(event)=>this.handleClick(event,user.id)}>
                <ListItemAvatar>
                    <StyledBadge variant="dot"
                                 anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                 }}
                                 overlap="circle"
                                 invisible={user.online == 0}>
                        <Avatar alt={user.login} src={"https://rp-ruler.ru/upload/"+user.avatar} />
                    </StyledBadge>
                </ListItemAvatar>
                <ListItemText className={user.color != null ? classes[user.color+"Text"] : ""} primary={user.login}/>
            </ListItem>
            ))}
        </List>
        <UserPopover open={this.state.popoverOpen}
                     onClose={this.handleClose}
                     onWriteToUser={(event)=>this.handleWriteClick(event,this.state.clickedUser.id)}
                     anchorEl={this.state.anchorEl}
                     user={this.state.clickedUser}
                     server={this.props.server}
                     role={this.props.role}
                     onUsersUpdate={this.props.onUsersUpdate}
                     onMessagesUpdate={this.props.onMessagesUpdate}
                     doWrite={this.state.clickedUser != null && this.context.user_id != this.state.clickedUser.id}
        />
        </div>)
    }
}

const styles = {
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
export default withStyles(styles)(UsersList);