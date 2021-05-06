import * as React from "react";
import TokenContext from "./AppContext";
import {
    Button,
    Dialog,
    DialogContent,
    FormControlLabel,
    Grid,
    Icon,
    Switch,
    TextField, Typography,
    withStyles
} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";
import Api from "./Api";
import Utils from "./Utils";


class AddRoomDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.icons = ["chat","chat_bubble","chat_bubble_outline","bookmark","change_history","child_care","child_friendly","code","directions_run","directions_walk","drafts",
        "eco","emoji_flags","emoji_food_beverage","explore","favorite","favorite_border","fireplace","grade","group","person","home","monetization_on","question_answer","school",
            "smoking_rooms","spa","terrain","waves","work"];
        this.state = {
            name: this.props.name,
            bg:this.props.bg == null || this.props.bg === "null" ? null : this.props.bg,
            isNameError:"",
            icon:this.props.icon ?? "chat",
            description:this.props.description
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileUploaded = this.handleFileUploaded.bind(this);

    }
    componentDidUpdate(prevProps) {
        if (prevProps.bg !== this.props.bg) {
            this.setState({bg:this.props.bg == null || this.props.bg === "null" ? null : this.props.bg})
        }
        if (prevProps.name !== this.props.name) {
            this.setState({name:this.props.name});
        }
        if (prevProps.description !== this.props.description) {
            this.setState({description:this.props.description});
        }
        if (prevProps.icon !== this.props.icon) {
            this.setState({icon:this.props.icon});
        }
    }
    handleSubmit(){
        if(this.state.name == null || this.state.name.length === 0){
            this.setState({isNameError:"Введите название"});
            return;
        }
        if(this.state.name.length > 35){
            this.setState({isNameError:"Максимальная длина - 35 символов"});
            return;
        }
        let desc = this.state.description == null ? "" : this.state.description;
        if(this.props.roomId == null){
            Api.addRoom(this.context.token,this.props.serverId,this.state.name,desc,this.state.icon,this.state.bg).then((data)=>{
                this.props.onCreate();
                this.props.onClose();
            })
        }else{
            Api.editRoom(this.context.token,this.props.serverId,this.props.roomId,this.state.name,desc,this.state.icon,this.state.bg).then((data)=>{
                this.props.onCreate();
                this.props.onClose();
            })
        }
    }
    handleFileUploaded(event){

        if(event.target.files != null && event.target.files.length != 0){
            let file = event.target.files[0];
            Api.uploadFile(this.context.token,file).then((data)=>{
                this.setState({bg:data.filename});
            })
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
                    {this.state.bg != null ? <img className={classes.bg} src={Utils.uploadDir+this.state.bg}/>:""}
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

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e)=>this.setState({description:e.target.value})}
                    label="Описание комнаты"
                    autoFocus
                    value={this.state.description}
                />
                <br/><br/>
                <Typography>Иконка комнаты</Typography><br/>
                <Grid container justify="center" >
                    {this.icons.map((icon) => {
                        return <Button onClick={() => this.setState({icon:icon})} variant={icon===this.state.icon ? "contained" : ""} className={classes.iconButton}><Icon>{icon}</Icon></Button>
                    })}
                </Grid>
                <br/>
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
    iconButton:{
        width:'25px',

    },
    inputFile:{
        display: 'none',
    },
    bg:{
        "max-width":"200px"
    },

};

export default withStyles(styles)(AddRoomDialog);