import * as React from "react";
import {
    Accordion, AccordionDetails, AccordionSummary,
    AppBar, Avatar,
    Button,
    Dialog, DialogActions, DialogTitle, Divider, FormControlLabel,
    IconButton,
    List,
    ListItem, ListItemAvatar,
    ListItemText, Slide, Snackbar, Switch,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import {Close, ExpandMore} from "@material-ui/icons";
import TokenContext from "./AppContext";
import FormDialog from "./FormDialog";
import Api from "./Api";
import Utils from "./Utils";



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

class ProfileDialog extends React.Component {
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleDarkThemeChange = this.handleDarkThemeChange.bind(this);
        this.state = {expanded:false,
            login:null,
            email:null,
            status:null,
            avatar:null,
            loginFormOpen:false,
            statusFormOpen:false,
            passFormOpen:false,
            isConfirmDeleteOpen:false
        };
        this.handleAccordionChange = this.handleAccordionChange.bind(this);
        this.handleSaveLogin = this.handleSaveLogin.bind(this);
        this.handleSaveStatus = this.handleSaveStatus.bind(this);
        this.handleSavePassword = this.handleSavePassword.bind(this);
        this.handleFileUploaded = this.handleFileUploaded.bind(this);
    }

    componentDidMount() {
        Api.getProfile(this.context.token).then((data)=>{
            if(data.error === undefined){
                this.setState({...data.user})
            }
        })
    }

    handleClose(){
        this.props.onClose();
    }
    handleDarkThemeChange(){
        this.context.toggleTheme();
    }


    handleSaveLogin(data){
        if(data==null)return;
        let newLogin = data.login;
        if(newLogin.length === 0){
            this.context.showMessage("Логин не может быть пустым","error");
            return;
        }
        Api.editProfile(this.context.token,newLogin).then((data)=>{
            if(data.error === undefined){
                this.setState({login:newLogin});
                this.context.showMessage("Логин успешно изменен.","success");
            }else{
                this.context.showMessage(data.error,"error");
            }
        })
        this.setState({loginFormOpen:false});
    }



    handleSaveStatus(data){
        let newStatus = data == null ? " " : data.status;
        this.setState({statusFormOpen:false});
        Api.editProfile(this.context.token,null,newStatus).then((data)=>{
            if(data.error === undefined){
                this.context.showMessage("Статус успешно изменен.","success");
                this.setState({status:newStatus});
            }else{
                this.context.showMessage(data.error,"error");
            }
        })

    }

    handleSavePassword(data){
        if(data == null)return;
        this.setState({passFormOpen:false});
        let prevPass = data.prev_password;
        let newPass = data.new_password;
        Api.editProfile(this.context.token,null,null,prevPass,newPass).then((data)=>{
            if(data.error === undefined){
                this.context.showMessage("Пароль успешно изменен.","success");
            }else{
                this.context.showMessage(data.error,"error");
            }
        })

    }

    handleAccordionChange = (panel) => (event, isExpanded) => {
        this.setState({expanded:isExpanded ? panel : false});
    };
    handleFileUploaded(event){
        if(event.target.files != null && event.target.files.length != 0){
            let file = event.target.files[0];
            Api.uploadAvatar(this.context.token,file).then((data)=>{
                this.setState({avatar:data.avatar});
            })
        }

    }

    handleAccountDelete(){
        Api.deleteAccount(this.context.token).then((data)=>{
            if(data.error === undefined){
                this.context.logout();
            }
        })
    }

    render(){
        const {classes} = this.props;
        return(<Dialog fullScreen open={this.props.open} onClose={this.handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                        <Close />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Настройки
                    </Typography>
                </Toolbar>
            </AppBar>
            <br/><br/><br/><br/>
            <Accordion expanded={this.state.expanded === 'general'} onChange={this.handleAccordionChange("general")}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="generalbh-content"
                    id="generalbh-header"
                >
                    <Typography>Основные настройки</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List className={classes.list}>
                        <ListItem button>
                            <FormControlLabel
                                control={<Switch checked={this.context.isDarkTheme} onChange={this.handleDarkThemeChange} />}
                                label="Темная тема"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <FormControlLabel
                                control={<Switch checked={this.context.isAnimationEnable} onChange={this.context.toggleAnimation} />}
                                label="Анимация фона"
                            />
                        </ListItem>
                        <Divider />
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={this.state.expanded === 'user'} onChange={this.handleAccordionChange("user")}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="userbh-content"
                    id="userbh-header"
                >
                    <Typography>Пользователь</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List className={classes.list}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar alt={this.state.login} src={Utils.uploadDir+this.state.avatar}/>
                            </ListItemAvatar>
                            <input onChange={this.handleFileUploaded} name="avatar" accept="image/*" className={classes.inputFile} id="button-file" type="file"/>
                            <label htmlFor="button-file">
                                <Button variant="contained" color="primary" component="span">
                                    Загрузить аватар.
                                </Button>
                            </label>
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Логин" secondary={this.state.login} />
                            <Button onClick={() => this.setState({loginFormOpen:true})} variant="contained" color="primary" component="span">
                                Изменить
                            </Button>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemText primary="Почта" secondary={this.state.email} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemText primary="Статус" secondary={this.state.status} />
                            <Button variant="contained" onClick={() => this.setState({statusFormOpen:true})} color="primary" component="span">
                                Изменить
                            </Button>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemText primary="Пароль" />
                            <Button variant="contained" color="primary" onClick={() => this.setState({passFormOpen:true})} component="span">
                                Изменить
                            </Button>
                        </ListItem>

                        <ListItem>
                            <Button variant="contained" color="primary" onClick={() => this.setState({isConfirmDeleteOpen:true})} component="span">
                                Удалить аккаунт
                            </Button>
                        </ListItem>


                        <ListItem>
                            <Button variant="contained" color="primary" onClick={this.context.logout} component="span">
                                Выйти
                            </Button>
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            <FormDialog open={this.state.loginFormOpen} onSave={this.handleSaveLogin} types={["text"]} names={["login"]}
                        onClose={() => this.setState({loginFormOpen:false})} text="Введите логин" labels={["Логин"]}/>
            <FormDialog open={this.state.statusFormOpen} onSave={this.handleSaveStatus} types={["text"]} names={["status"]}
                        onClose={() => this.setState({statusFormOpen:false})} text="Введите статус" labels={["Статус"]}/>
            <FormDialog open={this.state.passFormOpen} onSave={this.handleSavePassword} types={["password","password"]}
                        names={["prev_password","new_password"]}
                        onClose={() => this.setState({passFormOpen:false})} text="Введите текущий и новый пароли"
                        labels={["Текущий пароль","Новый пароль"]}/>
            <Dialog open={this.state.isConfirmDeleteOpen} onClose={() => this.setState({isConfirmDeleteOpen:false})}>
                <DialogTitle>Вы уверены?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => this.setState({isConfirmDeleteOpen:false})} color="primary">
                        Отменить
                    </Button>
                    <Button onClick={() => this.handleAccountDelete()} color="primary" autoFocus>
                        Удалить аккаунт
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>)
    }

}
const styles = {
    appBar:{
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: "20px",
            flex: 1,
        },

    },
    inputFile:{
        display: 'none',
    },
    list:{
        width:"100% !important"
    }


};
export default withStyles(styles)(ProfileDialog);