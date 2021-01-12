import * as React from "react";
import TokenContext from "./AppContext";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, withStyles} from "@material-ui/core";

class UsersList extends React.Component{
    static contextType = TokenContext;

    render() {
        if(this.props.users == null)return(<List/>);
        return(<List>
            {this.props.users.map((user)=>(
            <ListItem button>
                <ListItemAvatar>
                    <Avatar alt={user.login} src={"https://rp-ruler.ru/upload/"+user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.login}/>
            </ListItem>
            ))}
        </List>)
    }
}

const styles = {

};
export default withStyles(styles)(UsersList);