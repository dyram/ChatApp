import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

import "./index.css";
import Axios from "axios";

import GoogleLogin from "react-google-login";
// import { PostData } from "../../services/PostData";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [redirect, setRedirect] = useState(false);

  const loginUser = () => {
    Axios.post("http://localhost:4000/login", { email, password }).then(
      (res) => {
        if (res.data.validity) {
          localStorage.setItem("userToken", JSON.stringify(res.data));
          window.location.href = "/";
        }
      }
    );
  };

  const responseGoogle = (response) => {
    console.log(response);
    let res = response.profileObj;
    console.log(res);
    signup(response);
  };

  const signup = (res) => {
    const googleresponse = {
      Name: res.profileObj.name,
      email: res.profileObj.email,
      token: res.googleId,
      Image: res.profileObj.imageUrl,
      ProviderId: "Google",
    };
    Axios.post("http://localhost:4000/googleLogin", googleresponse).then(
      (result) => {
        console.log("GOOGLE RESULT", result);
        let responseJson = result;
        localStorage.setItem("userToken", JSON.stringify(res.data));
        window.location.href = "/";
      }
    );
  };

  return (
    <div className="login-form-div">
      <h1>LOGIN</h1>
      <TextField
        type="email"
        required
        id="outlined-required-email"
        label="Email"
        // defaultValue="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <TextField
        type="password"
        required
        id="outlined-required-password"
        label="Password"
        // defaultValue="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />
      <br />
      <br />
      <Button onClick={loginUser} variant="contained" color="primary">
        Login
      </Button>
      <br />
      <span>
        <p className="italic-text">
          Don't have an account? <Link href="/signup">Sign-up</Link> now
        </p>
      </span>

      <GoogleLogin
        clientId="492325847823-220on0hjt640v8shhnuafvesmuikpamv.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default LoginPage;
