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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import red from "@material-ui/core/colors/red";

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
    width: "150%",
  },
  papers: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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

  const [groups, setGroups] = useState([]);

  const [toGroupId, setToGroupId] = useState("");
  const [isGroupMessage, setIsGroupMessage] = useState(false);

  const [addOpen, setAddOpen] = useState(false);

  const [gName, setGName] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const handleClickOpen = () => {
    setAddOpen(true);
  };

  const handleClose = () => {
    setAddOpen(false);
    setGName("");
    setTag("");
    setTags([]);
  };

  const handleDelete = (chipToDelete) => () => {
    setTags((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleUser = (event) => {
    setTags((tags) => [
      ...tags,
      {
        key: event.target.value,
        label:
          users[users.findIndex((obj) => obj.id === event.target.value)]
            .username,
      },
    ]);
    setTag("");
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userToken"));
    if (data != null) {
      setUid(data.id);
      setCurrid(data.uid);
      setShowLogin(data.validity);
      getUsers();
      getSpecGroups(data.uid);

      socket.on("new_message", (data) => {
        console.log("NEW MSG", data);
        setMessages((messages) => [...messages, data]);
      });

      socket.on("new_group_created", (data) => {
        console.log("NEW Grp", data);
        setGroups((groups) => [...groups, data]);
      });

      socket.on("new_group_message_server", (data) => {
        console.log("NEW Grp message", data);
        setMessages((messages) => [...messages, data]);
      });
    } else {
      setShowLogin(false);
    }
  }, []);

  const getSpecGroupsMessage = (gid) => {
    Axios.post("http://localhost:4000/specGroupMessage", {
      from: currId,
      GroupId: gid,
    }).then((res) => {
      console.log("SPEC MSG GROUPS GET", res);
      if (res.status === 200) {
        setMessages([...res.data]);
      }
    });
  };

  const getUsers = () => {
    Axios.get("http://localhost:4000/users").then((res) => {
      console.log("USERS GET", res);
      if (res.status === 200) {
        setUsers([...res.data]);
      }
    });
  };

  const getSpecMessages = (toId) => {
    Axios.post("http://localhost:4000/specMessage", {
      from: currId,
      to: toId,
    }).then((res) => {
      console.log("SPEC MSG GET", res);
      if (res.status === 200) {
        setMessages([...res.data]);
      }
    });
  };

  const getSpecGroups = (UserId) => {
    Axios.post("http://localhost:4000/specGroups", {
      UserId,
    }).then((res) => {
      console.log("SPEC GROUPS GET", res);
      if (res.status === 200) {
        setGroups([...res.data]);
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
    if (!isGroupMessage) {
      socket.emit("new_message", {
        text: message,
        from: currId,
        // toRecv: reciever,
        to: recId,
      });
      setMessage("");
    } else {
      socket.emit("new_group_message", {
        text: message,
        from: currId,
        // toRecv: reciever,
        GroupId: toGroupId,
      });
      setMessage("");
    }
  };

  const addGroup = () => {
    socket.emit("new_group", {
      name: gName,
      users: tags,
      createdAt: new Date(),
    });
    handleClose();
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
                            getSpecMessages(obj.id);
                            setIsGroupMessage(false);
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
              <List className={classes.list}>
                <Grid container spacing={0}>
                  <Grid item xs={6}>
                    <Typography variant="overline">
                      &nbsp;Your Groups
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={handleClickOpen} variant="contained">
                      Create New Group
                    </Button>
                  </Grid>
                </Grid>
                {groups.map((obj) => (
                  <div>
                    <div>
                      <ListItem
                        onClick={(e) => {
                          setReciever(obj.name);
                          setToGroupId(obj.id);
                          getSpecGroupsMessage(obj.id);
                          setIsGroupMessage(true);
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>{obj.name[0].toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography variant="button">
                                {obj.name}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" color="disabled">
                                Created at :{" "}
                                {new Date(obj.createdAt).toLocaleDateString()}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <hr />
                    </div>
                  </div>
                ))}
              </List>
              <Dialog
                open={addOpen}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Create new group
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add Users to your new group...
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Group Name"
                    fullWidth
                    value={gName}
                    onChange={(e) => setGName(e.target.value)}
                  />
                  <br />
                  <br />
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Select User
                    </InputLabel>
                    <Select
                      labelId="to-label"
                      id="to"
                      value={tag}
                      onChange={handleUser}
                    >
                      {users.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id}>
                          {obj.username} - {obj.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <br />
                  <br />
                  <Paper component="ul" className={classes.papers}>
                    {tags.map((data) => {
                      return (
                        <li key={data.key}>
                          <Chip
                            label={data.label}
                            onDelete={handleDelete(data)}
                            className={classes.chip}
                          />
                        </li>
                      );
                    })}
                  </Paper>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    onClick={addGroup}
                    variant="contained"
                    color="primary"
                  >
                    Create Group
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid item xs={8} style={{ background: "#edf1ff" }}>
              <AppBar position="static">
                <Toolbar variant="dense">
                  <Typography variant="h6" color="inherit">
                    {reciever}
                  </Typography>
                </Toolbar>
              </AppBar>
              {/* <div style={{ padding: "1%", height: "100vh" }}> */}
              <div>
                {messages.map((obj) => (
                  <div
                    style={{
                      maxWidth: "30%",
                      marginLeft: obj.from === currId ? "auto" : 0,
                    }}
                  >
                    <Typography variant="button">
                      {
                        users[users.findIndex((ob) => ob.id === obj.from)]
                          .username
                      }
                    </Typography>
                    <Paper
                      style={{
                        padding: "3%",
                        background: obj.from === currId ? "wheat" : "white",
                        color: obj.from === currId ? "black" : "black",
                      }}
                      elevation={3}
                    >
                      {obj.text}
                    </Paper>
                  </div>
                ))}
              </div>
              {/* <Grid
                container
                spacing={2}
                style={{ alignItems: "center", position: "fixed", bottom: 0 }}
              >
                <Grid item xs={10}>
                  <TextField
                    className={classes.textfield}
                    // position="absolute"
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
              </Grid> */}
              <div
                style={{
                  position: "fixed",
                  bottom: 0,
                }}
              >
                <Grid container>
                  <Grid item xs={6}>
                    <TextField
                      className={classes.textfield}
                      // position="absolute"
                      id="filled-basic"
                      label="Send a Message"
                      variant="filled"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={sendMessage} color="primary">
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </div>
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
