import * as React from "react";
import {
    AppBar,
    Dialog, fade, Grid,
    IconButton,
    InputBase, makeStyles, OutlinedInput,
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
import Utils from "./Utils";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});



class ServersDialog extends React.Component {
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.handleConnect = this.handleConnect.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.findTag = this.findTag.bind(this);

        this.state = {
            servers:[],
            search:""
        };

    }


    componentDidUpdate(prevProps) {
        if(!prevProps.open && this.props.open){
            this.setState({search:""})
            fetch("https://rp-ruler.ru/api/get_servers.php").then(response => response.json())
                .then((data)=>{
                    if(data.error === undefined){
                        this.setState({...data})
                    }
                });
        }
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

    handleSearchChange(event){
        const search = event.target.value;
        this.setState({search:search});
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "s="+search
        };
        fetch("https://rp-ruler.ru/api/get_servers.php",requestOptions).then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    this.setState({...data})
                }
            });
    }

    findTag(tag){
        this.setState({search:"#"+tag});
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "s=#"+tag
        };
        fetch("https://rp-ruler.ru/api/get_servers.php",requestOptions).then(response => response.json())
            .then((data)=>{
                if(data.error === undefined){
                    this.setState({...data})
                }
            });
    }

    render() {
        const {classes} = this.props;

        return (
            <Dialog fullScreen open={this.props.open} onClose={this.props.onClose} TransitionComponent={Transition}>
                <AppBar className={classes.root}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.props.onClose} aria-label="close">
                            <Close />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" >
                            Доступные сервера
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <Search />
                            </div>
                            <InputBase
                                onChange={this.handleSearchChange}
                                value={this.state.search}
                                placeholder="Поиск серверов…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'Поиск серверов' }}
                            />
                        </div>
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
                            age={item.age}
                            isConnected={Utils.getElById(this.props.connectedServers,item.id)}
                            description={item.description}
                            players={item.count}
                            onFindTag={this.findTag}
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

const useStyles = (theme) => ({
    serverCard:{
        "width":"400px"
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '22ch',
            '&:focus': {
                width: '40ch',
            },
        },
    },
});



export default withStyles(useStyles)(ServersDialog);