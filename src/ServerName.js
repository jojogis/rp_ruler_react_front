import * as React from "react";
import {Button, Menu, MenuItem, Paper, withStyles} from "@material-ui/core";
import {Edit, ExitToApp, ExpandMore} from "@material-ui/icons";

class ServerName extends React.Component{
    constructor(props) {
        super(props);
        this.state = {anchorEl:null};
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

                </Menu></div>);
        }
    }
}

const styles = {
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