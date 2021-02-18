import * as React from "react";
import AppContext from "./AppContext";
import {List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Typography, withStyles} from "@material-ui/core";
import {AlternateEmail, Delete, ExitToApp, Language} from "@material-ui/icons";


class RoomsList extends React.Component{
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            anchorEl:null,
            clickedRoomId:null
        };
        this.handleServerContext = this.handleServerContext.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }
    handleRoomClick(roomId){
        this.props.onChangeRoom(roomId);
    }
    deleteRoom(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+this.state.clickedRoomId
        };
        fetch("https://rp-ruler.ru/api/delete_room.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.setState({anchorEl:null,clickedRoomId:null});
                this.props.onRoomDelete();
            })
    }
    handleServerContext(event,id){
        if(this.props.admin)this.setState({anchorEl:event.currentTarget,clickedRoomId:id});

    }
    render() {

        const {classes} = this.props;
        if(this.props.rooms == null || this.props.rooms.length === 0){
            return(<Typography variant="subtitle2" align="center">Комнат пока нет...</Typography>);
        }else {
            return (<List>
                {this.props.rooms.map((item) => (
                    <ListItem onContextMenu={(event) =>  this.handleServerContext(event,item.id)}
                              selected={this.props.currentRoom === item.id} onClick={() => this.handleRoomClick(item.id)} key={item.id} button>
                        <ListItemIcon>
                            {item.is_global === 1 ? <Language/> : <AlternateEmail/>}
                        </ListItemIcon>
                        <ListItemText>
                            <span className={classes.room}>{item.login != null ? item.login : item.name}</span>
                        </ListItemText>
                    </ListItem>
                ))}
                {this.props.admin ? <Menu
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: 'center',
                    }}
                    getContentAnchorEl={null}
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={() => this.setState({anchorEl:null})}
                ><MenuItem className={classes.delete} onClick={this.deleteRoom}>
                    Удалить комнату<Delete className={classes.icon}/></MenuItem></Menu> : ""}

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
    },   add:{
        color:"#00e676"
    },
    delete:{
        color:"#f50057",
        "padding-right":"50px"
    },
    icon:{
        position:"absolute",
        right:"10px"
    }
};
export default withStyles(styles)(RoomsList);