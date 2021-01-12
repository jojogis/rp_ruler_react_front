import * as React from "react";
import AppContext from "./AppContext";
import {List, ListItem, ListItemIcon, ListItemText, withStyles} from "@material-ui/core";
import {AlternateEmail, Language} from "@material-ui/icons";


class RoomsList extends React.Component{
    static contextType = AppContext;

    handleRoomClick(roomId){
        this.props.onChangeRoom(roomId);
    }
    render() {

        const {classes} = this.props;
        return(<List>
            {this.props.rooms.map((item)=>(
                <ListItem onClick={() => this.handleRoomClick(item.id)} key={item.id} button>
                    <ListItemIcon>
                        {item.is_global === 1 ? <Language /> : <AlternateEmail/>}
                    </ListItemIcon>
                    <ListItemText >
                        <span className={classes.room}>{item.name}</span>
                    </ListItemText>
                </ListItem>
            ))}

        </List>);
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