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
            isGlobal:false,
            bg:null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileUploaded = this.handleFileUploaded.bind(this);
    }

    handleSubmit(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&name="+this.state.name+"&server_id="+this.props.serverId+"&is_global="+this.state.isGlobal+"&bg="+this.state.bg
        };
        fetch("https://rp-ruler.ru/api/add_room.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.props.onCreate();
                this.props.onClose();
            })
    }
    handleFileUploaded(event){
        if(event.target.files != null && event.target.files.length != 0){
            let file = event.target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append("token",this.context.token);
            const requestOptions = {
                method: 'POST',
                body: formData
            };
            fetch("https://rp-ruler.ru/api/upload_file.php",requestOptions).then(response => response.json())
                .then((data)=>{
                        this.setState({bg:data.filename});

                });

        }

    }

    render() {
        const {classes} = this.props;
        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                        aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                Добавление комнаты
            </DialogTitleWithClose>
            <DialogContent dividers>
                <Grid container alignItems="center" direction="column">
                    <img className={classes.bg} src={this.state.bg === null ? null : "https://rp-ruler.ru/upload/"+this.state.bg}/>
                    <br/>
                    <input onChange={this.handleFileUploaded} name="bg" accept="image/*" className={classes.inputFile} id="bg-file" type="file"/>
                    <label htmlFor="bg-file">
                        <Button variant="contained" color="primary" component="span">
                            Загрузить фон комнаты.
                        </Button>
                    </label>
                </Grid>
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
    inputFile:{
        display: 'none',
    },

};

export default withStyles(styles)(AddRoomDialog);