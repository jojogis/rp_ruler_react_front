import * as React from "react";
import TokenContext from "./AppContext";
import {Button, Chip, Dialog, DialogContent, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";
import Api from "./Api";
import {blue, green, yellow} from "@material-ui/core/colors";
import {Explore, Favorite, FlashOn, Grade} from "@material-ui/icons";


class AddCharacterDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.character?.name,
            age:this.props.character?.age,
            biography:this.props.character?.biography,
            extra:this.props.character?.extra,
            temper:this.props.character?.temper,
            isNameError:"",
            isAgeError:"",
            isBiographyError:"",
            isTemperError:""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.character !== this.props.character) {
            this.setState({name:this.props.character?.name,
                age:this.props.character?.age,
                biography:this.props.character?.biography,
                extra:this.props.character?.extra,
                temper:this.props.character?.temper});
        }
    }

    handleSubmit(){
        if(this.state.name == null || this.state.name.length == 0){
            this.setState({isNameError:"Введите имя персонажа"});
            return;
        }
        if(this.state.age == null || this.state.age.length == 0){
            this.setState({isAgeError:"Введите возраст персонажа"});
            return;
        }
        if(!Number.isInteger(this.state.age*1)){
            this.setState({isAgeError:"Возраст должен быть целым числом"});
            return;
        }
        if(this.state.biography == null || this.state.biography.length == 0){
            this.setState({isBiographyError:"Введите биографию персонажа"});
            return;
        }
        if(this.state.temper == null || this.state.temper.length == 0){
            this.setState({isTemperError:"Введите характер персонажа"});
            return;
        }
        if(this.props.character == null) {
            Api.addCharacter(this.context.token, this.state.name, this.state.biography, this.state.temper, this.state.extra ?? "", this.state.age, this.props.serverId).then((data) => {
                this.props.onClose();
            })
        }else{
            Api.updateCharacter(this.context.token, this.state.name, this.state.biography, this.state.temper, this.state.extra ?? "", this.state.age, this.props.character.id).then((data) => {
                this.props.onClose();
            })
        }

    }

    render() {
        const {classes} = this.props;
        const isDisabled = this.props.character?.state == "2";
        const title = this.props.character != null ? "Персонаж" : "Добавление персонажа";
        return(<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                       aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                {title}
            </DialogTitleWithClose>
            <DialogContent dividers>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    disabled={isDisabled}
                    helperText={this.state.isNameError}
                    error={this.state.isNameError.length !== 0}
                    onChange={(e)=>this.setState({name:e.target.value,isNameError:""})}
                    label="Имя персонажа"
                    autoFocus
                    value={this.state.name}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    disabled={isDisabled}
                    helperText={this.state.isAgeError}
                    error={this.state.isAgeError.length !== 0}
                    onChange={(e)=>this.setState({age:e.target.value,isAgeError:""})}
                    label="Возраст персонажа"
                    autoFocus
                    value={this.state.age}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    disabled={isDisabled}
                    rowsMax={8}
                    rows={2}
                    helperText={this.state.isBiographyError}
                    error={this.state.isBiographyError.length !== 0}
                    onChange={(e)=>this.setState({biography:e.target.value,isBiographyError:""})}
                    label="Биография персонажа"
                    autoFocus
                    value={this.state.biography}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    disabled={isDisabled}
                    rowsMax={8}
                    rows={2}
                    helperText={this.state.isTemperError}
                    error={this.state.isTemperError.length !== 0}
                    onChange={(e)=>this.setState({temper:e.target.value,isTemperError:""})}
                    label="Характер персонажа"
                    autoFocus
                    value={this.state.temper}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    disabled={isDisabled}
                    rowsMax={8}
                    rows={2}
                    onChange={(e)=>this.setState({extra:e.target.value})}
                    label="Дополнительная информация"
                    autoFocus
                    value={this.state.extra}
                />

                {this.props.character?.state == "2" ? <div>
                    <br/>
                    <div className={classes.chips}>
                    <Chip
                        avatar={<Favorite style={{ color: green[400] }}/>}
                        label={this.props.character.hp}
                        variant="outlined"
                        className={classes.hp + " " + classes.chip}
                    />
                    <Chip
                        avatar={<FlashOn style={{ color: blue[400] }}/>}
                        label={this.props.character.mp}
                        variant="outlined"
                        className={classes.mp+ " " + classes.chip}
                    />
                        <Chip
                            avatar={<Grade/>}
                            label={this.props.character.level}
                            variant="outlined"
                            className={classes.chip}
                        />
                        <Chip
                            avatar={<Explore style={{ color: yellow[400] }}/>}
                            label={this.props.character.exp}
                            variant="outlined"
                            className={classes.exp + " " + classes.chip}
                        />
                    </div>


                </div> : ""}


                {this.props.character != null && this.props.character.comment?.length > 0 ? <div><br/><Typography variant="body1">Комментарий: </Typography>
                    <Typography variant="body2">{this.props.character.comment}</Typography></div> : ""}
                {this.props.character?.state == "1" ? <Typography align="center" color="primary" variant="h6">На проверке<br/><br/></Typography> : ""}
                {this.props.character?.state == "2" ? <Typography align="center" color="primary" variant="h6">Активен<br/><br/></Typography> : ""}




                {this.props.character?.state != "2" ?
                <Grid container justify="center">
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} component="span">
                        Сохранить
                    </Button>
                </Grid>:""}
            </DialogContent>
        </Dialog>)
    }

}

const styles = {
    chip:{
      margin:"5px"
    },
    chips:{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    hp:{
        color:green[400]
    },
    mp:{
        color:blue[400]
    },
    exp:{
        color:yellow[400]
    }
};

export default withStyles(styles)(AddCharacterDialog);