import * as React from "react";
import {
    Button, Chip,
    CssBaseline,
    Grid, LinearProgress,
    Paper, TextField,
    withStyles,
} from "@material-ui/core";
import MainMenu from "./MainMenu";
import TokenContext from "./AppContext";
import 'emoji-mart/css/emoji-mart.css'
import RoomsList from "./RoomsList";
import ServerName from "./ServerName";
import RoomAppBar from "./RoomAppBar";
import Messages from "./Messages";
import InputReplyMessage from "./InputReplyMessage";
import UsersList from "./UsersList";
import Emoji from "./Emoji";
import socketIOClient from "socket.io-client";
import {Send, VideogameAsset} from "@material-ui/icons";

import Utils from "./Utils";
import Api from "./Api";
import AbilitiesPopup from "./AbilitiesPopup";



class Chat extends React.Component{
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            categories:[],
            serverId:0,
            roomId:null,
            servers:[],
            rooms:[],
            messages:[],
            lastReadMsg:0,
            replyTo:null,
            users:[],
            isChat:true,
            isLoading:false,
            character:null,
            messageText:"",
            inputFocused:false,
            isAbilitiesOpen:false,
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
        this.handleToChatClick = this.handleToChatClick.bind(this);
        this.handleServerDisconnect = this.handleServerDisconnect.bind(this);
        this.handleWriteToUserClick = this.handleWriteToUserClick.bind(this);
        this.handleLoadMoreMessages = this.handleLoadMoreMessages.bind(this);
        this.handleSelectEmoji = this.handleSelectEmoji.bind(this);
        this.loadRole = this.loadRole.bind(this);
        this.loadCharacter = this.loadCharacter.bind(this);
        this.handleAddAbility = this.handleAddAbility.bind(this);


    }

    handleWriteToUserClick(event,user_id){
        Api.getRoomWithUser(this.context.token,user_id).then((data)=>{
            if (data.error === undefined) {
                this.state.room_id = data.roomId;
                this.state.isChat = true;
                this.loadRooms(data.roomId);
            }
        })

    }

    loadCharacter(){
        Api.getCharacter(this.context.token,this.state.serverId).then((data)=>{
            this.setState({character:data.character});
        })
    }

    handleServerDisconnect(){
        Api.disconnectFromServer(this.context.token,this.state.serverId).then((data)=>{
            this.setState({roomId:null,serverId:null,categories:[],rooms:[],messages:[],users:[]});
            this.loadServers();
        })
    }

    loadRole(){
        Api.getRole(this.context.token,this.state.serverId).then((data)=>{
            this.setState({role:data.role});
        })
    }

    handleChangeServer(serverId){
        this.setState({serverId:serverId,isChat:false,categories:[],rooms:[]},() => {this.loadRooms();this.loadRole();this.loadCharacter()});
    }

    handleChangeRoom(roomId){
        this.setState({roomId:roomId},() => {
            this.loadMessages();
            if(this.state.isChat)this.connectSocket();
            else this.loadUsers();
        });

    }

    handleToChatClick(){
        this.setState({serverId:0,isChat:true,categories:[],rooms:[]},() => this.loadRooms());
    }


    loadRooms(choosedRoom,justUpdate){
        const serverId = this.state.isChat ? 0 : this.state.serverId;
        if(serverId === null)return;

        Api.getRooms(this.context.token,serverId).then((data)=>{
            if(data.error === undefined){
                if(justUpdate === undefined || !justUpdate){
                    let roomId = this.state.roomId;
                    if(Utils.getElById(data.rooms,this.state.roomId) == null && data.rooms.length > 0)roomId = data.rooms[0].id;
                    else if(data.rooms.length == 0)roomId = null;
                    if(choosedRoom == null){
                        this.setState({rooms:data.rooms,categories:data.categories,roomId:roomId},() => this.connectSocket());
                    }else{
                        this.setState({rooms:data.rooms,categories:data.categories,roomId:choosedRoom},() => this.connectSocket());
                    }
                    this.loadMessages();
                    this.loadUsers();
                }else{
                    this.setState({rooms:data.rooms,categories:data.categories});
                }

            }else if(data.error === "invalid token")this.context.logout();
        })


    }

    loadServers(){
        Api.getServers(this.context.token).then((data)=>{
            if(data.error === undefined){
                this.setState({servers:data});
            }
        })
    }

    loadUsers(){
        if(this.state.roomId == null){
            this.setState({users:[]})
            return;
        }
        Api.getUsersInRoom(this.context.token,this.state.roomId).then((data)=>{
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
        Api.getMessages(this.context.token,this.state.roomId,offset).then((data)=>{
            if(data.error === undefined){
                let newReplyTo = null;
                if(offset != 0){
                    let newMessages = this.state.messages;
                    newMessages.unshift(...data.messages);
                    this.setState({messages:newMessages,lastReadMsg:data.lastRead,replyTo:newReplyTo,isLoading:false});
                }else{
                    this.setState({messages:data.messages,lastReadMsg:data.lastRead,replyTo:newReplyTo,isLoading:false});
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
            Api.readMessage(this.context.token,this.state.roomId,id).then((data)=>{})
            Utils.getElById(this.state.rooms,this.state.roomId).is_unread = 0;
        }
    }




    connectSocket(){
        if(this.client != null){
            this.client.close();
            this.client = null;
        }
        this.client = socketIOClient("https://rp-ruler.ru:8084",{
            query:{
                token:this.context.token,roomId:this.state.roomId
            }
        });

        this.client.emit("login",{token:this.context.token,roomId:this.state.roomId});

        this.client.on("message",(message)=>{
            let newMessages = [...this.state.messages];
            if(Utils.getElById(this.state.messages,message.id) == null){
                newMessages.push(message);
            }
            if(message.sender_id != this.context.user_id*1)this.popsound.play();
            this.setState({messages: newMessages});
        })

        this.client.on("delete_message",(data)=>{
            this.setState((state) => {
                let newMessages = [...state.messages];
                Utils.removeElById(newMessages,data.messageId);
                return {
                    messages:newMessages
                }
            });
        })

        this.client.on("new_user",(user)=>{
            this.setState((state) => {
                let newUsers = [...state.users];
                if(Utils.getElById(newUsers,user.id) == null)newUsers.unshift(user);
                return {
                    users:newUsers
                }
            });
        })

        this.client.on("left_user",(user)=>{
            this.setState((state) => {
                let newUsers = [...state.users];
                Utils.removeElById(newUsers,user.id);
                return {
                    users:newUsers
                }
            });
        })
        this.client.on("updateRooms",(data)=>{
            this.loadRooms(null,true);
        })
        this.client.on("updateUsers",(data)=>{
            this.loadUsers();
            this.loadMessages();
        })
        this.client.on("updateServers",(data)=>{
            this.loadServers();
        })
    }

    componentDidMount() {
        this.popsound = new Audio('https://rp-ruler.ru/sounds_water_droplet_3.mp3');
        this.popsound.load();
        this.popsound.volume = 0.6;
        this.loadServers();
        this.loadRooms();

    }





    handleRemoveMessage(id){
        let newMessages = [...this.state.messages];
        newMessages = Utils.removeElById(newMessages,id);
        let newReplyTo = id != this.state.replyTo ? this.state.replyTo : null;
        this.setState({messages:newMessages,replyTo:newReplyTo});
        if(this.client != null){
            this.client.emit("delete_message",{messageId:id});
        }else{
            this.context.showMessage("Ошибка соединения","error");
        }
    }

    handleKeyDown(event){
        this.readMessages();
        if(event.key === "Enter" && !event.shiftKey){
            event.preventDefault();

            let msgText = event.target.innerHTML;
            if(msgText?.length > 0) {
                this.sendMessage(msgText);
                event.target.innerHTML = "";
            }
        }
    }

    handleAddAbility(ability){
        let msg = "";
        if(this.state.messageText.length === 0){
            msg = '<b contenteditable="false" class="'+ability.color+'" data-id="'+ability.id+'">'+ability.name+'</b>';
        }else{
            msg = document.getElementById("filled-textarea").innerHTML += '<b contenteditable="false" class="'+ability.color+'" data-id="'+ability.id+'">'+ability.name+'</b>';
        }

        this.setState({messageText:msg})

    }

    sendMessage(msg){
        if(this.client != null){
            let reg = /<b contenteditable="false" class="([a-z]*)" data-id="(\d+)">([\W|\d]*)<\/b>/gm;
            let replacedMsg = msg.replace(reg,'@@{"id":"$2","name":"$3","color":"$1"}');
            replacedMsg = replacedMsg.replace(/&nbsp;/g," ");
            replacedMsg = encodeURIComponent(replacedMsg);
            this.client.emit("message",{text:replacedMsg,reply_id:this.state.replyTo});
            this.setState({replyTo: null,messageText:""});

        }else {
            this.context.showMessage("Ошибка соединения","error");
        }
    }

    handleSelectEmoji(emoji){

        let newText = this.state.messageText+emoji.native;
        this.setState({inputFocused:true,messageText:newText});
    }



    render() {
        const {classes} = this.props;

        const curServer = Utils.getElById(this.state.servers,this.state.serverId);
        let serverName = "";
        let adminId = null;
        if(curServer != null){
            serverName = curServer.name;
            adminId = curServer.admin_id;
        }
        const room = Utils.getElById(this.state.rooms,this.state.roomId);
        let labelText = "Писать некуда...";
        let roomName = "";
        let roomDescription = "";
        let bg = "";
        if(room != null){
            let writeTo = this.state.isChat ? "Написать " : "Написать в ";
            roomName = room.login != null ? room.login : room.name;
            labelText = this.state.replyTo==null ? writeTo + roomName.toLowerCase() :
                "Написать в ответ "+Utils.getElById(this.state.messages,this.state.replyTo).login;
            bg = "url("+Utils.uploadDir + room.bg+")";
            roomDescription = room.description;
        }
        const replyText = this.state.replyTo==null ? null : Utils.getElById(this.state.messages,this.state.replyTo).text;
        const replyLogin = this.state.replyTo==null ? null : Utils.getElById(this.state.messages,this.state.replyTo).login;
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
                        {this.state.serverId != null ? <ServerName isChat={this.state.isChat}
                                    serverId={this.state.serverId}
                                    name={serverName}
                                    onWriteToUser={this.handleWriteToUserClick}
                                    onUsersUpdate={this.loadUsers}
                                    onUpdateCharacter={this.loadCharacter}
                                    character={this.state.character}
                                    onMessagesUpdate={this.loadMessages}
                                    server={curServer}
                                    updateServers={this.loadServers}
                                    onRoomCreate={()=>this.loadRooms(null,true)}
                                    onCategoryCreate={()=>this.loadRooms(null,true)}
                                    admin={adminId == this.context.user_id*1}
                                    role={this.state.role}
                                    onServerDisconnect={this.handleServerDisconnect}/> : ""}
                        {(this.state.rooms !== undefined) ?
                            <RoomsList admin={adminId == this.context.user_id*1}
                                       currentRoom={this.state.roomId}
                                       rooms={this.state.rooms}
                                       isChat={this.state.isChat}
                                       role={this.state.role}
                                       categories={this.state.categories}
                                       onRoomsUpdate={()=>this.loadRooms(null,true)}
                                       onCategoriesUpdate={()=>this.loadRooms(null,true)}
                                       serverId={this.state.serverId}
                                       onChangeRoom={this.handleChangeRoom}/> : ""}
                    </Paper>
                </Grid>
                <Grid justify="center" container item xs={this.state.isChat ? 9 : 7} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1}  >

                        <RoomAppBar className={classes.appBar} name={roomName} description={roomDescription}/>

                        <Messages messages={this.state.messages}
                                  onRemoveMessage={this.handleRemoveMessage}
                                  onReplyChoose={(id) => this.setState({replyTo:id})}
                                  bg={bg}
                                  replyTo={this.state.replyTo}
                                  loadMoreMessages={this.handleLoadMoreMessages}
                                  online={this.state.users}
                                  role={this.state.role}
                                  lastRead={this.state.lastReadMsg}/>
                        <Paper elevation={this.state.inputFocused ? 10 : 4} className={classes.messageInputWrap}>
                            <InputReplyMessage onCancel={() => this.setState({replyTo:null})} replyText={replyText} replyLogin={replyLogin}/>
                            <div
                                id="filled-textarea"

                                placeholder="Введите сообщение"
                                onKeyDown={this.handleKeyDown}

                                onFocus={this.handleFocus}
                                contentEditable={!(!this.state.isChat && (!this.state.role?.msg_send || room == null))}
                                onBlur={(e) => this.setState({inputFocused:null,messageText:e.target.innerHTML})}
                                style={{outline:"none",minHeight:"60px",width:"100%",padding:"10px 20px "}}
                                color="black"
                                className={classes.messageInput}
                                dangerouslySetInnerHTML={{__html:this.state.messageText.length === 0 && !this.state.inputFocused ? '<div contentEditable="false" style="opacity:0.5">Введите сообщение</div>'
                                        :  this.state.messageText}}
                            />
                            <Button id="abilitiesBtn" onClick={() => this.setState({isAbilitiesOpen:true})} className={classes.playBtn}><VideogameAsset/></Button>
                            <Emoji isDarkTheme={this.props.isDarkTheme} onSelect={this.handleSelectEmoji}/>
                            <Button onClick={() => {if(this.state.messageText?.length > 0)this.sendMessage(this.state.messageText)}} className={classes.sendBtn}><Send/></Button>
                        </Paper>

                    </Paper>

                </Grid>

                <AbilitiesPopup
                    open={this.state.isAbilitiesOpen}
                    anchorEl={document.getElementById("abilitiesBtn")}
                    onClose={() => this.setState({isAbilitiesOpen:false})}
                    onAddAbility={this.handleAddAbility}
                />


                {!this.state.isChat ? <Grid justify="center" container item xs={2} spacing={0}>
                    <Paper className={classes.paperWrap} elevation={1} >
                        {room != null ? <UsersList
                            onWriteToUser={this.handleWriteToUserClick}
                            onUsersUpdate={this.loadUsers}
                            onMessagesUpdate={this.loadMessages}
                            server={curServer}
                            role={this.state.role}
                            users={this.state.users}/> : ""}
                    </Paper>
                </Grid> : ""}


            </Grid>
        );
    }
}

function MyInputComponent(props) {
    const { component: Component, inputRef, ...other } = props;

    // implement `InputElement` interface
    React.useImperativeHandle(inputRef, () => ({
        focus: () => {
            // logic to focus the rendered component from 3rd party belongs here
        },
        // hiding the value e.g. react-stripe-elements
    }));

    // `Component` will be your `SomeThirdPartyComponent` from below
    return <Component {...other} />;
}


const styles = {
        sendBtn:{
            position:"absolute",
            bottom:"10px",
            right:"5px",
            opacity:0.7
        },
        playBtn:{
            position:"absolute",
            bottom:"10px",
            right:"130px",
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