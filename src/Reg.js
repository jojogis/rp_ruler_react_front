import * as React from "react";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link, Paper,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import {Copyright} from "./Copyright";
import {Link as RouterLink, withRouter} from 'react-router-dom';
import ParticlesBg from "particles-bg";



class Reg extends React.Component{
    routingFunction = () => {
        this.props.history.push("/");
    }
    constructor(props) {
        super(props);
        this.state = {
            login:"",
            pass:"",
            email:"",
            isWrongLogin:"",
            isWrongMail:"",
            isWrongPassword:""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            isWrongLogin:"",
            isWrongMail:"",
            isWrongPassword:""
        });
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.login == ""){
            this.setState({isWrongLogin:"Введите логин"});
            return;
        }
        if(this.state.email == ""){
            this.setState({isWrongMail:"Введите email"});
            return;
        }
        if( !(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(this.state.email)) ){
            this.setState({isWrongMail:"Некорректный email"});
            return;
        }
        if(this.state.pass.length < 6){
            this.setState({isWrongPassword:"Слишком короткий пароль"});
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+this.state.login+"&pass="+this.state.pass+"&email="+this.state.email
        };
        fetch("https://rp-ruler.ru/api/registration.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data["token"] !== undefined){
                    this.props.onReg(data["token"],data["user_id"],data["user_type"]);
                    this.routingFunction();
                }else if( data["error"] === 1){
                    this.setState({isWrongLogin:"Логин занят"});
                }else if( data["error"] === 2) {
                    this.setState({isWrongMail:"Email занят"});
                }
            })
    }

    render() {
        const {classes} = this.props;
        return ( <Grid container justify="center">
            <CssBaseline />

            <Paper elevation={6} className={classes.paper} item>
                <Typography component="h1" variant="h5">
                    Добро пожаловать.
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                autoComplete="login"
                                name="login"
                                variant="outlined"
                                required
                                fullWidth
                                id="login"
                                error={this.state.isWrongLogin != ""}
                                helperText={this.state.isWrongLogin}
                                onChange={this.handleInputChange}
                                label="Логин"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                error={this.state.isWrongMail != ""}
                                helperText={this.state.isWrongMail}
                                name="email"
                                onChange={this.handleInputChange}
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="pass"
                                label="Пароль"
                                error={this.state.isWrongPassword != ""}
                                helperText={this.state.isWrongPassword}
                                type="password"
                                onChange={this.handleInputChange}
                                id="pass"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        зарегистрироваться
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item xs>
                            <Link href="#" variant="body2" component={RouterLink} to="/restore" >
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" component={RouterLink} to="/login" variant="body2">
                                Уже есть аккаунт?
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Paper>

        </Grid>);
    }
}

const styles = {
    paper: {
        marginTop: "160px",
        padding:"60px",
        width:"500px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: "10px",
    },
    submit: {
        margin: "30px 0 20px",
    },
};
export default withStyles(styles)(withRouter(Reg));