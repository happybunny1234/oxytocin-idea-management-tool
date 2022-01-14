import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Fab, IconButton, TextField, CircularProgress, ClickAwayListener, } from "@mui/material";
import { Text } from "react-native";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import ScatterPlotRoundedIcon from "@mui/icons-material/ScatterPlotRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Ungrouped from "./Ungrouped";
import Grouped from "./Grouped";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  board: {
    width: "100vw",
    height: "100vh",
  },
  title: {
    position: "fixed",
    fontWeight: "bold",
    top: 20,
    left: 20,
    zIndex: 30000,
    display: "flex",
    alignItems: "center",
  },
  toolbar: {
    position: "fixed",
    fontWeight: "bold",
    top: 20,
    right: 20,
    zIndex: 30000,
  },
}));

const newHighlight = {
  body: "Enter your insight!",
  w: 160,
  h: 200,
  bucket: null,
};

const Board = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();

  const [board, setBoard] = useState(null);
  const [edit, setEdit] = useState(false);
  const [grouped, setGrouped] = useState(false);

  const [zoom, setZoom] = useState(100);

  // useEffect(() => {
  //   document.getElementById("main").addEventListener("wheel", (e) => {
  //     setZoom((zoom) => zoom + e.deltaY * 0.1);
  //   });
  // }, []);

  const removeHighlight = (id) => {
    setBoard({
      ...board,
      highlights: board.highlights.filter((el) => el.id !== id),
    });
  };

  useEffect(() => {
    console.log({ board });

    if (board) {
      window.localStorage.setItem(
        board.id,
        JSON.stringify({ ...board, time: Date.now() })
      );

      console.log("saving ", { board });
    }
  }, [board]);

  useEffect(() => {
    const pieces = location.pathname.split("/");
    console.log(pieces);

    let id = null;
    if (pieces.length === 3) id = pieces[2];

    let brd = null;
    if (id) brd = JSON.parse(window.localStorage.getItem(id));

    console.log({ id, board });

    if (brd) {
      setBoard(brd);
    } else if (!id) {
      const newId = uuidv4();

      window.localStorage.setItem(
        newId,
        JSON.stringify({
          id: newId,
          title: "Untitled",
          highlights: [],
          time: Date.now(),
        })
      );

      let boards = JSON.parse(window.localStorage.getItem("boards"));
      if (!boards) boards = [];
      boards.push(newId);

      window.localStorage.setItem("boards", JSON.stringify(boards));

      navigate(`/board/${newId}`);
    } else {
      navigate("/boards");
    }
  }, [location]);

  if (board)
    return (
      <div className={classes.board}>
        {/* <ClickAwayListener
          onClickAway={() => {
            if (edit) setEdit(false);
          }}
        >
          <div className={classes.title}>
            {edit ? (
              <TextField
                id="boardname"
                type="text"
                value={board.title}
                variant="standard"
                inputProps={{
                  style: { fontSize: "2em", padding: 0 },
                }}
                onChange={(event) => {
                  setBoard({ ...board, title: event.target.value });
                }}
              />
            ) : (
              <Typography variant="h4">{board.title}</Typography>
            )}
            <IconButton
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {!edit ? <EditRoundedIcon /> : <CheckRoundedIcon />}
            </IconButton>
          </div>
        </ClickAwayListener> */}
        <Text style={{fontWeight: 'normal', fontSize: '70px'}}> 
          Idea Management Tool
        </Text>
        <div className={classes.toolbar}>
          <Fab
            size="medium"
            onClick={() => {
              setGrouped(!grouped);
            }}
            style={{ margin: "0px 5px" }}
          >
            {grouped ? (
              <ViewColumnRoundedIcon color="primary" />
            ) : (
              <ScatterPlotRoundedIcon color="primary" />
            )}
          </Fab>
          <Fab
            color="primary"
            onClick={() => {
              setBoard({
                ...board,
                highlights: [
                  ...board.highlights,
                  {
                    ...newHighlight,
                    id: uuidv4(),
                    x: window.innerWidth / 2 - 80,
                    y: window.innerHeight / 2 - 100,
                    ...colors[parseInt(Math.random() * colors.length)],
                  },
                ],
              });
            }}
            size="medium"
          >
            <AddRoundedIcon />
          </Fab>
        </div>

        <div id="main" style={{ transform: `scale(${zoom / 100})` }}>
          {board ? (
            !grouped ? (
              <Ungrouped
                highlights={board.highlights}
                updateHighlight={(id, conf) => {
                  setBoard({
                    ...board,
                    highlights: board.highlights.map((el) => {
                      if (el.id === id) return { ...el, ...conf };
                      return el;
                    }),
                  });
                }}
                deleteHighlight={removeHighlight}
              />
            ) : (
              <Grouped
                highlights={board.highlights}
                onChange={(id, conf) => {
                  setBoard({
                    ...board,
                    highlights: board.highlights.map((el) => {
                      if (el.id === id) return { ...el, ...conf };
                      return el;
                    }),
                  });
                }}
                deleteHighlight={removeHighlight}
              />
            )
          ) : (
            <div>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div
      className={classes.board}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Board;
