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
import {Add, Delete, Edit, ExitToApp, ExpandMore, Remove} from "@material-ui/icons";
import AddRoomDialog from "./AddRoomDialog";
import TokenContext from "./AppContext";
import {Alert} from "@material-ui/lab";

class ServerName extends React.Component{
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.state = {
            anchorEl:null,
            isAddRoomOpen:false,
            isConfirmDeleteOpen:false,
            snackBarOpen:false
        };
        this.handleServerMenuClick       = this.handleServerMenuClick.bind(this);
        this.handleServerMenuClose       = this.handleServerMenuClose.bind(this);
        this.handleServerDisconnectClick = this.handleServerDisconnectClick.bind(this);
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
                this.setState({isConfirmDeleteOpen:false,snackBarOpen:true});
                this.props.onServerDelete();
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
                    {this.props.admin ? <MenuItem className={classes.edit} onClick={this.handleServerDisconnectClick}>
                        Редактировать <Edit className={classes.icon}/></MenuItem> : ""}
                    {this.props.admin ? <MenuItem className={classes.add} onClick={() => this.setState({isAddRoomOpen:true,anchorEl:false})}>
                        Добавить комнату <Add className={classes.icon}/></MenuItem> : ""}
                    {this.props.admin ? <MenuItem className={classes.exitServer} onClick={() => this.setState({isConfirmDeleteOpen:true,anchorEl:false})}>
                        Удалить сервер <Delete className={classes.icon}/></MenuItem> : ""}
                </Menu>
                <AddRoomDialog
                    open={this.state.isAddRoomOpen}
                    serverId={this.props.serverId}
                    onCreate={this.props.onRoomCreate}
                    onClose={() => this.setState({isAddRoomOpen:false})}
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
                    <Snackbar open={this.state.snackBarOpen} autoHideDuration={3000} onClose={()=>this.setState({snackBarOpen:false})}>
                        <Alert severity="success" variant="filled" elevation={6}>
                            Сервер удален
                        </Alert>
                    </Snackbar>
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
        "padding-right":"50px"
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