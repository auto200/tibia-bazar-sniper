import electron from "electron";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Backdrop,
  Box,
  Container,
  Typography,
} from "@material-ui/core";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import Footer from "../components/Footer";
import { FiCrosshair } from "react-icons/fi";

const ipcRenderer = electron.ipcRenderer || false;

const useStyles = makeStyles((theme) => ({
  avatarWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  avatar: {
    width: 50,
    height: 50,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: theme.spacing(1),
    textAlign: "center",
  },
}));

const Home = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [tcCount, setTcCount] = useState<number | undefined>();
  const [fatalError, setFatalError] = useState<boolean>(false);

  const stepCompleted = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleSetTcCount = (_, tcCount) => {
    setTcCount(tcCount);
  };
  const handleLogOff = () => {
    setFatalError(true);
  };

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("set-tc-count", handleSetTcCount);
      ipcRenderer.on("logged-off", handleLogOff);

      return () => {
        ipcRenderer.off("set-tc-count", handleSetTcCount);
      };
    }
  }, []);

  useEffect(() => {
    if (activeStep === 1) {
      if (ipcRenderer) {
        ipcRenderer.send("get-tc-count");
      }
    }
  }, [activeStep]);

  return (
    <Container component="main">
      <Box className={classes.avatarWrapper}>
        <Avatar className={classes.avatar}>
          <img src="/images/logo.gif" />
        </Avatar>
      </Box>
      {activeStep === 0 && <StepOne stepCompleted={stepCompleted} />}
      {activeStep == 1 && (
        <StepTwo stepCompleted={stepCompleted} tcCount={tcCount} />
      )}
      <Footer activeStep={activeStep} />
      <Backdrop className={classes.backdrop} open={fatalError}>
        <div>
          <Typography variant="h3">An error occured.</Typography>
          <Typography variant="h6">
            You probably got signed off. If you want to see the preview of what
            is happening on website, please toggle on the{" "}
            <i>Show browser window</i> option.
          </Typography>
          <Typography variant="h4">Restart the application now</Typography>
        </div>
      </Backdrop>
    </Container>
  );
};

export default Home;
