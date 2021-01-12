import * as React from "react";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import {Copyright} from "./Copyright";
import {Link as RouterLink, withRouter} from 'react-router-dom';



class Reg extends React.Component{
    routingFunction = () => {
        this.props.history.push("/");
    }
    constructor(props) {
        super(props);
        this.state = {
            login:"",
            pass:"",
            mail:"",
            isWrongLogin:false,
            isWrongMail:false
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
            isWrongLogin:false,
            isWrongMail:false
        });
    }

    handleSubmit(e){
        e.preventDefault();
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
                    this.props.onReg(data["token"],data["user_id"]);
                    this.routingFunction();
                }else if( data["error"] === 1){
                    this.setState({isWrongLogin:true});
                }else if( data["error"] === 2) {
                    this.setState({isWrongMail:true});
                }
            })
    }

    render() {
        const {classes} = this.props;
        return ( <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
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
                                error={this.state.isWrongLogin}
                                helperText={this.state.isWrongLogin ? "Логин занят" : ""}
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
                                error={this.state.isWrongMail}
                                helperText={this.state.isWrongMail ?
                                    "Пользователь с такой почтой уже существует " : ""}
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
                            <Link href="#" variant="body2">
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
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>);
    }
}

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
export default withStyles(styles)(withRouter(Reg));