import * as React from "react";
import AppContext from "./AppContext";
import {List, ListItem, ListItemIcon, ListItemText, Typography, withStyles} from "@material-ui/core";
import {AlternateEmail, Language} from "@material-ui/icons";


class RoomsList extends React.Component{
    static contextType = AppContext;

    handleRoomClick(roomId){
        this.props.onChangeRoom(roomId);
    }
    render() {

        const {classes} = this.props;
        if(this.props.rooms == null || this.props.rooms.length === 0){
            return(<Typography variant="subtitle2" align="center">Комнат пока нет...</Typography>);
        }else {
            return (<List>
                {this.props.rooms.map((item) => (
                    <ListItem selected={this.props.currentRoom === item.id} onClick={() => this.handleRoomClick(item.id)} key={item.id} button>
                        <ListItemIcon>
                            {item.is_global === 1 ? <Language/> : <AlternateEmail/>}
                        </ListItemIcon>
                        <ListItemText>
                            <span className={classes.room}>{item.login != null ? item.login : item.name}</span>
                        </ListItemText>
                    </ListItem>
                ))}

            </List>);
        }
    }

}

const styles = {
    room:{
        "text-overflow":"ellipsis",
        "white-space":"nowrap",
        "display":"block",
        "width":"100%",
        "overflow":"hidden"
    }
};
export default withStyles(styles)(RoomsList);