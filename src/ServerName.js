import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Menu,
    MenuItem,
    Paper,
    Snackbar,
    withStyles
} from "@material-ui/core";
import {Add, Delete, Edit, ExitToApp, ExpandMore, ListAlt, Remove} from "@material-ui/icons";
import AddRoomDialog from "./AddRoomDialog";
import TokenContext from "./AppContext";
import {Alert} from "@material-ui/lab";
import AddServerDialog from "./AddServerDialog";
import UsersList from "./UsersList";
import AddCategoryDialog from "./AddCategoryDialog";

class ServerName extends React.Component{
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.state = {
            anchorEl:null,
            isAddRoomOpen:false,
            isConfirmDeleteOpen:false,
            isAddCategoryOpen:false,
            editOpen:false,
            usersListOpen:false,
            users:[]
        };
        this.handleServerMenuClick       = this.handleServerMenuClick.bind(this);
        this.handleServerMenuClose       = this.handleServerMenuClose.bind(this);
        this.handleServerDisconnectClick = this.handleServerDisconnectClick.bind(this);
        this.openUsersList               = this.openUsersList.bind(this);
        this.loadUsers                   = this.loadUsers.bind(this);
    }
    handleServerMenuClick(event){
        event.preventDefault();
        this.setState({anchorEl:event.currentTarget});
    }

    handleServerMenuClose(){
        this.setState({anchorEl:null});

    }

    handleServerDisconnectClick(){
        this.handleServerMenuClose();
        this.props.onServerDisconnect();

    }

    loadUsers(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token=" + this.context.token + "&server_id=" + this.props.serverId
        };
        fetch("https://rp-ruler.ru/api/get_users_on_server.php", requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.setState({users:data.users});
            })
    }

    openUsersList(){
        this.setState({usersListOpen:true});
        this.loadUsers();
    }
    deleteServer(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&server_id="+this.props.serverId
        };
        fetch("https://rp-ruler.ru/api/delete_server.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.setState({isConfirmDeleteOpen:false});
                this.context.showMessage("Сервер удален","success");
                this.props.updateServers();
            })
    }

    render() {

        const {classes} = this.props;
        if(this.props.isChat){
            return(<div><Button fullWidth onContextMenu={this.handleServerMenuClick} onClick={this.handleServerMenuClick}
                                aria-controls="fade-menu" aria-haspopup="true">
                личка
            </Button></div>);
        }else {
            return (
                <div><Button fullWidth onContextMenu={this.handleServerMenuClick} onClick={this.handleServerMenuClick}
                             aria-controls="fade-menu" aria-haspopup="true">
                    {this.props.name}<ExpandMore/>
                </Button><Menu
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
                    className={classes.paperWrap}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleServerMenuClose}
                >
                    <MenuItem className={classes.exitServer} onClick={this.handleServerDisconnectClick}>
                        Покинуть сервер <ExitToApp className={classes.icon}/></MenuItem>
                    <MenuItem className={classes.edit} onClick={() => {this.setState({editOpen:true});this.handleServerMenuClose()} }>
                        Настройки <Edit className={classes.icon}/></MenuItem>
                    {this.props.admin || this.props.role.room_edit ? <MenuItem className={classes.add} onClick={() => this.setState({isAddRoomOpen:true,anchorEl:false})}>
                        Добавить комнату <Add className={classes.icon}/></MenuItem> : ""}
                    {this.props.admin || this.props.role.room_edit ? <MenuItem className={classes.add} onClick={() => this.setState({isAddCategoryOpen:true,anchorEl:false})}>
                        Добавить категорию <Add className={classes.icon}/></MenuItem> : ""}
                    {this.props.admin ? <MenuItem className={classes.exitServer} onClick={() => this.setState({isConfirmDeleteOpen:true,anchorEl:false})}>
                        Удалить сервер <Delete className={classes.icon}/></MenuItem> : ""}
                    <MenuItem className={classes.edit} onClick={this.openUsersList}>
                        Список участников <ListAlt className={classes.icon}/></MenuItem>
                </Menu>
                <AddRoomDialog
                    open={this.state.isAddRoomOpen}
                    serverId={this.props.serverId}
                    onCreate={this.props.onRoomCreate}
                    onClose={() => this.setState({isAddRoomOpen:false})}
                />
                <AddCategoryDialog
                    open={this.state.isAddCategoryOpen}
                    onCreate={this.props.onCategoryCreate}
                    serverId={this.props.serverId}
                    onClose={() => this.setState({isAddCategoryOpen:false})}
                />
                    <Dialog open={this.state.isConfirmDeleteOpen} onClose={() => this.setState({isConfirmDeleteOpen:false})}>
                        <DialogTitle>Вы уверены?</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => this.setState({isConfirmDeleteOpen:false})} color="primary">
                                Отменить
                            </Button>
                            <Button onClick={() => this.deleteServer()} color="primary" autoFocus>
                                Удалить сервер
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog maxWidth="md" open={this.state.usersListOpen} onClose={() => this.setState({usersListOpen:false})}>
                        <UsersList  users={this.state.users}
                                    role={this.props.role}
                                    server={this.props.server}
                                    onWriteToUser={this.props.onWriteToUser}
                                    onUsersUpdate={() => {this.props.onUsersUpdate();this.loadUsers()}}
                                    onMessagesUpdate={this.props.onMessagesUpdate}
                        />
                    </Dialog>
                    {this.props.server != null ? <AddServerDialog
                        serverId={this.props.serverId}
                        name={this.props.server.name}
                        role={this.props.role}
                        description={this.props.server.description}
                        open={this.state.editOpen}
                        tags={this.props.server.tags}
                        age={this.props.server.age}
                        avatar={this.props.server.avatar}
                        bg={this.props.server.card_bg}
                        isPrivate={this.props.server.is_private}
                        roles={this.props.server.roles}
                        onClose={() => {this.setState({editOpen:false});this.props.updateServers(); }}/> : ""}

                </div>);
        }
    }
}

const styles = {
    add:{
        color:"#00e676"
    },
    paperWrap:{
        width:"100%",

    },
    exitServer:{
        color:"#f50057",
        "padding-right":"70px"
    },
    edit:{
        color:"#ffc107"
    },
    icon:{
        position:"absolute",
        right:"10px"
    }


};

export default withStyles(styles)(ServerName);