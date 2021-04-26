import * as React from "react";
import PropTypes from 'prop-types';
import {
    Box, Button,
    Container,
    CssBaseline,
    Grid,
    Link, Paper,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';
import {Copyright} from "./Copyright";
import {withRouter} from "react-router-dom";



class Restore extends React.Component{

    routingFunction = () => {
        this.props.history.push("/login");
    }

    constructor(props) {
        super(props);

        this.state = {
            login:"",
            wrongLogin:false,
            wrongCode:false,
            codeSend:false,
            code:"",
            codeConfirm:false,
            password:"",
            emptyPass:false,
            passwordRepeat:"",
            wrongPass:false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.handleSubmitPass = this.handleSubmitPass.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            wrongLogin:false
        });
    }

    handleSubmitLogin(e){
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+this.state.login
        };
        fetch("https://rp-ruler.ru/api/restore_send.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data["success"] == 1){
                    this.setState({codeSend:true,wrongLogin:false});
                }else{
                    this.setState({wrongLogin:true});
                }
            })
    }
    handleSubmitCode(e){
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+this.state.login+"&code="+this.state.code
        };
        fetch("https://rp-ruler.ru/api/restore_code_check.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data["correct"] == 1){
                    this.setState({codeConfirm:true,wrongCode:false});
                }else{
                    this.setState({wrongCode:true});
                }
            })
    }
    handleSubmitPass(e){
        e.preventDefault();
        if(this.state.password.length < 6){
            this.setState({emptyPass:true});
            return;
        }
        if(this.state.password != this.state.passwordRepeat){
            this.setState({wrongPass:true});
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+this.state.login+"&code="+this.state.code+"&pass="+this.state.password
        };
        fetch("https://rp-ruler.ru/api/restore.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data["success"] == 1){
                    this.setState({wrongPass:false});
                    this.routingFunction();
                }
            })
    }

    render() {
        const {classes} = this.props;
        if(!this.state.codeSend){
            return(<Grid container justify="center">
                <CssBaseline />
                <Paper elevation={6} className={classes.paper} item>
                    <Typography component="h1" variant="h5">
                        Восстановление пароля. Снова...
                    </Typography>
                    <form className={classes.form} noValidate
                          onSubmit={this.handleSubmitLogin} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            error={this.state.wrongLogin}
                            required
                            fullWidth
                            id="login"
                            label="Логин или E-mail"
                            name="login"
                            helperText={this.state.wrongLogin ? "Пользователь не найден" : ""}
                            autoComplete="login"
                            onChange = {this.handleInputChange}
                            value={this.state.login}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Отправить письмо
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" to="/login" component={RouterLink}>
                                    Войти
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/registration" component={RouterLink} variant="body2">
                                    Зарегистрироваться
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Paper>

            </Grid>);

        }else if(!this.state.codeConfirm){

            return(<Grid container justify="center">
                <CssBaseline />
                <Paper elevation={6} className={classes.paper} item>
                    <Typography component="h1" variant="h5">
                        Восстановление пароля. Снова...
                    </Typography>
                    <form className={classes.form} noValidate
                          onSubmit={this.handleSubmitCode} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            error={this.state.wrongCode}
                            required
                            fullWidth
                            id="code"
                            label="Код из письма"
                            name="code"
                            autoComplete="false"
                            helperText={this.state.wrongCode ? "Неверный код" : ""}
                            onChange = {this.handleInputChange}
                            value={this.state.code}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Отправить
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" to="/login" component={RouterLink}>
                                    Войти
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/registration" component={RouterLink} variant="body2">
                                    Зарегистрироваться
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Paper>

            </Grid>);

        }else{
            return(<Grid container justify="center">
                <CssBaseline />
                <Paper elevation={6} className={classes.paper} item>
                    <Typography component="h1" variant="h5">
                        Восстановление пароля. Снова...
                    </Typography>
                    <form className={classes.form} noValidate
                          onSubmit={this.handleSubmitPass} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={this.state.emptyPass}
                            helperText={this.state.emptyPass ? "Слишком короткий пароль" : ""}
                            id="password"
                            label="Новый пароль"
                            name="password"
                            type="password"
                            autoComplete="password"
                            onChange = {this.handleInputChange}
                            value={this.state.password}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={this.state.wrongPass}
                            helperText={this.state.wrongPass ? "Пароли не совпадают" : ""}
                            id="passwordRepeat"
                            label="Еще раз, чтобы не забыл"
                            name="passwordRepeat"
                            type="password"
                            autoComplete="password"
                            onChange = {this.handleInputChange}
                            value={this.state.passwordRepeat}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Поменять пароль
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" to="/login" component={RouterLink}>
                                    Войти
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/registration" component={RouterLink} variant="body2">
                                    Зарегистрироваться
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Paper>

            </Grid>);
        }


    }
}



Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};

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


export default withStyles(styles)(withRouter(Restore));