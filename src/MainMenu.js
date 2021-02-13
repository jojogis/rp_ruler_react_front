import * as React from "react";
import {Avatar, Fab, List, ListItem, withStyles} from "@material-ui/core";
import {AssignmentInd, Add, Settings, Explore, Forum} from "@material-ui/icons";

import {Divider} from "@material-ui/core";
import AppContext from "./AppContext.js";
import ProfileDialog from "./ProfileDialog";
import ServersDialog from "./ServersDialog";
import AddServerDialog from "./AddServerDialog";



class MainMenu extends React.Component{
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            profileDialogOpen:false,
            serversDialogOpen:false,
            addServerDialogOpen:false
        };


    }
    handleServerClick(id,name){
        this.props.onChangeServer(id,name);
    }




    render() {
        const {classes} = this.props;
        return (<div><List><ListItem><Fab onClick={() => this.setState({profileDialogOpen:true})} aria-label="add">
            <Settings />
        </Fab></ListItem>
                <ListItem><Fab onClick={this.props.onToChatClick} aria-label="add">
                    <Forum />
                </Fab></ListItem>
                <Divider className={classes.divider}/>
            {this.props.servers.map((item)=>(
                <ListItem key={item.id}>
                    <Avatar className={classes.avatar} onClick={() => this.handleServerClick(item.id)} src={"https://rp-ruler.ru/upload/"+item.avatar}>
                        <Fab className={classes.serverElem}>{item.name.substr(0,2)}</Fab>
                    </Avatar></ListItem>
            ))}
            <ListItem><Fab color="primary" className={classes.serverElem} onClick={() => this.setState({addServerDialogOpen:true})}>
                <Add/></Fab></ListItem>
                <ListItem><Fab color="primary" onClick={() =>this.setState({serversDialogOpen:true})} className={classes.serverElem}>
                    <Explore/></Fab></ListItem>

            </List><ProfileDialog open={this.state.profileDialogOpen} onClose={() =>this.setState({profileDialogOpen:false})}/>
                    <ServersDialog open={this.state.serversDialogOpen} onServerConnect={this.props.onServerConnect} onClose={() => this.setState({serversDialogOpen:false})}/>
                    <AddServerDialog open={this.state.addServerDialogOpen} onClose={() => this.setState({addServerDialogOpen:false})}/>
        </div>
        );
    }

}
const styles = {
    divider: {

        padding:"1px"
    },
    avatar:{
        width:"56px",
        height:"56px",
        "background-color":"#e0e0e0",
        "cursor":"pointer"
    },
    serverElem:{
        "font-size":"20px"
    }
};
export default withStyles(styles)(MainMenu);