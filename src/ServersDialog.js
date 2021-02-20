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
import Masonry from 'react-masonry-css'

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
        fetch("https://rp-ruler.ru/api/get_servers.php").then(response => response.json())
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
        fetch("https://rp-ruler.ru/api/connect_to_server.php",requestOptions).then(response => response.json())
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
            <Dialog fullScreen open={this.props.open} onClose={this.handleClose} TransitionComponent={Transition}>
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
                <Masonry breakpointCols={{
                    default: 5,
                    1650: 4,
                    1200: 3,
                    900: 2
                }}
                         className="my-masonry-grid"
                         columnClassName="my-masonry-grid_column"
                >
                    {this.state.servers.map((item)=>(
                        <ServerCard
                            name={item.name}
                            avatar={item.avatar}
                            bg={item.card_bg}
                            tags={item.tags}
                            description={item.description}
                            players={item.count}
                            className={classes.serverCard}
                            onConnect={() => this.handleConnect(item.id)}
                        />
                    ))}

                </Masonry>
                </div>
            </Dialog>
        );
    }
}
const styles = {
    serverCard:{
        "width":"400px"
    }
};
export default withStyles(styles)(ServersDialog);