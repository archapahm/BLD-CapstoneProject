import React, {useEffect, useState} from "react";
import { db } from "@/firebase/config";
import { Timestamp, collection, getDocs } from 'firebase/firestore';

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { TableContainer, Table, TableCell, TableRow, TableHead, TableBody, Autocomplete, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { addStartTime, addStopTime, getRunningTime, getTimeListByProject } from "@/firebase/projectTracker";

import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import moment from "moment";

function TimeTracker() {

  const [times, setTimes] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [message, setMessage] = useState('')
  const [subCollection, setSubCollection] = useState();
  const [timerList, setTimerList] = useState([]);

  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch the project documents from Firestore
  const fetchProjectList = async () => {
      const projectRef = collection(db, "projects");

      try {
      const snapshot = await getDocs(projectRef);
      const fetchedProject = snapshot.docs
          .map((doc) => ({
          id: doc.id,
          project: doc.data().projectName,
          }))
          .sort((a, b) => (a.project > b.project ? 1 : -1));
      setProjectList(fetchedProject);
      } catch (error) {
      console.error("Error fetching project: ", error);
      }
  };

  useEffect(() => {
      fetchProjectList();
  },[]); 

  useEffect(() => {
    if (selectedProject) {
      getRunningTime(selectedProject.id).then((res) => {
        if (res) {
          setSubCollection(res);
          setStartTime(res.startTime.toDate());
          setMessage('Timer is still running for this project.');
        }
      });

      getTimeListByProject(selectedProject.id).then((res) => {
        const list = [];
        res.forEach((doc) => {
          list.push(doc.data());

        });
        setTimerList(list);
      });

      setMessage('');
      setStartTime(null);
    }
  },[selectedProject]);

  const handleStart = () => {
    if(selectedProject) {
      const generatedStartTime = new Date();
      setMessage('Timer has started')
      addStartTime(selectedProject.id, generatedStartTime );
      setStartTime(generatedStartTime);
    } else {
      setMessage('Please select a project.');
    }
  }

  const handleStop = () => {
    const stopTime = new Date()
    const totalTime = stopTime - startTime
    setTimes([...times, {startTime, stopTime, totalTime}])
    const newTime = {startTime, stopTime, totalTime}
    setTimes([...times, newTime]);

    getRunningTime(selectedProject.id).then((res) => {
      if (res) {
        setSubCollection(res);
        addStopTime(selectedProject.id, res.id, stopTime, totalTime);
        setTimerList([
          ...timerList,
          {
            startTime: res.startTime,
            stopTime: Timestamp.fromDate(stopTime),
            totalTime: totalTime
          }
        ])
      }
    });

    setStartTime(null);
    setMessage('');
   
  }

  // const totalProjectTime = times.reduce((total, time) => total + time.totalTime, 0)
  const totalProjectTime = timerList.map(timer => timer.totalTime).reduce((prev, curr) => prev + curr, 0);

  const formatTime = (time) => {
    let hours = Math.floor(time / 3600000)
    let minutes = Math.floor((time % 3600000) / 60000)
    let seconds = Math.floor((time % 60000) / 1000)

    let formatedTotalTime = hours.toString().padStart(2, '0') + ':' +
                          minutes.toString().padStart(2, '0') + ':' +
                          seconds.toString().padStart(2, '0')

    return formatedTotalTime
  }
  
  return (
    <>
      <Card color="inherit">
        <CardContent sx={{textAlign: 'center'}} >
          {/* <Typography variant="h2">Project Time Tracker</Typography> */}
          
          <Stack sx={{justifyContent: 'center', margin: 3}} direction="row" spacing={2}>

          <Autocomplete
                required
                disablePortal
                id="project-combo-box"
                options={projectList}
                getOptionLabel={(option) =>
                  option.project ? option.project : ""
                }
                value={selectedProject}
                onChange={(e, value) => {
                  if (value !== null) {
                    setSelectedProject(value);
                  }
                }}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => (
                  <TextField {...params} label="Project" />
                )}
              />

            <Button variant="contained" onClick={handleStart} disabled={startTime !== null}
              endIcon={<PlayArrowIcon />}
            >
              Start</Button>
            <Button variant="contained" onClick={handleStop} disabled={startTime == null}
              endIcon={<StopIcon />}
            >
              Stop</Button>
          </Stack>
          <Typography sx={{margin: 3}}>{message}</Typography>
        </CardContent>
      </Card>

      <TableContainer>
        <Table>
          <TableHead> 
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>Stop Time</TableCell>
              <TableCell>Total Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {timerList && timerList.map((time, index) => (
              <TableRow key={index}>
                <TableCell>{time.startTime.toDate().toLocaleString()}</TableCell>
                <TableCell>{time.stopTime.toDate().toLocaleString()}</TableCell>

                <TableCell>{formatTime(time.totalTime)}</TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <Card align="right" sx={{margin: 3, /*border: 1, borderColor: 'text.disabled',*/ maxWidth: 180}}>
        {totalProjectTime !== undefined &&
        <Typography sx={{margin: 2}}>Total Time: {formatTime(totalProjectTime)}</Typography>
        }
        </Card>
      </Box>
    </>
  )
}

export default TimeTracker;