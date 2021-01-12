import * as React from "react";
import {

    Avatar, IconButton, List,
    ListItem,
    ListItemAvatar, ListItemIcon,
    ListItemText, Menu, MenuItem,

    withStyles
} from "@material-ui/core";
import {Delete, Reply} from "@material-ui/icons";
import TokenContext from "./AppContext";
import InputReplyMessage from "./InputReplyMessage";


class Messages extends React.Component{
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.state =
            {mouseX: null,
            mouseY: null,
            menuMessageId:null,
            };
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.getMessageById = this.getMessageById.bind(this);
        this.handleDeleteMsg = this.handleDeleteMsg.bind(this);
        this.handleReply = this.handleReply.bind(this);
        this.handleContextClick = this.handleContextClick.bind(this);
    }

    handleContextClick(event,message_id){
        event.preventDefault();
        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            menuMessageId:message_id
        });
    }
    componentDidUpdate(prevProps){
        if(this.props.messages !== prevProps.messages) {
            this.scrollToBottom();
        }
    }
    scrollToBottom(){
        this.messagesEnd.scrollIntoView();
    }

    componentDidMount() {
        this.scrollToBottom();
    }


    handleCloseMenu(event){
        event.preventDefault();
        this.setState({
            mouseX: null,
            mouseY: null
        });
    }

    getMessageById(id){
        if(this.props.messages === undefined)return null;
        for(let i=0;i<this.props.messages.length;i++){
            if(this.props.messages[i].id === id)return this.props.messages[i];
        }
        return null;

    }

    handleReply(event){
        this.props.onReplyChoose(this.state.menuMessageId);
        this.handleCloseMenu(event);
    }

    handleDeleteMsg(event){
        this.props.onRemoveMessage(this.state.menuMessageId);
        this.handleCloseMenu(event);
    }

    render(){
        const {classes} = this.props;
        return(<List className={classes.messagesWrap}>
            {this.props.messages.map((item)=>(
            <ListItem button key={item.id}
                      className={(item.id > this.props.lastRead ? classes.unreadMessage : "")+" "+
                      (item.id==this.props.replyTo ? classes.replyTo : "")}
                      onContextMenu={(event) => this.handleContextClick(event,item.id)}>
                <ListItemAvatar>
                    <Avatar alt={item.login} src={"https://rp-ruler.ru/upload/"+item.avatar}/>
                </ListItemAvatar>
                <ListItemText
                    secondary={<div>{item.text}
                    {item.reply_message != null ? <InputReplyMessage replyLogin={item.reply_message.login}
                                                                replyText={item.reply_message.text}/> : null}</div>}>
                    <span className={classes.login}>{item.login}</span> <l className={classes.messageTime}>{item.datetime}</l>

                </ListItemText>
            </ListItem>
            ))}
            <Menu
                keepMounted
                onContextMenu={this.handleCloseMenu}
                open={this.state.mouseY !== null}
                onClose={this.handleCloseMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    this.state.mouseY !== null && this.state.mouseX !== null
                        ? { top: this.state.mouseY, left: this.state.mouseX }
                        : undefined
                }
            >
                {this.getMessageById(this.state.menuMessageId) != null &&
                this.getMessageById(this.state.menuMessageId).sender_id == this.context.user_id ?
                    <MenuItem onClick={this.handleDeleteMsg}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    Удалить
                </MenuItem> : ""}

                <MenuItem onClick={this.handleReply}>
                    <ListItemIcon>
                        <Reply fontSize="small" />
                    </ListItemIcon>
                    Ответить
                </MenuItem>
            </Menu>
            <div style={{ float:"left", clear: "both" }}
                 ref={(el) => { this.messagesEnd = el; }}>
            </div>
        </List>);
    }
}


const styles = {
    messagesWrap:{
        height:"calc(100vh - 147px)",
        "overflow":"auto"
    },
    messageTime:{
        "font-size":"13px",
        opacity:"0.6"
    },
    unreadMessage:{
        "background-color":"rgba(255, 255, 255, 0.04)"
    },
    replyTo:{
        "border-left":"2px solid #ff5722",
        "background-color":"#ff572209"
    },
    login:{
        color:"#ff5722"
    }}

;
export default withStyles(styles)(Messages);