import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Axios from 'axios';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import SignUp from "./components/SignupPage"


function App() {
  useEffect(() => {
    Axios.get("http://localhost:4000").then(res => {
      console.log(res);
    });
  }, [])

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: green[500],
        contrastText: "#ffffff",
      },
      secondary: {
        light: red[200],
        main: red[400],
        contrastText: "#ffffff",
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            {/* <Route path="/" exact component={() => <Welcome />} /> */}
            <Route path="/signup" component={() => <SignUp />} />
            <Route path="/login" component={() => <LoginPage />} />
            <Route
              crossorigin
              path="/"
              component={() => <HomePage />}
            />
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
