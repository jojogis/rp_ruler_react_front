import * as React from "react";
import {
    Avatar, Button,
    CssBaseline,
    Grid, LinearProgress, List, ListItem, ListItemAvatar, ListItemText,
    Paper, TextField,
    withStyles,
} from "@material-ui/core";
import MainMenu from "./MainMenu";
import TokenContext from "./AppContext";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import RoomsList from "./RoomsList";
import ServerName from "./ServerName";
import RoomAppBar from "./RoomAppBar";
import Messages from "./Messages";
import InputReplyMessage from "./InputReplyMessage";
import UsersList from "./UsersList";
import Emoji from "./Emoji";
import {Send} from "@material-ui/icons";



import { w3cwebsocket as W3CWebSocket } from "websocket";



class Chat extends React.Component{
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            serverId:0,
            roomId:null,
            servers:[],
            rooms:[],
            messages:[],
            lastReadMsg:0,
            replyTo:null,
            users:[],
            isChat:false,
            isLoading:false,
            messageText:"",
            inputFocused:false,
            role:{color:"default",msg_delete:0,msg_send:0,role_edit:0,role_order:1,server_edit:0,room_edit:0}
        }
        this.messageInput = React.createRef();
        this.isLoadingMessages = false;
        this.handleChangeServer = this.handleChangeServer.bind(this);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);
        this.loadRooms = this.loadRooms.bind(this);
        this.loadServers = this.loadServers.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.handleRemoveMessage = this.handleRemoveMessage.bind(this);
        this.readMessages = this.readMessages.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleCancelReply = this.handleCancelReply.bind(this);
        this.handleReplyChoose = this.handleReplyChoose.bind(this);
        this.handleToChatClick = this.handleToChatClick.bind(this);
        this.handleServerDisconnect = this.handleServerDisconnect.bind(this);
        this.handleWriteToUserClick = this.handleWriteToUserClick.bind(this);
        this.handleLoadMoreMessages = this.handleLoadMoreMessages.bind(this);
        this.handleSelectEmoji = this.handleSelectEmoji.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onSocketMessage = this.onSocketMessage.bind(this);
        this.loadRole = this.loadRole.bind(this);

    }

    handleWriteToUserClick(event,user_id){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&user_id="+user_id
        };
        fetch("https://rp-ruler.ru/api/get_chat_with_user.php",requestOptions)
            .then(response => response.json())
            .then((data)=> {
                if (data.error === undefined) {
                    this.state.room_id = data.result;
                    this.state.isChat = true;

                    this.loadRooms(data.result);
                }
            });
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
                this.setState({roomId:null,rooms:[],messages:[],users:[]});
                this.loadServers();
            });
    }

    loadRole(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&server_id="+this.state.serverId
        };
        fetch("https://rp-ruler.ru/api/get_user_role.php",requestOptions).then(response => response.json())
            .then((data)=>{
                this.setState({role:data.role});
            });
    }

    handleChangeServer(serverId){
        this.setState({serverId:serverId,isChat:false},() => {this.loadRooms();this.loadRole()});

    }

    handleChangeRoom(roomId){
        this.setState({roomId:roomId},() => {
            this.loadMessages();
            if(this.state.isChat)this.connectSocket();
            else this.loadUsers();
        });

    }

    handleToChatClick(){
        this.setState({serverId:0,isChat:true},() => this.loadRooms());
    }



    getElById(arr,id){
        if(arr === undefined)return null;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id)return arr[i];
        }
        return null;
    }



    loadRooms(choosedRoom){
        const serverId = this.state.isChat ? 0 : this.state.serverId;
        if(serverId === null)return;
        this.setState({isLoading:true});
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&server_id="+serverId
        };
        fetch("https://rp-ruler.ru/api/get_rooms.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    let roomId = null;
                    if(data.length > 0)roomId = data[0].id;

                    if(choosedRoom == null){
                        this.setState({rooms:data,roomId:roomId,isLoading:false},() => this.connectSocket());
                    }else{
                        this.setState({rooms:data,roomId:choosedRoom,isLoading:false},() => this.connectSocket());
                    }
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
        if(this.state.roomId == null){
            this.setState({users:[]})
            return;
        }
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
                    this.connectSocket();
                }
            })
    }

    handleLoadMoreMessages(){
        if(!this.isLoadingMessages)this.loadMessages(this.state.messages.length);
    }

    loadMessages(offset = 0){
        if(this.state.roomId == null){
            this.setState({messages:[]});
            return;
        }
        this.isLoadingMessages = true;
        this.setState({isLoading:true});
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&room_id="+this.state.roomId+"&offset="+offset
        };
        fetch("https://rp-ruler.ru/api/get_messages.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    let newReplyTo = null;
                    if(offset != 0){
                        let newMessages = this.state.messages;
                        newMessages.unshift(...data.messages);
                        this.setState({messages:newMessages,lastReadMsg:data.last_read,replyTo:newReplyTo,isLoading:false});
                    }else{
                        this.setState({messages:data.messages,lastReadMsg:data.last_read,replyTo:newReplyTo,isLoading:false});
                    }
                    this.isLoadingMessages = false;
                }

            })
    }

    handleFocus(){
        this.readMessages();
        this.setState({inputFocused:true});
    }

    readMessages(){
        if(this.state.messages != null && this.state.messages.length !== 0 && this.state.lastReadMsg !== this.state.messages.slice(-1)[0].id) {
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
            this.getElById(this.state.rooms,this.state.roomId).is_unread = 0;
        }
    }



    onSocketOpen(){
        console.log("socket connected");
    }
    onSocketMessage(message){
        let data = JSON.parse(message.data);
        console.log(data);

        if(data.message != null){
            let newMessages = [...this.state.messages];
            if(this.getElById(this.state.messages,data.message.id) == null){
                newMessages.push(data.message);
            }
            console.log(data.message.sender_id);
            console.log(this.context.user_id*1);
            if(data.message.sender_id != this.context.user_id*1)this.popsound.play();
            this.setState({messages: newMessages});
        }
        if(data.left_user != null){
            this.setState((state) => {
                let newUsers = [...state.users];
                this.removeElById(newUsers,data.left_user);
                return {
                    users:newUsers
                }
            });
        }
        if(data.joined_user != null){

            this.setState((state) => {
                let newUsers = [...state.users];
                if(this.getElById(newUsers,data.joined_user.id) == null)newUsers.unshift(data.joined_user);
                return {
                    users:newUsers
                }
            });
        }
        if(data.remove_message != null){

            this.setState((state) => {
                let newMessages = [...state.messages];
                this.removeElById(newMessages,data.remove_message);
                return {
                    messages:newMessages
                }
            });
        }
        if(data.unread_room != null){
            let newRooms = [...this.state.rooms];
            let unreadRoom = this.getElById(newRooms,data.unread_room*1);
            console.log(unreadRoom.is_unread);
            if(unreadRoom != null)unreadRoom.is_unread = (unreadRoom.is_unread*1 || 0) + 1;
            this.setState( {
                    rooms:newRooms
                });
            if(!unreadRoom.is_muted)this.popsound.play();
        }

    }



    connectSocket(){
        if(this.client != null){
            this.client.close();
            this.client = null;
        }
        this.client = new W3CWebSocket('wss://rp-ruler.ru:8084?token='+this.context.token+"&room_id="+this.state.roomId);
        this.client.onopen = this.onSocketOpen;
        this.client.onmessage = this.onSocketMessage;
    }

    componentDidMount() {
        this.popsound = new Audio('https://rp-ruler.ru/sounds_water_droplet_3.mp3');
        this.popsound.load();
        this.popsound.volume = 0.6;

        this.loadServers();
        this.loadRooms();

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
        if(this.client != null){
            this.client.send(JSON.stringify({
                removeMsg:id
            }));
        }else {//фолбек до POST, нужно ли?

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "token=" + this.context.token + "&msg_id=" + id
            };
            fetch("https://rp-ruler.ru/api/remove_message.php", requestOptions)
                .then(response => response.json())
                .then((data) => {
                })
        }
    }

    handleKeyDown(event){
        this.readMessages();
        if(event.key === "Enter" && !event.shiftKey){
            event.preventDefault();
            const msgText = encodeURIComponent(event.target.value);
            if(msgText.length > 0) {
                this.sendMessage(msgText);
            }
        }
    }

    sendMessage(msg){
        if(this.client != null){
            this.client.send(JSON.stringify({
                text:msg,
                reply_id:this.state.replyTo
            }));
            this.setState({replyTo: null});
            this.messageInput.current.value = null;

        }else {//фолбек до POST, нужно ли?
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "token=" + this.context.token + "&room_id=" + this.state.roomId + "&text=" + msg + "&reply_id=" + this.state.replyTo
            };
            fetch("https://rp-ruler.ru/api/send_message.php", requestOptions)
                .then(response => response.json())
                .then((data) => {
                    let newMessages = [...this.state.messages];
                    newMessages.push(data);
                    this.setState({lastReadMsg: data.id, messages: newMessages, replyTo: null});
                    this.messageInput.current.value = null;
                })
        }
    }

    handleSelectEmoji(emoji){
        this.messageInput.current.value += emoji.native;

        this.setState({inputFocused:true});
    }

    handleBlur(){
        if(this.messageInput.current.value.length === 0){
///this.setState({inputFocused:null});
        }
        this.setState({inputFocused:null});
    }


    render() {
        const {classes} = this.props;

        const curServer = this.getElById(this.state.servers,this.state.serverId);
        let serverName = "";
        let adminId = null;
        if(curServer != null){
            serverName = curServer.name;
            adminId = curServer.admin_id;
        }
        const room = this.getElById(this.state.rooms,this.state.roomId);
        let labelText = "Писать некуда...";
        let roomName = "";
        let roomDescription = "";
        let bg = "";
        if(room != null){
            let writeTo = this.state.isChat ? "Написать " : "Написать в ";
            roomName = room.login != null ? room.login : room.name;
            labelText = this.state.replyTo==null ? writeTo + roomName.toLowerCase() :
                "Написать в ответ "+this.getElById(this.state.messages,this.state.replyTo).login;
            bg = "url(https://rp-ruler.ru/upload/" + room.bg+")";
            roomDescription = room.description;
        }
        const replyText = this.state.replyTo==null ? null : this.getElById(this.state.messages,this.state.replyTo).text;
        const replyLogin = this.state.replyTo==null ? null : this.getElById(this.state.messages,this.state.replyTo).login;
        return(

            <Grid className={classes.wrap} container spacing={1} onContextMenu={(event) => {event.preventDefault()}}>

                <CssBaseline />
                {this.state.isLoading ? <LinearProgress className={classes.loading}/> : ""}
                <Grid justify="center" container item xs={1} spacing={0}>

                    <MainMenu servers={this.state.servers}
                              onServerConnect={this.loadServers}
                              onChangeServer={this.handleChangeServer}
                              onToChatClick={this.handleToChatClick}
                              currentServer={this.state.serverId}
                    />
                </Grid>
                <Grid justify="center" container item xs={2} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1} >
                        <ServerName isChat={this.state.isChat}
                                    serverId={this.state.serverId}
                                    name={serverName}
                                    onWriteToUser={this.handleWriteToUserClick}
                                    onUsersUpdate={this.loadUsers}
                                    onMessagesUpdate={this.loadMessages}
                                    server={curServer}
                                    updateServers={() => this.loadServers()}
                                    onRoomCreate={() => this.loadRooms()}
                                    admin={adminId == this.context.user_id*1}
                                    role={this.state.role}
                                    onServerDisconnect={this.handleServerDisconnect}/>
                        {(this.state.rooms !== undefined) ?
                            <RoomsList admin={adminId == this.context.user_id*1}
                                       currentRoom={this.state.roomId}
                                       rooms={this.state.rooms}
                                       role={this.state.role}
                                       onRoomsUpdate={this.loadRooms}
                                       serverId={this.state.serverId}
                                       onChangeRoom={this.handleChangeRoom}/> : ""}
                    </Paper>
                </Grid>
                <Grid justify="center" container item xs={this.state.isChat ? 9 : 7} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1}  >

                        <RoomAppBar className={classes.appBar} name={roomName} description={roomDescription}/>

                        <Messages messages={this.state.messages}
                                  onRemoveMessage={this.handleRemoveMessage}
                                  onReplyChoose={this.handleReplyChoose}
                                  bg={bg}
                                  replyTo={this.state.replyTo}
                                  loadMoreMessages={this.handleLoadMoreMessages}
                                  online={this.state.users}
                                  role={this.state.role}
                                  lastRead={this.state.lastReadMsg}/>
                        <Paper elevation={4} className={classes.messageInputWrap}>
                            <InputReplyMessage onCancel={this.handleCancelReply} replyText={replyText} replyLogin={replyLogin}/>
                            <TextField
                                id="filled-textarea"
                                label={labelText}
                                disabled={!this.state.role.msg_send}
                                placeholder="Введите сообщение"
                                onKeyDown={this.handleKeyDown}
                                multiline
                                onFocus={this.handleFocus}
                                fullWidth
                                onBlur={this.handleBlur}
                                focused={this.state.inputFocused}
                                rowsMax={8}
                                color="black"
                                className={classes.messageInput}
                                variant="filled"
                                inputRef={this.messageInput}
                            />
                            <Emoji isDarkTheme={this.props.isDarkTheme} onSelect={this.handleSelectEmoji}/>
                            <Button onClick={() => {if(this.messageInput.current)this.sendMessage(this.messageInput.current.value)}} className={classes.sendBtn}><Send/></Button>
                        </Paper>

                    </Paper>

                </Grid>
                {!this.state.isChat ? <Grid justify="center" container item xs={2} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1} >
                        <UsersList
                            onWriteToUser={this.handleWriteToUserClick}
                            onUsersUpdate={this.loadUsers}
                            onMessagesUpdate={this.loadMessages}
                            server={curServer}
                            role={this.state.role}
                            users={this.state.users}/>
                    </Paper>
                </Grid> : ""}


            </Grid>
        );
    }
}


const styles = {
        sendBtn:{
            position:"absolute",
            bottom:"10px",
            right:"5px",
            opacity:0.7
        },
        loading:{
            width:"100%",
            position:"fixed",
            top:"0"
        },
        wrap: {
            padding:"10px 5px",
            width:"100vw",
            height:"100vh"
        },
        paperWrap:{
            width:"100%",
            position: "relative",
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
            width:"100%",
            zIndex:10
        },


    }
;
export default withStyles(styles)(Chat);