import * as React from "react";
import {Fab, List, ListItem,  withStyles} from "@material-ui/core";
import {AssignmentInd, Add, Settings, Explore} from "@material-ui/icons";

import {Divider} from "@material-ui/core";
import AppContext from "./AppContext.js";
import ProfileDialog from "./ProfileDialog";
import ServersDialog from "./ServersDialog";



class MainMenu extends React.Component{
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            profileDialogOpen:false,
            serversDialogOpen:false
        };
        this.handleProfileDialogClose = this.handleProfileDialogClose.bind(this);
        this.handleProfileDialogOpen = this.handleProfileDialogOpen.bind(this);
        this.handleServersDialogClose = this.handleServersDialogClose.bind(this);
        this.handleServersDialogOpen = this.handleServersDialogOpen.bind(this);

    }
    handleServerClick(id,name){
        this.props.onChangeServer(id,name);
    }

    handleProfileDialogClose(){
        this.setState({profileDialogOpen:false})
    }
    handleProfileDialogOpen(){
        this.setState({profileDialogOpen:true})
    }
    handleServersDialogClose(){
        this.setState({serversDialogOpen:false})
    }
    handleServersDialogOpen(){
        this.setState({serversDialogOpen:true})
    }

    render() {
        const {classes} = this.props;
        return (<div><List><ListItem><Fab onClick={this.handleProfileDialogOpen} aria-label="add">
            <Settings />
        </Fab></ListItem><Divider className={classes.divider}/>
            {this.props.servers.map((item)=>(
                <ListItem key={item.id}>
                    <Fab className={classes.serverElem}
                         onClick={() => this.handleServerClick(item.id)}>
                    {item.name.substr(0,2)}</Fab></ListItem>
            ))}
            <ListItem><Fab color="primary" className={classes.serverElem}>
                <Add/></Fab></ListItem>
                <ListItem><Fab color="primary" onClick={this.handleServersDialogOpen} className={classes.serverElem}>
                    <Explore/></Fab></ListItem>

            </List><ProfileDialog open={this.state.profileDialogOpen} onClose={this.handleProfileDialogClose}/>
                    <ServersDialog open={this.state.serversDialogOpen} onServerConnect={this.props.onServerConnect} onClose={this.handleServersDialogClose}/>
        </div>
        );
    }

}
const styles = {
    divider: {

        padding:"1px"
    },
    serverElem:{
        "font-size":"20px"
    }
};
export default withStyles(styles)(MainMenu);