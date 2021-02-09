import * as React from "react";
import TokenContext from "./AppContext";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, withStyles} from "@material-ui/core";
import UserPopover from "./UserPopover";

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
        if(this.props.users == null)return(<List/>);
        return(<div><List>
            {this.props.users.map((user)=>(
            <ListItem button key={user.id} onClick={(event)=>this.handleClick(event,user.id)}
                      onContextMenu={(event)=>this.handleClick(event,user.id)}>
                <ListItemAvatar>
                    <Avatar alt={user.login} src={"https://rp-ruler.ru/upload/"+user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.login}/>
            </ListItem>
            ))}
        </List>
        <UserPopover open={this.state.popoverOpen}
                     onClose={this.handleClose}
                     onWriteToUser={(event)=>this.handleWriteClick(event,this.state.clickedUser.id)}
                     anchorEl={this.state.anchorEl}
                     user={this.state.clickedUser}
                     doWrite={this.state.clickedUser != null && this.context.user_id != this.state.clickedUser.id}
        />
        </div>)
    }
}

const styles = {

};
export default withStyles(styles)(UsersList);