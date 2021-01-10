import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import electron from "electron";
import React, { useEffect, useState } from "react";
import { AUCTION_LINK_BEGINNING } from "../../lib/constants";
import { AuctionInfo } from "../../../shared/interfaces";
import Character from "./Character";
import { FiCrosshair } from "react-icons/fi";

const ipcRenderer = electron.ipcRenderer || false;

const useStyles = makeStyles((theme) => ({
  tcContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: theme.spacing(2),
    "& img": {
      width: 35,
      height: 35,
      marginRight: 5,
    },
  },
  root: {
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
  },
  getInfoButton: {
    height: 55,
    padding: 10,
  },
  errorBox: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1),
    ...theme.typography.body2,
    "& pre": {
      color: theme.palette.error.main,
      fontFamily: "consolas",
    },
  },
  auctionControls: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    ...theme.typography.body2,
  },
}));

interface Props {
  stepCompleted: () => void;
  tcCount: number | undefined;
}
const SelectAuction: React.FC<Props> = ({ stepCompleted, tcCount }) => {
  const classes = useStyles();
  const [auctionUrl, setAuctionUrl] = useState<string>(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=274442&source=overview"
  );
  const [urlError, setUrlError] = useState<boolean>(false);
  const [auctionInfoError, setAuctionInfoError] = useState<Error>();
  const [auctionLoading, setAuctionLoading] = useState<boolean>(false);
  const [auction, setAuction] = useState<AuctionInfo>();

  const handleSetAuctionInfo = (_, data: AuctionInfo) => {
    console.log("got auction info", data);
    setAuction(data);
    setAuctionLoading(false);
  };
  const handleAuctionInfoError = (_, err) => {
    console.log(err);
    setAuctionInfoError(err);
    setAuctionLoading(false);
    setAuction(undefined);
  };

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("set-auction-info", handleSetAuctionInfo);
      ipcRenderer.on("auction-info-error", handleAuctionInfoError);

      return () => {
        ipcRenderer.off("set-auction-info", handleSetAuctionInfo);
        ipcRenderer.off("auction-info-error", handleAuctionInfoError);
      };
    }
  }, []);

  const getInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auctionUrl || !auctionUrl.startsWith(AUCTION_LINK_BEGINNING)) {
      setUrlError(true);
      return;
    }
    if (ipcRenderer) {
      setAuctionLoading(true);
      setAuctionInfoError(undefined);
      ipcRenderer.send("get-auction-info", auctionUrl);
      console.log("get-auction-info");
    }
  };
  return (
    <>
      <Tooltip title="Available Tibia coins" arrow>
        <Box className={classes.tcContainer}>
          <img src="images/tibia-coins.png" />
          <Typography
            color={tcCount === 0 ? "error" : "initial"}
            component="div"
          >
            <span>
              {tcCount !== undefined ? (
                tcCount
              ) : (
                <CircularProgress size={30} thickness={5} />
              )}
            </span>
          </Typography>
        </Box>
      </Tooltip>
      <form className={classes.root} onSubmit={getInfo}>
        <TextField
          label="Link to auction"
          variant="outlined"
          value={auctionUrl}
          onChange={(e) => setAuctionUrl(e.target.value)}
          onBlur={() => {
            if (!auctionUrl || auctionUrl.startsWith(AUCTION_LINK_BEGINNING)) {
              setUrlError(false);
            } else {
              setUrlError(true);
            }
          }}
          error={urlError}
          helperText={urlError && "Invalid link"}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.getInfoButton}
          type="submit"
        >
          Get Info
        </Button>
      </form>
      {(auction || auctionLoading) && (
        <Character
          character={auction && auction.char}
          loading={auctionLoading}
          endTs={auction && auction.endTs}
        />
      )}
      {/*this is trash just for thumbnail */}
      {auction && (
        <Paper className={classes.auctionControls}>
          <Typography>
            Current bid: <b>{auction.bidValue.toLocaleString("en")}</b>
            <img src="images/tibia-coin.png" />
          </Typography>
          <TextField label="Max bid" />
          <br />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <TextField label="Seconds before end" />{" "}
            <Typography variant="body1">to bid</Typography>
            <Button
              style={{ marginLeft: "auto" }}
              variant="contained"
              color="secondary"
              startIcon={<FiCrosshair />}
            >
              Snipe
            </Button>
          </div>
        </Paper>
      )}
      {auctionInfoError && (
        <Paper variant="outlined" className={classes.errorBox}>
          <pre>{auctionInfoError.message}</pre>
        </Paper>
      )}
    </>
  );
};

export default SelectAuction;
