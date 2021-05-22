import * as React from "react";
import TokenContext from "./AppContext";
import Api from "./Api";
import {blue, cyan, green, lime, orange, pink, purple, red, yellow} from "@material-ui/core/colors";
import {
    Avatar, Button, Chip, CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    FormControl,
    Grid,
    InputLabel, MenuItem, Select,
    Typography,
    withStyles
} from "@material-ui/core";
import Utils from "./Utils";
import DialogTitleWithClose from "./DialogTitleWithClose";
import {Explore, Favorite, FlashOn, Grade} from "@material-ui/icons";

class UserInfoDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state={
            isLoading:true,
            character:null
        }
        this.handleRoleChange = this.handleRoleChange.bind(this);
    }
    handleRoleChange(e){

        Api.setUserRole(this.context.token,this.props.server.id,this.props.user.id,e.target.value).then((data)=>{
            this.props.onClose();
            this.props.onMessagesUpdate();
            this.props.onUsersUpdate();
        })

    }
    componentDidMount() {
        Api.getCharacter(this.context.token,this.props.server?.id,this.props.user?.id).then((data)=>{
            this.setState({character:data.character,isLoading:false})
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if((prevProps.user?.id != this.props.user?.id) && this.props.user != null && this.props.server != null){
            this.setState({isLoading:true});
            Api.getCharacter(this.context.token,this.props.server?.id,this.props.user?.id).then((data)=>{
                this.setState({character:data.character,isLoading:false})
            })
        }
    }

    render() {
        const {classes} = this.props;
        if (this.props.user == null) return (<div/>);
        let role_id = this.props.user.role_id;
        let canChangeRole = this.props.user.role_order > this.props.role.role_order;

        let curRole = Utils.getElById(this.props.server.roles, role_id);
        return(<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                       aria-labelledby="form-dialog-title">




            <DialogContent>
                <Avatar className={classes.avatar} alt={this.props.user.login} src={Utils.uploadDir+this.props.user.avatar}/>
                <Typography style={{paddingLeft:100}} variant="h6">{this.props.user.login}</Typography>
                {curRole != null ? <Typography variant="subtitle1" style={{paddingLeft:100}} className={classes[curRole.color+"Text"]}>{curRole.name}</Typography>: ""}
                <Typography style={{paddingLeft:20}} variant="caption" >{this.props.user.status}</Typography>
                <br/><br/><Divider/>
                {canChangeRole ? <FormControl className={classes.roleSelect} fullWidth>
                    <InputLabel id="role-select-label">Роль</InputLabel>
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        className={curRole != null ? classes[curRole.color+"Text"] : ""}
                        onChange={this.handleRoleChange}
                        value={role_id}
                    >
                        {this.props.server.roles.map((role) => (<MenuItem disabled={role.role_order <= this.props.role.role_order} className={classes[role.color+"Text"]} value={role.id}>{role.name}</MenuItem>) )}

                    </Select><br/><Divider/>
                </FormControl> : ""}
                <br/><br/>
                {this.state.isLoading ?
                <Grid container justify="center">
                <CircularProgress/>
                </Grid> : ""}

                {this.state.character != null ? <div><div className={classes.chips}>
                        <Chip
                            avatar={<Favorite style={{ color: green[400] }}/>}
                            label={this.state.character?.hp}
                            variant="outlined"
                            className={classes.hp + " " + classes.chip}
                        />
                        <Chip
                            avatar={<FlashOn style={{ color: blue[400] }}/>}
                            label={this.state.character?.mp}
                            variant="outlined"
                            className={classes.mp+ " " + classes.chip}
                        />
                        <Chip
                            avatar={<Grade/>}
                            label={this.state.character?.level}
                            variant="outlined"
                            className={classes.chip}
                        />
                        <Chip
                            avatar={<Explore style={{ color: yellow[400] }}/>}
                            label={this.state.character?.exp}
                            variant="outlined"
                            className={classes.exp + " " + classes.chip}
                        />
                    </div>
                        <Typography variant="body1"><b>Имя:</b> {this.state.character?.name}</Typography><br/>
                        <Typography variant="body1"><b>Возраст: </b>{this.state.character?.age}</Typography><br/>
                        <Typography variant="body1"><b>Биография: </b>{this.state.character?.biography}</Typography><br/>
                        <Typography variant="body1"><b>Характер: </b>{this.state.character?.temper}</Typography><br/>
                        <Typography variant="body1"><b>Дополнительно: </b>{this.state.character?.extra}</Typography><br/>
                </div> : ""}

                {this.props.doWrite ? <Button onClick={this.props.onWriteToUser} style={{position:"absolute",right:20,top:20}} variant="contained" color="primary">
                    Написать
                </Button> : ""}
            </DialogContent>
            </Dialog>

            );
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
    },
    roleSelect:{
        marginTop:"20px"
    },
    rootUser:{
        "text-align":"center",
        "width":"200px",
        'padding':"20px"

    },
    avatar:{
        "float":"left",
        "width":"80px",
        "height":"80px",
    },
    redText:{
        color:red[400]
    },
    pinkText:{
        color:pink[400],
    },
    purpleText:{
        color:purple[400],
    },
    limeText:{
        color:lime[400],
    },
    blueText:{
        color:blue[400],
    },
    cyanText:{
        color:cyan[400],
    },
    greenText:{
        color:green[400],
    },
    yellowText:{
        color:yellow[400],
    },
    orangeText:{
        color:orange[400],
    }
};
export default withStyles(styles)(UserInfoDialog);