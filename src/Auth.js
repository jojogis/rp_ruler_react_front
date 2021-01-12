import * as React from "react";
import PropTypes from 'prop-types';
import {
    Box, Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';
import {Copyright} from "./Copyright";
import {withRouter} from "react-router-dom";






class Auth extends React.Component{

    routingFunction = () => {
        this.props.history.push("/");
    }

    constructor(props) {
        super(props);

        this.state = {
            login:"",
            pass:"",
            wrongLoginPass:false
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
            wrongLoginPass:false
        });
    }

    handleSubmit(e){
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+this.state.login+"&pass="+this.state.pass
        };
        fetch("http://rp-ruler.ru/api/login.php",requestOptions)
            .then(response => response.json())
            .then((data)=>{
                if(data["token"] !== undefined){
                    this.props.onLogin(data["token"],data["user_id"]);
                    this.routingFunction();
                }else if( data["error"] === 1){
                    this.setState({wrongLoginPass:true});
                }
            })
    }

    render() {
        const {classes} = this.props;

        return(<Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Добро пожаловать. Снова.
                </Typography>
                <form className={classes.form} noValidate
                      onSubmit={this.handleSubmit} >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        error={this.state.wrongLoginPass}
                        required
                        fullWidth
                        id="login"
                        label="Логин"
                        name="login"
                        helperText={this.state.wrongLoginPass ? "Неверный логин или пароль" : ""}
                        autoComplete="login"
                        onChange = {this.handleInputChange}
                        value={this.state.login}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        error={this.state.wrongLoginPass}
                        fullWidth
                        onChange = {this.handleInputChange}
                        name="pass"
                        label="Пароль"
                        type="password"
                        value={this.state.password}
                        id="pass"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Войти
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/registration" component={RouterLink} variant="body2">
                                Зарегистрироваться
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>);
    }
}



Auth.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = {
    paper: {
        marginTop: "80px",
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


export default withStyles(styles)(withRouter(Auth));