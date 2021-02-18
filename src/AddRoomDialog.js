import * as React from "react";
import TokenContext from "./AppContext";
import {Button, Dialog, DialogContent, FormControlLabel, Grid, Switch, TextField, withStyles} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";

class AddRoomDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.state = {
            name: "",
            isGlobal:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&name="+this.state.name+"&server_id="+this.props.serverId+"&is_global="+this.state.isGlobal
        };
        fetch("https://rp-ruler.ru/api/add_room.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.props.onCreate();
                this.props.onClose();
            })
    }

    render() {
        const {classes} = this.props;
        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                        aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                Добавление комнаты
            </DialogTitleWithClose>
            <DialogContent dividers>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    onChange={(e)=>this.setState({name:e.target.value})}
                    label="Название комнаты"
                    autoFocus
                    inputRef={this.name}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.isGlobal}
                            onChange={(e)=>this.setState({isGlobal:e.target.checked})}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="Глобальная"
                />

                <Grid container justify="center">
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} component="span">
                        Добавить комнату
                    </Button>
                </Grid>
            </DialogContent>
        </Dialog>)
    }
}
const styles = {


};

export default withStyles(styles)(AddRoomDialog);