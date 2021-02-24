import * as React from "react";
import TokenContext from "./AppContext";
import {Button, Dialog, DialogContent, FormControlLabel, Grid, Switch, TextField, withStyles} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";

class AddRoomDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            isGlobal:this.props.isGlobal == null ? false : this.props.isGlobal,
            bg:this.props.bg == null ? null : this.props.bg,
            isNameError:""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileUploaded = this.handleFileUploaded.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.bg !== this.props.bg) {
            this.setState({bg:this.props.bg})
        }
        if (prevProps.name !== this.props.name) {
            this.setState({name:this.props.name});
        }
        if (prevProps.isGlobal !== this.props.isGlobal) {
            this.setState({isGlobal:this.props.isGlobal});
        }
    }
    handleSubmit(){
        if(this.state.name == null || this.state.name.length == 0){
            this.setState({isNameError:"Введите название"});
            return;
        }
        if(this.state.name.length > 50){
            this.setState({isNameError:"Максимальная длина - 50 символов"});
            return;
        }
        let roomId = this.props.roomId == null ? "" : "&room_id="+this.props.roomId;
        let url = this.props.roomId == null ? "https://rp-ruler.ru/api/add_room.php" : "https://rp-ruler.ru/api/edit_room.php";
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&name="+this.state.name+"&server_id="+this.props.serverId+"&is_global="+this.state.isGlobal+"&bg="+this.state.bg+roomId
        };
        fetch(url,requestOptions)
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
        let title = this.props.roomId == null ? "Добавление комнаты" :  "Редактирование комнаты";
        let btnText = this.props.roomId == null ? "Добавить комнату" :  "Сохранить";
        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                        aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                {title}
            </DialogTitleWithClose>
            <DialogContent dividers>
                <Grid container alignItems="center" direction="column">
                    <img className={classes.bg} src={this.state.bg === null ? null : "https://rp-ruler.ru/upload/"+this.state.bg}/>
                    <br/>
                    <input onChange={this.handleFileUploaded} name="bg" accept="image/*" className={classes.inputFile} id="bg-file" type="file"/>
                    <label htmlFor="bg-file">
                        {this.state.bg == null ?
                        <Button variant="contained" color="primary" component="span">
                            Загрузить фон комнаты.
                        </Button> : ""}
                    </label>
                </Grid>
                {this.state.bg != null ? <Grid container alignItems="center" direction="column">
                    <Button onClick={() => this.setState({bg:null})} variant="contained" color="primary" component="span">
                        Удалить фон комнаты.
                    </Button>
                </Grid> : ""}

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    helperText={this.state.isNameError}
                    error={this.state.isNameError.length != 0}
                    onChange={(e)=>this.setState({name:e.target.value})}
                    label="Название комнаты"
                    autoFocus
                    value={this.state.name}
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
                        {btnText}
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
    bg:{
        "max-width":"200px"
    },

};

export default withStyles(styles)(AddRoomDialog);