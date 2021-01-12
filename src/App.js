import Cookies from 'universal-cookie';
import './App.css';
import * as React from "react";
import Auth from "./Auth";
import Reg from "./Reg";
import Chat from "./Chat";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core";
import {Route, Switch, Redirect, useHistory, useLocation} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import TokenContext from "./AppContext";


export class App extends React.Component{

    constructor(props) {
        super(props);
        let darkTheme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });

        const cookies = new Cookies();
        const token = cookies.get("token");
        const user_id = cookies.get("user_id");
        this.handleLogin = this.handleLogin.bind(this);
        this.toggleTheme = this.toggleTheme.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            token:token,
            user_id:user_id,
            isDarkTheme:true,
            toggleTheme:this.toggleTheme,
            logout:this.logout,
            theme:darkTheme
        };

    }

    logout(){
        const cookies = new Cookies();
        cookies.set("token",null);
        cookies.set("user_id",null);
        this.setState({token:null,user_id:null});
    }

    handleLogin(token,id){
        const cookies = new Cookies();
        cookies.set("token",token);
        cookies.set("user_id",id);
        this.setState({token:token,user_id:id});
    }


    toggleTheme () {
        let darkTheme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });
        let lightTheme = createMuiTheme({
            palette: {
                type: 'light',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });
        this.setState(state => ({
            theme:state.isDarkTheme ? lightTheme : darkTheme,
            isDarkTheme: !state.isDarkTheme
            }),() => this.forceUpdate()
        );

    }



    render() {

        return(
            <TokenContext.Provider value={this.state}>
                <ThemeProvider theme={this.state.theme}>
            <Router>
                <Switch>
                    <Route path="/login">
                        <Auth onLogin={this.handleLogin} />
                    </Route>
                    <Route path="/registration">
                        <Reg onReg={this.handleLogin}/>
                    </Route>
                    <PrivateRoute token={this.state.token} path="/">
                        <Chat/>
                    </PrivateRoute>
                </Switch>
            </Router>
                </ThemeProvider>
            </TokenContext.Provider>
                );
    }
}
function PrivateRoute({ children, ...rest }) {
    let contextType = TokenContext;
    return (
        <Route
            {...rest}
            render={({ location }) =>
                rest.token != null ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}