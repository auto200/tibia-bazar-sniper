import React from "react";
import {
  Box,
  makeStyles,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  withStyles,
} from "@material-ui/core";
import {
  AccountBox,
  GitHub,
  VpnKey,
  YoutubeSearchedFor,
} from "@material-ui/icons";
import { FiCrosshair } from "react-icons/fi";
import clsx from "clsx";
const { shell } = require("electron");

const useStyles = makeStyles((theme) => ({
  box: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  bottomBar: {
    height: 24,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    "& svg:hover": {
      cursor: "pointer",
    },
  },
}));

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  },
});

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const steps = ["Login", "Select Auction", "Snipe"];

const StepIcon = (props: StepIconProps) => {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const stepIcons = [
    null,
    <VpnKey />,
    <AccountBox />,
    <FiCrosshair size={22} />,
  ];
  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {stepIcons[props.icon.toString()]}
    </div>
  );
};

interface Props {
  activeStep: number;
}
const Footer: React.FC<Props> = ({ activeStep }) => {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* <div className={classes.bottomBar}>
        <GitHub onClick={() => shell.openExternal("https://github.com")} />
        contact/paypal - michal.warac@gmail.com
      </div> */}
    </Box>
  );
};

export default Footer;
