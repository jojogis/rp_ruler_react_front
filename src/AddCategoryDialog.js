import * as React from "react";
import TokenContext from "./AppContext";
import {Button, Dialog, DialogContent, FormControlLabel, Grid, Switch, TextField, withStyles} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";
import Api from "./Api";

class AddRoomDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            isNameError:"",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            this.setState({name:this.props.name});
        }
    }
    handleSubmit(){
        if(this.state.name == null || this.state.name.length == 0){
            this.setState({isNameError:"Введите название"});
            return;
        }
        if(this.state.name.length > 35){
            this.setState({isNameError:"Максимальная длина - 35 символов"});
            return;
        }
        if(this.props.categoryId == null) {
            Api.addCategory(this.context.token, this.state.name, this.props.serverId).then((data) => {
                this.props.onCreate();
                this.props.onClose();
            })
        }else{
            Api.editCategory(this.context.token,this.state.name,this.props.categoryId).then((data)=>{
                this.props.onCreate();
                this.props.onClose();
            })
        }
    }


    render() {
        const {classes} = this.props;
        const title = this.props.categoryId == null ? "Добавление категории" : "Редактирование категории";
        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
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
                    helperText={this.state.isNameError}
                    error={this.state.isNameError.length != 0}
                    onChange={(e)=>this.setState({name:e.target.value})}
                    label="Название категории"
                    autoFocus
                    value={this.state.name}
                />

                <Grid container justify="center">
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} component="span">
                        Сохранить
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