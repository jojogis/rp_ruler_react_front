import * as React from "react";
import {
    AppBar,
    Dialog, Grid,
    IconButton,
    InputBase, OutlinedInput,
    Slide,
    TextField,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import {Close, Search} from "@material-ui/icons";
import clsx from "clsx";
import ServerCard from "./ServerCard";
import TokenContext from "./AppContext";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

class ServersDialog extends React.Component {
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
        this.state = {
            servers:[]
        };
    }

    componentDidMount() {
        fetch("http://rp-ruler.ru/api/get_servers.php").then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    this.setState({...data})
                }
            });
    }

    handleClose(){
        this.props.onClose();
    }

    handleConnect(id){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&server_id="+id
        };
        fetch("http://rp-ruler.ru/api/connect_to_server.php",requestOptions).then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    this.handleClose();
                    this.props.onServerConnect();
                }
            });
    }

    render() {
        const {classes} = this.props;
        return (
            <Dialog  fullScreen open={this.props.open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Доступные сервера
                        </Typography>
                    </Toolbar>
                </AppBar>
                <br/><br/><br/>
                <div style={{ padding: 20 }}>
                <Grid container spacing={2}>
                    {this.state.servers.map((item)=>(
                    <Grid item xs={3} key={item.id}>
                        <ServerCard
                            name={item.name}
                            avatar={item.avatar}
                            description={item.description}
                            players={item.count}
                            onConnect={() => this.handleConnect(item.id)}
                        />
                    </Grid>
                    ))}

                </Grid>
                </div>
            </Dialog>
        );
    }
}
const styles = {

};
export default withStyles(styles)(ServersDialog);