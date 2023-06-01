import React from 'react';
import '../App.css';
import axios from 'axios';

import {
  TextField,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  TableContainer,
  Table,
  TableBody,
  Paper,
  TableRow,
  TableCell,
  TableHead,
  Collapse,
  Box,
  IconButton,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

function App() {

  const [username, setUsername] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [repositories, setRepositories] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [idxOpen, setIdxOpen] = React.useState<number>();

  function Row(props: { row: ReturnType<typeof createData>, idx: number }) {
    const { row, idx } = props;

    console.log(repositories.filter(x => x['login'] == row.login))
  
    const floatSpan:React.CSSProperties={
      float: "right",
      display: "inline",
      marginRight: "10px",
    };


    return (
      <React.Fragment>
        <TableRow style={{ marginBottom: 6 }} sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open)
                setIdxOpen(idx)
                getUsersPublicRepo(row.login)
              }}
            >
              {((idx == idxOpen)) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="left">{row.login}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={((idx == idxOpen))} timeout="auto" unmountOnExit >
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Repositories
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {repositories.map((historyRow) => (
                      <TableRow key={historyRow}>
                        <TableCell component="th" scope="row">
                          <b>{historyRow['name']}</b>
                          <div style={floatSpan}>
                            {historyRow['watchers']}
                            <img src={"https://ik.imagekit.io/s4gdyhqnx/star.png?updatedAt=1685590158787"} alt="Image" />
                          </div>
                          <br />
                          {historyRow['description']}
                        </TableCell>
                      </TableRow>                      
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }
  
  function createData(
    login: string,
  ) {
    return {
      login,
    };
  }

  function getUsersPublicRepo(user: string = "") {
    var newArray = JSON.parse(JSON.stringify(repositories));
    if (user.length > 0) {
      axios.get(process.env.REACT_APP_BASEURL + "/users/" + user + "/repos").then((x) => {
        if (x.status == 200) {
          setRepositories(x.data)
          console.log(x.data)
        }
      }).catch((e) => console.log(e));
    }
  }

  function getUsers(user: string = "") {
    if (user.length > 0) {
      axios.get(process.env.REACT_APP_BASEURL + "/search/users", { params: { q: user, per_page: 5 }}).then((x) => {
        if (x.status == 200) {
          setUsers(x.data.items)
          console.log(x.data.items)
        }
      }).catch((e) => console.log(e));
    }
  }

  function handleKeypress(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      getUsers(username)
    }
  }
 

  return (
    <div>
      <Grid container direction={"column"} spacing={2} style={styles.pageContainer}>
        <Grid item xl={12} xs={6}>
          <TextField 
            id="outlined-basic" 
            label="Enter username" 
            variant="outlined" 
            style={styles.textField}
            onChange={(x) => setUsername(x.target.value)}
            onKeyPress={handleKeypress}
          />
        </Grid>
        <Grid item xl={12} xs={6}>
          <Button 
            variant="contained" 
            style={styles.buttonSearch}
            onClick={() => getUsers(username)}
          >Search</Button>
        </Grid>
        {
          users.length > 0 ? (
            <Grid item xl={12} xs={6}>
              <div>Showing users for "{username}"</div>
            </Grid>
          ) : null
        }
        <Grid container direction={"column"} style={{
          alignItems: "flex-start",
          paddingLeft: 20,
          marginTop: 10
        }}>
        { users.length > 0 ?
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableBody>
                {users.map((row, index) => (
                  <Row key={index} row={row} idx={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer> : null
        }
        </Grid>
      </Grid>
    </div>
  );
}



const styles = {
  pageContainer: {
    padding: 10,
  },
  textField: {
    width: "100%"
  },
  buttonSearch: {
    width: "100%"
  }
}

export default App;
