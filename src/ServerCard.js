import * as React from "react";
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia, Fab, Link,
    Typography,
    withStyles
} from "@material-ui/core";
import Utils from "./Utils";

class ServerCard extends React.Component{
    render() {
        const {classes} = this.props;
        return (
            <Card elevation={4} className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={Utils.uploadDir+this.props.bg}
                    />
                    <Avatar className={classes.avatar}  src={Utils.uploadDir+this.props.avatar}>
                        <Fab className={classes.serverElem}>{this.props.name.substr(0,2)}</Fab>
                    </Avatar>
                    <CardContent>
                        <Typography className={classes.serverName} gutterBottom variant="h5" component="h2">
                            {this.props.name}
                        </Typography>
                        <Typography color="textSecondary">
                            {this.props.tags.length !== 0 ? this.props.tags.split(",").map((tag)=>(
                                <Link onClick={() => this.props.onFindTag(tag)}>{"#"+tag}</Link>
                            )) : "" }

                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {this.props.description}<br/><br/>
                            Игроков: {this.props.players}<br/>
                            {"Возраст: +" + this.props.age}<br/>
                            {"Макс игроков: 50"}
                        </Typography>

                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {this.props.isConnected ? <Button size="small" color="primary">
                        Вы уже на этом сервере.
                    </Button> : <Button size="small" onClick={this.props.onConnect} color="primary">
                        Подключиться
                    </Button>}

                </CardActions>
            </Card>
        );
    }
}

const styles = {
    serverName:{
        "padding-right":"50px"
    },
    root: {
        maxWidth: 345,
    },
    media: {
        height: 180,
    },
    avatar:{
        width:"56px",
        height:"56px",
        "background-color":"#e0e0e0",
        position:"absolute",
        right:"20px",
        "margin-top":"-27px",
        "box-shadow":"0 0 10px #333"
    },
    serverElem:{
        "font-size":"20px"
    }
};
export default withStyles(styles)(ServerCard);