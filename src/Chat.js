import * as React from "react";
import {
    Avatar,
    CssBaseline,
    Grid, List, ListItem, ListItemAvatar, ListItemText,
    Paper, TextField,
    withStyles,
} from "@material-ui/core";
import MainMenu from "./MainMenu";
import TokenContext from "./AppContext";
import {ExitToApp, ExpandMore, Language, Message} from "@material-ui/icons";
import RoomsList from "./RoomsList";
import ServerName from "./ServerName";
import RoomAppBar from "./RoomAppBar";
import Messages from "./Messages";
import InputReplyMessage from "./InputReplyMessage";
import UsersList from "./UsersList";


class Chat extends React.Component{
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            serverId:null,
            roomId:null,
            servers:[],
            rooms:[],
            messages:[],
            lastReadMsg:0,
            replyTo:null,
            users:[]
        }
        this.lastUpdateTs = new Date().getTime();
        this.handleChangeServer = this.handleChangeServer.bind(this);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);
        this.loadRooms = this.loadRooms.bind(this);
        this.loadServers = this.loadServers.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.updateChat = this.updateChat.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.handleRemoveMessage = this.handleRemoveMessage.bind(this);
        this.readMessages = this.readMessages.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleCancelReply = this.handleCancelReply.bind(this);
        this.handleReplyChoose = this.handleReplyChoose.bind(this);
        this.handleServerDisconnect = this.handleServerDisconnect.bind(this);
    }

    updateChat(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+this.state.roomId+"&ts="+this.lastUpdateTs
        };
        fetch("https://rp-ruler.ru/api/get_updates.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){

                    if(data.messages.length > 0){
                        this.lastUpdateTs = new Date().getTime();
                        let newMessages = [...this.state.messages];
                        data.messages.forEach((item)=>{
                            if(this.getElById(this.state.messages,item.id) == null){
                                newMessages.push(item);
                            }
                        })
                        this.setState({messages: newMessages});
                    }
                    if(data.joined_users.length > 0){
                        this.lastUpdateTs = new Date().getTime();
                        let newUsers = [...this.state.users];
                        data.joined_users.forEach((item)=>{
                            if(this.getElById(this.state.users,item.id) == null){
                                newUsers.push(item);
                            }
                        })
                        this.setState({users: newUsers});
                    }
                    if(data.left_users.length > 0){
                        this.lastUpdateTs = new Date().getTime();
                        let newUsers = [...this.state.users];
                        data.left_users.forEach((item)=>{
                            this.removeElById(newUsers,item.id);
                        })
                        this.setState({users: newUsers});
                    }
                }

            })
    }


    handleServerDisconnect(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&server_id="+this.state.serverId
        };
        fetch("https://rp-ruler.ru/api/disconnect_from_server.php",requestOptions).then(response => response.json())
            .then(()=>{
                this.loadServers();
            });
    }

    handleChangeServer(serverId){
        this.state.serverId = serverId;//так надо
        this.loadRooms();
    }

    handleChangeRoom(roomId){
        this.state.roomId = roomId;//так надо
        this.loadMessages();
        this.loadUsers();
    }



    getElById(arr,id){
        if(arr === undefined)return null;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id)return arr[i];
        }
        return null;
    }



    loadRooms(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&server_id="+this.state.serverId
        };
        fetch("https://rp-ruler.ru/api/get_rooms.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    let roomId = null;
                    if(data.length > 0)roomId = data[0].id;
                    this.setState({rooms:data,roomId:roomId});
                    this.loadMessages();
                    this.loadUsers();
                }

            })
    }

    loadServers(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token
        };
        fetch("https://rp-ruler.ru/api/get_users_servers.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    let serverId = null;
                    if(data.length > 0)serverId = data[0].id;
                    this.handleChangeServer(serverId);
                    this.setState({servers:data});
                }

            })
    }

    loadUsers(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+this.state.roomId
        };
        fetch("https://rp-ruler.ru/api/get_users_in_room.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    this.setState({users:data.users});
                }
            })
    }

    loadMessages(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+this.state.roomId
        };
        fetch("https://rp-ruler.ru/api/get_messages.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    let newReplyTo = null;
                    this.setState({messages:data.messages,lastReadMsg:data.last_read,replyTo:newReplyTo});
                }

            })
    }

    handleFocus(){
        this.readMessages();
    }

    readMessages(){
        if(this.state.messages != null && this.state.lastReadMsg !== this.state.messages.slice(-1)[0].id) {
            const id = this.state.messages.slice(-1)[0].id;
            this.setState({lastReadMsg: id});
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "token=" + this.context.token + "&room_id=" + this.state.roomId + "&msg_id=" + id
            };
            fetch("https://rp-ruler.ru/api/read_message.php", requestOptions)
                .then(response => response.json())
                .then((data) => {
                })
        }
    }

    componentDidMount() {
        this.loadServers();
        this.loadRooms();
        this.timerChat = setInterval(this.updateChat,1000);

    }

    componentWillUnmount() {
        clearInterval(this.timerChat);

    }

    removeElById(arr,id){
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id){
                arr.splice(i,1);
                return arr;
            }
        }
    }


    handleReplyChoose(id){
        this.setState({replyTo:id});
    }

    handleCancelReply(){
        this.setState({replyTo:null});
    }

    handleRemoveMessage(id){
        let newMessages = [...this.state.messages];
        newMessages = this.removeElById(newMessages,id);
        let newReplyTo = id != this.state.replyTo ? this.state.replyTo : null;
        this.setState({messages:newMessages,replyTo:newReplyTo});
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&msg_id="+id
        };
        fetch("https://rp-ruler.ru/api/remove_message.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{})
    }

    handleKeyDown(event){
        this.readMessages();
        if(event.key === "Enter" && !event.shiftKey){
            event.preventDefault();
            const msgText = event.target.value;
            event.target.value = null;
            if(msgText.length > 0) {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: "token=" + this.context.token + "&room_id=" + this.state.roomId + "&text=" + msgText + "&reply_id=" + this.state.replyTo
                };
                fetch("https://rp-ruler.ru/api/send_message.php", requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        let newMessages = [...this.state.messages];
                        newMessages.push(data);
                        this.setState({lastReadMsg: data.id,messages: newMessages,  replyTo: null});
                    })
            }
        }
    }



    render() {
        const {classes} = this.props;
        const curServer = this.getElById(this.state.servers,this.state.serverId);
        let serverName = "";
        if(curServer != null){
            serverName = curServer.name;
        }
        const room = this.getElById(this.state.rooms,this.state.roomId);
        const roomName = (room !== null) ? room.name : "";
        const labelText = this.state.replyTo==null ? "Написать в "+roomName.toLowerCase() :
            "Написать в ответ "+this.getElById(this.state.messages,this.state.replyTo).login;
        const replyText = this.state.replyTo==null ? null : this.getElById(this.state.messages,this.state.replyTo).text;
        const replyLogin = this.state.replyTo==null ? null : this.getElById(this.state.messages,this.state.replyTo).login;
        return(

            <Grid className={classes.wrap} container spacing={1} onContextMenu={(event) => {event.preventDefault()}}>
                <CssBaseline />
                <Grid justify="center" container item xs={1} spacing={0}>
                    <MainMenu servers={this.state.servers} onServerConnect={this.loadServers} onChangeServer={this.handleChangeServer}/>
                </Grid>
                <Grid justify="center" container item xs={2} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1} >
                        <ServerName name={serverName} onServerDisconnect={this.handleServerDisconnect}/>
                        {(this.state.rooms !== undefined) ?
                            <RoomsList rooms={this.state.rooms} onChangeRoom={this.handleChangeRoom}/> : ""}

                    </Paper>
                </Grid>
                <Grid justify="center" container item xs={7} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1} >

                        <RoomAppBar name={roomName}/>

                        <Messages messages={this.state.messages}
                                  onRemoveMessage={this.handleRemoveMessage}
                                  onReplyChoose={this.handleReplyChoose}
                                  replyTo={this.state.replyTo}
                                  lastRead={this.state.lastReadMsg}/>
                        <Paper elevation={4} className={classes.messageInputWrap}>
                            <InputReplyMessage onCancel={this.handleCancelReply} replyText={replyText} replyLogin={replyLogin}/>
                        <TextField
                            id="filled-textarea"
                            label={labelText}
                            placeholder="Введите сообщение"
                            onKeyDown={this.handleKeyDown}
                            multiline
                            onFocus={this.handleFocus}
                            fullWidth
                            rowsMax={8}
                            color="black"
                            className={classes.messageInput}
                            variant="filled"
                        />
                        </Paper>
                    </Paper>

                </Grid>

                <Grid justify="center" container item xs={2} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1} >
                        <UsersList users={this.state.users}/>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}


const styles = {
    wrap: {
        padding:"10px 5px",
        width:"100vw",
        height:"100vh"
    },
    paperWrap:{
        width:"100%",
        position: "relative"
    },
    exitServer:{
        color:"red"
    },
    messageInput:{
        "border-radius":"3px",
        overflow:"hidden",

    },
    messageInputWrap:{
        position:"absolute",
        bottom:"0px",
        width:"100%"
    },


}
;
export default withStyles(styles)(Chat);