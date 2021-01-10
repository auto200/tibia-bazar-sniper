import { Box, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { Character as CharacterI } from "../../../shared/interfaces";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  loader: {
    height: 350,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 64,
    height: 64,
    overflow: "hidden",
    marginRight: theme.spacing(1),
    "& img": { width: 80, height: 80, transform: "translate(-25px,-20px)" },
  },
  info: {
    display: "flex",
    flexDirection: "column",
  },
  flag: {
    width: 25,
    height: 15,
    marginLeft: 5,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
interface Props {
  character: CharacterI;
  loading: boolean;
  endTs: number;
}
const Character: React.FC<Props> = ({ character, loading, endTs }) => {
  const classes = useStyles();
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    if (!endTs) return;
    const interval = setInterval(() => {
      if (endTs - Date.now() <= 0) {
        setTimeString("Auction ended");
        clearInterval(interval);
        return;
      }
      const d = differenceInDays(endTs, Date.now());
      const h = differenceInHours(endTs, Date.now()) % 24;
      const m = differenceInMinutes(endTs, Date.now()) % 60;
      const s = differenceInSeconds(endTs, Date.now()) % 60;
      let str = "";
      if (d) str += `${d.toString().padStart(2, "0")}d `;
      if (h) str += `${h.toString().padStart(2, "0")}h `;
      if (m) str += `${m.toString().padStart(2, "0")}m `;
      str += `${s.toString().padStart(2, "0")}s`;
      setTimeString(str);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endTs]);

  let flagSrc = "";
  if (character) {
    if (character.World.endsWith("bra")) flagSrc = "/images/BR.svg";
    else if (character.World.endsWith("era")) flagSrc = "/images/US.svg";
    else flagSrc = "/images/GB.svg";
  }

  return (
    <Paper className={classes.root}>
      {loading ? (
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      ) : (
        <Box className={classes.topBar}>
          <Typography variant="h6">{character.Name}</Typography>
          <Typography variant="h6"> {timeString}</Typography>
        </Box>
      )}
      <Box display="flex" alignItems="center">
        <span className={classes.imageContainer}>
          {loading ? (
            <Skeleton animation="wave" component="img" />
          ) : (
            <img src={character.OutfitSrc} />
          )}
        </span>
        <Grid container spacing={1}>
          <Grid xs={4} item>
            <Typography variant="body2">
              {loading ? (
                <Skeleton animation="wave" />
              ) : (
                `Level: ${character.Level}`
              )}
            </Typography>
          </Grid>
          <Grid xs={7} item>
            <Typography variant="body2">
              {loading ? (
                <Skeleton animation="wave" />
              ) : (
                `Vocation: ${character.Vocation}`
              )}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography variant="body2">
              {loading ? <Skeleton animation="wave" /> : character.Sex}
            </Typography>
          </Grid>
          <Grid xs={7} item>
            <Typography variant="body2">
              {loading ? (
                <Skeleton animation="wave" />
              ) : (
                `World: ${character.World}`
              )}
              {!loading && <img src={flagSrc} className={classes.flag} />}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Character;
