import * as React from "react";
import AppContext from "./AppContext";
import {
    Accordion, AccordionDetails, AccordionSummary,
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
import {
    AlternateEmail,
    Delete,
    Edit,
    ExitToApp, ExpandMore,
    Language,
    More,
    Notifications,
    NotificationsOff
} from "@material-ui/icons";
import AddRoomDialog from "./AddRoomDialog";
import {Alert} from "@material-ui/lab";
import {AlertWarning} from "material-ui/svg-icons/index.es";
import Reorder, {reorder} from "react-reorder";
import Utils from "./Utils";


class RoomsList extends React.Component{
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            anchorEl:null,
            clickedRoomId:null,
            isEditOpen:false,
            clickedRoom:null,
            categoryAnchorEl:null,
            clickedCategoryId:null
        };
        this.handleRoomContext = this.handleRoomContext.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.handleChangeNotifications = this.handleChangeNotifications.bind(this);
        this.handleReorder = this.handleReorder.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
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

        let clickedRoom = Utils.getElById(this.props.rooms,id);
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
            .then((data)=>{
                this.setState({anchorEl:null,clickedRoomId:null});
                this.props.onRoomsUpdate();
            })
    }



    deleteCategory(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&category_id="+this.state.clickedCategoryId
        };
        fetch("https://rp-ruler.ru/api/delete_category.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.setState({categoryAnchorEl:null,clickedCategoryId:null});
                this.props.onCategoriesUpdate();
                this.props.onRoomsUpdate();
            })
    }

    handleReorder (event, previousIndex, nextIndex, fromId, toId) {
        if(previousIndex === nextIndex && fromId === toId)return;
        let toCat = toId.replace("cat-","");
        if(toCat === "null")toCat = null;

        let fromCat = fromId.replace("cat-","");
        if(fromCat === "null")fromCat = null;

        let roomId = this.props.rooms.filter(room => room.category_id == fromCat)[previousIndex].id;


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+roomId+"&category_id="+toCat+"&order="+nextIndex
        };
        fetch("https://rp-ruler.ru/api/set_room_category.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.props.onRoomsUpdate();
            })


    }

    render() {
        const {classes} = this.props;
        let canEditRooms = (this.props.admin || this.props.role.room_edit) && !this.props.isChat;
        if((this.props.rooms == null || this.props.rooms.length === 0) && (this.props.categories == null || this.props.categories.length === 0)){
            return(<Typography variant="subtitle2" align="center">Комнат пока нет...</Typography>);
        }else {
            return (<div>
                {this.props.categories.map((category) => (
                    <Accordion>
                        <AccordionSummary
                            onContextMenu={(e) => this.setState({categoryAnchorEl:e.currentTarget,clickedCategoryId:category.id})}
                            expandIcon={<ExpandMore />}
                        ><Typography>{category.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{padding:"5px 0px"}}>

                        <Reorder
                            reorderId={"cat-"+category.id} // Unique ID that is used internally to track this list (required)
                            reorderGroup="roomsReorder"
                            lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                            holdTime={100} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                            touchHoldTime={500} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
                            mouseHoldTime={100} // Hold time before dragging begins with mouse (optional), defaults to holdTime
                            autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                            disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
                            onReorder={this.handleReorder}
                            component={List}
                            disabled={!this.props.admin && !this.props.role.room_edit}
                            style={{width:"100%"}}
                            placeholder={
                                <ListItem className={classes.dragPlaceholder} fullwidth button/>
                            }
                        >
                            {this.props.rooms.filter(room => room.category_id === category.id).map((room) => (
                                <ListItem style={{zIndex:1}} fullwidth onContextMenu={(event) =>  this.handleRoomContext(event,room.id)}
                                          selected={this.props.currentRoom === room.id} onClick={() => this.handleRoomClick(room.id)} key={room.id} button>
                                    <ListItemIcon>
                                        <Badge anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }} color="primary" badgeContent={"+"+room.is_unread} invisible={!(room.is_unread > 0)}>
                                            {room.is_global === 1 ? <Language/> : <AlternateEmail/>}
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText>
                                        <span className={classes.room}>{room.login ?? room.name}</span>
                                    </ListItemText>
                                    {room.is_muted ? <NotificationsOff opacity={0.7}/> : ""}

                                </ListItem>
                            ))}
                        </Reorder>

                    </AccordionDetails>
                    </Accordion>
                ))}

                <Reorder
                    reorderId="cat-null" // Unique ID that is used internally to track this list (required)
                    reorderGroup="roomsReorder"
                    lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                    holdTime={300} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                    touchHoldTime={500} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
                    mouseHoldTime={200} // Hold time before dragging begins with mouse (optional), defaults to holdTime
                    autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                    disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
                    onReorder={this.handleReorder}
                    component={List}
                    disabled={!this.props.admin && !this.props.role.room_edit}
                    style={{width:"100%"}}
                    placeholder={
                        <ListItem className={classes.dragPlaceholder} fullwidth button/>
                    }
                >
                    {this.props.rooms.filter(room => room.category_id == null).map((room) => (
                        <ListItem style={{zIndex:1}} fullwidth onContextMenu={(event) =>  this.handleRoomContext(event,room.id)}
                                  selected={this.props.currentRoom === room.id} onClick={() => this.handleRoomClick(room.id)} key={room.id} button>
                            <ListItemIcon>
                                <Badge anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }} color="primary" badgeContent={"+"+room.is_unread} invisible={!(room.is_unread > 0)}>
                                    {room.is_global === 1 ? <Language/> : <AlternateEmail/>}
                                </Badge>
                            </ListItemIcon>
                            <ListItemText>
                                <span className={classes.room}>{room.login ?? room.name}</span>
                            </ListItemText>
                            {room.is_muted ? <NotificationsOff opacity={0.7}/> : ""}

                        </ListItem>
                    )) }
                </Reorder>

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
                {canEditRooms ? <MenuItem className={classes.delete} onClick={this.deleteRoom}>
                    Удалить комнату<Delete className={classes.icon}/></MenuItem> : ""}
                {canEditRooms ? <MenuItem className={classes.edit} onClick={() => this.setState({isEditOpen:true,anchorEl:null})}>
                    Редактировать <Edit className={classes.icon}/></MenuItem> : ""}
                <MenuItem className={classes.notifications} onClick={this.handleChangeNotifications}>
                    <Notifications className={classes.icon}/>{this.state.clickedRoom != null && this.state.clickedRoom.is_muted ? "Включить уведомления" : "Отключить уведомления"}</MenuItem>
            </Menu>
                {canEditRooms ?<Menu
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: 'center',
                    }}

                    getContentAnchorEl={null}
                    anchorEl={this.state.categoryAnchorEl}
                    keepMounted
                    open={Boolean(this.state.categoryAnchorEl)}
                    onClose={() => this.setState({categoryAnchorEl:null})}
                >
                     <MenuItem className={classes.delete} onClick={this.deleteCategory}>
                        Удалить категорию<Delete className={classes.icon}/></MenuItem>
                </Menu>: ""}
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
            </div>);
        }
    }

}

const styles = {
    dragPlaceholder:{
        height:"48px",
        "z-index":0,
        border:"2px dashed #999"
    },
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
    menu:{
        width:"400px"
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