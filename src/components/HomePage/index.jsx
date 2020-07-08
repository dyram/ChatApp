import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const [uid, setUid] = useState();
  const [currId, setCurrid] = useState();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userToken"));
    if (data != null) {
      setUid(data.id);
      setCurrid(data.uid);
      setShowLogin(data.validity);
    } else {
      setShowLogin(false);
    }
  }, []);

  const logOutUser = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  const logIn = () => {
    window.location.href = "/login";
  };

  const signUp = () => {
    window.location.href = "/signup";
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            WhatsApp
          </Typography>
          {showLogin ? (
            <Button onClick={logOutUser} color="inherit">
              Logout
            </Button>
          ) : (
            <span>
              <Button onClick={logIn} color="inherit">
                Login
              </Button>{" "}
              /
              <Button onClick={signUp} color="inherit">
                Sign-Up
              </Button>
            </span>
          )}
        </Toolbar>
      </AppBar>
      <br />
    </div>
  );
};

export default HomePage;
