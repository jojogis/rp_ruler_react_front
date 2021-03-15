import * as React from "react";
import {
    Avatar, Button,
    Chip,
    Dialog,
    DialogContent, Fab, FormControlLabel, FormLabel, Grid, ListItem, Radio, RadioGroup, Switch,
    TextField,
    withStyles
} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";
import {Autocomplete} from "@material-ui/lab";
import TokenContext from "./AppContext";




class AddServerDialog extends React.Component {
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.tags = ["Аниме","Хентай","Фури","Ужасы","Детектив","Приключения","Эротика","Криминал","Мистика","Комедия","Фантастика"];
        this.state = {
            tags:"",
            name:"",
            avatar:null,
            isPrivate:false,
            age:"0",
            bg:null,
            isNameError:""
        };

        this.name = React.createRef();
        this.description = React.createRef();
        this.handleFileUploaded = this.handleFileUploaded.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    if(event.target.name=="bg"){
                        this.setState({bg:data.filename});
                    }else{
                        this.setState({avatar:data.filename});
                    }

                });

        }

    }

    handleSubmit(){
        if(this.state.name.length == 0){
            this.setState({isNameError:"Введите название"});
            return;
        }
        if(this.state.name.length > 20){
            this.setState({isNameError:"Максимальная длина - 20 символов"});
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "token="+this.context.token+"&age="+this.state.age+"&name="+this.state.name+"&description="+this.description.current.value+"&avatar="+this.state.avatar+
                "&is_private="+this.state.isPrivate*1+"&bg="+this.state.bg+"&tags="+this.state.tags
        };
        fetch("https://rp-ruler.ru/api/create_server.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                this.props.onCreate(data.id,this.state.name);
                this.props.onClose();
            })
    }

    render() {
        const {classes} = this.props;
        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                        aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                Добавление сервера
            </DialogTitleWithClose>
            <DialogContent dividers>
                <Grid container justify="center">
                    <Avatar item src={"https://rp-ruler.ru/upload/"+this.state.avatar} className={classes.avatar}>
                        <Fab>{this.state.name.substr(0,2)}</Fab>
                    </Avatar>
                    <input onChange={this.handleFileUploaded} name="avatar" accept="image/*" className={classes.inputFile} id="button-file" type="file"/>
                    <label htmlFor="button-file">
                        <Button variant="contained" color="primary" component="span">
                            Загрузить аватар.
                        </Button>
                    </label>
                </Grid><br/>
                <Grid container alignItems="center" direction="column">
                    <img className={classes.bg} src={this.state.bg === null ? null : "https://rp-ruler.ru/upload/"+this.state.bg}/>
                    <br/>
                    <input onChange={this.handleFileUploaded} name="bg" accept="image/*" className={classes.inputFile} id="bg-file" type="file"/>
                    <label htmlFor="bg-file">
                        {this.state.bg === null ? <Button variant="contained" color="primary" component="span">
                            Загрузить фон карточки.
                        </Button> : ""}
                    </label>
                </Grid>
                {this.state.bg != null ? <Grid container alignItems="center" direction="column">
                    <Button onClick={() => this.setState({bg:null})} variant="contained" color="primary" component="span">
                        Удалить фон карточки.
                    </Button>
                </Grid> : ""}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    helperText={this.state.isNameError}
                    onChange={(e)=>this.setState({name:e.target.value})}
                    label="Название сервера"
                    autoFocus
                    error={this.state.isNameError.length != 0}
                    inputRef={this.name}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="description"
                    label="Описание"
                    name="description"
                    multiline
                    rowsMax={5}
                    inputRef={this.description}
                />
                <br/><br/>
                <Autocomplete
                    multiple
                    options={this.tags}
                    id="tags"
                    //value={this.state.tags}
                    name="tags"
                    clearText="Очистить"
                    onChange = {(e,value) => {this.setState({tags:value}) }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Тэги"

                        />
                    )}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.isPrivate}
                            onChange={(e)=>this.setState({isPrivate:e.target.checked})}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="Приватный"
                />
                <br/><br/>
                <FormLabel component="legend">Возрастное ограничение</FormLabel><br/>
                <RadioGroup row name="age" value={this.state.age} onChange={(e)=>this.setState({age:e.target.value})} defaultValue="top">
                    <FormControlLabel
                        value="0"
                        control={<Radio color="primary" />}
                        label="+0"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="6"
                        control={<Radio color="primary" />}
                        label="+6"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="12"
                        control={<Radio color="primary" />}
                        label="+12"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="16"
                        control={<Radio color="primary" />}
                        label="+16"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="18"
                        control={<Radio color="primary" />}
                        label="+18"
                        labelPlacement="end"
                    />
                </RadioGroup><br/>
                <Grid container justify="center">
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} component="span">
                        Создать сервер
                    </Button>
                </Grid>
            </DialogContent>
        </Dialog>);
    }
}
const styles = {
    inputFile:{
        display: 'none',
    },
    bg:{
      "max-width":"200px"
    },
    avatar:{
        "margin-right":"30px"
    }
};
export default withStyles(styles)(AddServerDialog);