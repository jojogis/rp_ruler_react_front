import * as React from "react";
import {

    Avatar, IconButton, LinearProgress, List,
    ListItem,
    ListItemAvatar, ListItemIcon,
    ListItemText, Menu, MenuItem, Typography,

    withStyles
} from "@material-ui/core";
import {Delete, Reply} from "@material-ui/icons";
import TokenContext from "./AppContext";
import InputReplyMessage from "./InputReplyMessage";
import StyledBadge from "./StyledBadge";
import {blue, cyan, green, lime, orange, pink, purple, red, yellow} from "@material-ui/core/colors";


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
        this.handleScroll = this.handleScroll.bind(this);
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

    getElById(arr,id){
        if(arr === undefined)return null;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id)return arr[i];
        }
        return null;
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
    handleScroll(event){
        if(event.target.scrollTop < 400 && this.props.messages.length % 60 === 0){
            this.props.loadMoreMessages();
        }

    }

    render(){
        const {classes} = this.props;
        return(<div><div className={classes.roomBg} style={{"background-image":this.props.bg}}/><List onScroll={this.handleScroll} className={classes.messagesWrap}>

            {this.props.messages.map((item,i,msgs)=>(
            <ListItem button key={item.id}
                      className={(item.id > this.props.lastRead ? classes.unreadMessage : "")+" "+
                      (item.id == this.props.replyTo ? classes.replyTo : "") + " "+
                      ((i != 0 && msgs[i - 1].sender_id == item.sender_id) ? classes.noAvatar : "")
                      }
                      onContextMenu={(event) => this.handleContextClick(event,item.id)}>
                {(i != 0 && msgs[i - 1].sender_id == item.sender_id) ? "" :
                    <ListItemAvatar>
                        <StyledBadge variant="dot"
                                     anchorOrigin={{
                                         vertical: 'bottom',
                                         horizontal: 'right',
                                     }}
                                     overlap="circle"
                                     invisible={this.getElById(this.props.online, item.sender_id) == null}>
                            <Avatar alt={item.login} src={"https://rp-ruler.ru/upload/" + item.avatar}/>
                        </StyledBadge>

                    </ListItemAvatar>
                }
                <ListItemText
                    secondary={<div>{item.text}
                    {item.reply_message != null ? <InputReplyMessage replyLogin={item.reply_message.login}
                                                                replyText={item.reply_message.text}/> : null}</div>}>
                    {(i != 0 && msgs[i - 1].sender_id == item.sender_id) ? "" :<span className={classes.login + " " + item.color != null ? classes[item.color+"Text"] : ""}>{item.login}</span>}
                    {(i != 0 && msgs[i - 1].sender_id == item.sender_id) ? "" :<l className={classes.messageTime}> {item.datetime}</l>}


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
                {this.getMessageById(this.state.menuMessageId) != null && (
                this.getMessageById(this.state.menuMessageId).sender_id == this.context.user_id ||
                    (this.props.role.msg_delete && this.props.role.role_order < this.getMessageById(this.state.menuMessageId).role_order) )?
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
        </List></div>);
    }
}


const styles = {
    roomBg:{
        position:"absolute",
        top:0,
        "background-position":"center",
        "background-size":"cover",
        left:0,
        width:"100%",
        height:"100%",
        opacity: 0.2
    },
    messagesWrap:{
        height:"calc(100vh - 147px)",
        "overflow":"auto",
        marginTop:"67px"
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
        "font-weight":"400"
    },
    noAvatar:{
        paddingLeft:"72px",
        paddingTop:"0px",
        paddingBlock:"0px"
    },
        redText:{
            color:red[400]
        },
        pinkText:{
            color:pink[400],
        },
        purpleText:{
            color:purple[400],
        },
        limeText:{
            color:lime[400],
        },
        blueText:{
            color:blue[400],
        },
        cyanText:{
            color:cyan[400],
        },
        greenText:{
            color:green[400],
        },
        yellowText:{
            color:yellow[400],
        },
        orangeText:{
            color:orange[400],
        }
}


;
export default withStyles(styles)(Messages);