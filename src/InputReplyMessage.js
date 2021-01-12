import * as React from "react";
import {Paper, withStyles} from "@material-ui/core";
import {Close} from "@material-ui/icons";

class InputReplyMessage extends React.Component{
    render(){
        const {classes} = this.props;
        if(this.props.replyLogin === null)return(<div/>);
        return( <div className={this.props.onCancel != null ? classes.messageReplyWrap : null }>
                                <div className={classes.messageReply}>
                                    <h5 className={classes.login}>{this.props.replyLogin}</h5>
                                    <span className={classes.text}>{this.props.replyText}</span>
                                    {this.props.onCancel != null ? <Close onClick={this.props.onCancel} className={classes.close}/> : null }
                                </div>
        </div>);
    }
}

const styles = {
    messageReplyWrap:{
        padding:"10px 20px"
    },
    messageReply:{
        "border-left":"2px solid #ff5722",
        "padding-left":"10px"
    },
    login:{
        margin:"0",
        "font-size":"1.15em",
        "font-weight":400,
        color:"#ff5722"
    },
    text:{
        opacity:0.7
    },
    close:{
        position:"absolute",
        cursor:"pointer",
        right:"10px",
        top:"10px"
    },


};
export default withStyles(styles)(InputReplyMessage);