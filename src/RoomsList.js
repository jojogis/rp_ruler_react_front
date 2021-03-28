import * as React from "react";
import AppContext from "./AppContext";
import {
    Badge,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    withStyles
} from "@material-ui/core";
import {AlternateEmail, Delete, Edit, ExitToApp, Language, Notifications, NotificationsOff} from "@material-ui/icons";
import AddRoomDialog from "./AddRoomDialog";
import {Alert} from "@material-ui/lab";
import {AlertWarning} from "material-ui/svg-icons/index.es";


class RoomsList extends React.Component{
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            anchorEl:null,
            clickedRoomId:null,
            isEditOpen:false,
            clickedRoom:null
        };
        this.handleRoomContext = this.handleRoomContext.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.handleChangeNotifications = this.handleChangeNotifications.bind(this);
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
                this.props.onRoomsUpdate();
            })
    }

    handleRoomContext(event,id){
            let clickedRoom = this.getElById(this.props.rooms,id);
            this.setState({
                anchorEl:event.currentTarget,
                clickedRoomId:id,
                clickedRoom:clickedRoom
            });


    }

    handleChangeNotifications(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+this.state.clickedRoomId
        };
        fetch("https://rp-ruler.ru/api/change_alert.php",requestOptions)
            .then(response => response.json())
            .then(()=>{
                this.props.onChangeNotifications(this.state.clickedRoomId);
                this.setState({anchorEl:null,clickedRoomId:null});
            })
    }

    getElById(arr,id){
        if(arr === undefined)return null;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id)return arr[i];
        }
        return null;
    }

    render() {
        const {classes} = this.props;
        if(this.props.rooms == null || this.props.rooms.length === 0){
            return(<Typography variant="subtitle2" align="center">Комнат пока нет...</Typography>);
        }else {
            return (<List>
                {this.props.rooms.map((item) => (
                    <ListItem onContextMenu={(event) =>  this.handleRoomContext(event,item.id)}
                              selected={this.props.currentRoom === item.id} onClick={() => this.handleRoomClick(item.id)} key={item.id} button>
                        <ListItemIcon>
                            <Badge anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }} color="primary" badgeContent={"+"+item.is_unread} invisible={!(item.is_unread > 0)}>
                            {item.is_global === 1 ? <Language/> : <AlternateEmail/>}
                            </Badge>
                        </ListItemIcon>
                        <ListItemText>
                            <span className={classes.room}>{item.login != null ? item.login : item.name}</span>
                            {item.is_muted ? <NotificationsOff className={classes.notificationsDisabled}/> : ""}
                        </ListItemText>

                    </ListItem>
                ))}
                <Menu
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
                >
                    {this.props.admin ? <MenuItem className={classes.delete} onClick={this.deleteRoom}>
                    Удалить комнату<Delete className={classes.icon}/></MenuItem> : ""}
                    {this.props.admin ? <MenuItem className={classes.edit} onClick={() => this.setState({isEditOpen:true,anchorEl:null})}>
                        Редактировать <Edit className={classes.icon}/></MenuItem> : ""}
                    <MenuItem className={classes.notifications} onClick={this.handleChangeNotifications}>
                         <Notifications className={classes.icon}/>{this.state.clickedRoom != null && this.state.clickedRoom.is_muted ? "Включить уведомления" : "Отключить уведомления"}</MenuItem>
                </Menu>
                {this.state.clickedRoom != null ? <AddRoomDialog
                    open={this.state.isEditOpen}
                    serverId={this.props.serverId}
                    onCreate={this.props.onRoomsUpdate}
                    roomId={this.state.clickedRoomId}
                    name={this.state.clickedRoom.name}
                    description={this.state.clickedRoom.description}
                    bg={this.state.clickedRoom.bg}
                    isGlobal={this.state.clickedRoom.is_global === 1}
                    onClose={() => this.setState({isEditOpen:false})}
                /> : ""}

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
    },
    notifications:{
        color:"#ccc",
        width:"250px"
    },
    edit:{
        color:"#ffc107",
        width:"250px"
    },
    notificationsDisabled:{
        position: "absolute",
        right: "10px",
        opacity:0.5,
        top:"10px"
    },
    delete:{
        color:"#f50057",

        width:"250px"
    },
    icon:{
        position:"absolute",
        right:"10px"
    }
};
export default withStyles(styles)(RoomsList);