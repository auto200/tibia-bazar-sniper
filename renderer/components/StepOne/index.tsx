import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControlLabel,
  makeStyles,
  Paper,
  Switch,
  Typography,
} from "@material-ui/core";
import SecretInput from "./SecretInput";
import electron from "electron";

const ipcRenderer = electron.ipcRenderer || false;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    textAlign: "center",
  },
  errorBox: {
    padding: 10,
    fontSize: 18,
    "& pre": {
      color: theme.palette.error.main,
      fontFamily: "consolas",
    },
  },
}));

interface Props {
  stepCompleted: () => void;
}
const Login: React.FC<Props> = ({ stepCompleted }) => {
  const classes = useStyles();

  const [email, setEmail] = useState<string>("giromo7482@1092df.com");
  const [showEmail, setShowEmail] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("A1234567890");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showBrowser, setShowBrowser] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const handleLoginSuccess = () => {
    console.log("all good dudue");
    setError(null);
    setLoading(false);
    stepCompleted();
  };
  const handleLoginFail = (_, error: Error) => {
    console.log("error");
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("login-success", handleLoginSuccess);
      ipcRenderer.on("login-fail", handleLoginFail);

      return () => {
        ipcRenderer.off("login-success", handleLoginSuccess);
        ipcRenderer.off("login-fail", handleLoginFail);
      };
    }
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ipcRenderer) return;
    ipcRenderer.send("login", { login: email, password, showBrowser });
    setError(null);
    setLoading(true);
  };
  return (
    <form className={classes.paper} onSubmit={onSubmit}>
      <SecretInput
        id="email"
        label="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        showValue={showEmail}
        toggleShowValue={() => setShowEmail((prev) => !prev)}
        value={email}
      />
      <br />
      <SecretInput
        id="password"
        label="Tibia Password"
        onChange={(e) => setPassword(e.target.value)}
        showValue={showPassword}
        toggleShowValue={() => setShowPassword((prev) => !prev)}
        value={password}
      />
      <FormControlLabel
        control={
          <Switch
            checked={showBrowser}
            onChange={(e) => setShowBrowser(e.target.checked)}
            color="primary"
          />
        }
        label="Show browser window"
      />
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Login
      </Button>
      {error && (
        <Paper variant="outlined" className={classes.errorBox}>
          <pre>{error.message}</pre>
        </Paper>
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <div>
          <CircularProgress color="inherit" />
          <Typography variant="h6">Logging In</Typography>
        </div>
      </Backdrop>
    </form>
  );
};

export default Login;
