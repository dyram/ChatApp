import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import Axios from "axios";

import io from "socket.io-client";

const socket = io("http://localhost:4000/");

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
  list: {
    width: "100%",
    // maxWidth: 200,
    backgroundColor: theme.palette.background.paper,
  },
  textfield: {
    width: "100%",
    marginTop: "auto",
  },
}));

const HomePage = () => {
  const classes = useStyles();

  const [uid, setUid] = useState();
  const [currId, setCurrid] = useState();
  const [showLogin, setShowLogin] = useState(false);

  const [users, setUsers] = useState([]);
  const [reciever, setReciever] = useState("No User Selected");
  const [recId, setRecId] = useState();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userToken"));
    if (data != null) {
      setUid(data.id);
      setCurrid(data.uid);
      setShowLogin(data.validity);
      getUsers();
      socket.on("new_message", (data) => {
        console.log("NEW MESSAGE", data);
      });
    } else {
      setShowLogin(false);
    }
  }, []);

  const getUsers = () => {
    Axios.get("http://localhost:4000/users").then((res) => {
      console.log("USERS GET", res);
      if (res.status === 200) {
        setUsers([...res.data]);
      }
    });
  };

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

  const sendMessage = () => {
    socket.emit("new_message", {
      message,
      from: currId,
      to: reciever,
      toId: recId,
    });
    setMessage("");
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
      {showLogin ? (
        <div>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <List className={classes.list}>
                <Typography variant="overline">&nbsp;Your Contacts</Typography>
                {users.map((obj) => (
                  <div>
                    {obj.id !== currId ? (
                      <div>
                        <ListItem
                          onClick={(e) => {
                            setReciever(obj.username);
                            setRecId(obj.id);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>{obj.username[0].toUpperCase()}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <React.Fragment>
                                <Typography variant="button">
                                  {obj.username}
                                </Typography>
                              </React.Fragment>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography variant="body2" color="disabled">
                                  {obj.email}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <hr />
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                ))}
              </List>
            </Grid>
            <Grid item xs={8} style={{ background: "#edf1ff" }}>
              <AppBar position="static">
                <Toolbar variant="dense">
                  <Typography variant="h6" color="inherit">
                    {reciever}
                  </Typography>
                </Toolbar>
              </AppBar>
              <div style={{ padding: "1%", height: "70vh" }}>
                <div>
                  <Typography variant="button">User</Typography>
                  <Paper style={{ padding: "1%" }} elevation={3}>
                    Messages
                  </Paper>
                </div>
                <div>
                  <Typography variant="button">User</Typography>
                  <Paper style={{ padding: "1%" }} elevation={3}>
                    Messages
                  </Paper>
                </div>
              </div>
              <Grid
                position="static"
                container
                spacing={2}
                style={{ alignItems: "center" }}
              >
                <Grid item xs={10}>
                  <TextField
                    className={classes.textfield}
                    position="absolute"
                    id="filled-basic"
                    label="Send a Message"
                    variant="filled"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={sendMessage} color="primary">
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default HomePage;
