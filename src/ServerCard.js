import * as React from "react";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    withStyles
} from "@material-ui/core";

class ServerCard extends React.Component{
    render() {
        const {classes} = this.props;
        return (
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={"https://rp-ruler.ru/upload/"+this.props.avatar}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Игроков: {this.props.players}<br/><br/>
                            {this.props.description}

                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" onClick={this.props.onConnect} color="primary">
                        Подключиться
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

const styles = {
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
};
export default withStyles(styles)(ServerCard);