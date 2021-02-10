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
        this.props.history.push("/");
    }

    constructor(props) {
        super(props);

        this.state = {
            login:"",
            wrongLogin:false
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
            wrongLogin:false
        });
    }

    handleSubmit(e){
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
                if(data["token"] !== undefined){
                    this.props.onLogin(data["token"],data["user_id"]);
                    this.routingFunction();
                }else if( data["success"] != 1){
                    this.setState({wrongLogin:true});
                }
            })
    }

    render() {
        const {classes} = this.props;

        return(<Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={6} className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Восстановление пароля. Снова...
                </Typography>
                <form className={classes.form} noValidate
                      onSubmit={this.handleSubmit} >
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

        </Container>);
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