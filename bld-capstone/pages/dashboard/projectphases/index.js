import React, { useEffect } from 'react';
import Layout from '../layout';
import Link from 'next/link';
import { useState, useCallback } from "react";


import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Container, Stack, TextField,Typography } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadMoodboards from '@/components/upload/upload-moodboards';
import UploadMoodboardsWithProps from '@/components/upload/upload-moodboards-with-props';

import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import UploadFiles from '@/components/upload/upload-files';

const Page = () => {
  const [phases, setPhases] = useState();

  // Fetch the phases documents from Firestore
  const getPhases = async () => {
    const q = query(collection(db, "phases"), orderBy("sequence"));

    try {
      const querySnapshot = await getDocs(q);
      const phases = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setPhases(phases);
    } catch (error) {
      console.error("Error fetching phases: ", error);
    }
  }

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
    getPhases();
  },[]); 

  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

    return (
      <>
            <Breadcrumbs 
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
            >
                <Link 
                    underline="hover" 
                    color="inherit" 
                    href="/dashboard"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Dashboard
                </Link>
                <Typography>
                    Project Phases
                </Typography>
            </Breadcrumbs>

            {/* ADD YOUR CODE HERE */} 

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
            <Container maxWidth="xl">
              <Stack spacing={3}
                sx={{mb: 3}}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      Project Phases
                    </Typography>
                  </Stack>
                </Stack>
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
          </Stack>
            <div>
              {(phases && selectedProject) && phases.map((phase) => {
                return (
                  <Accordion expanded={expanded === phase.code} onChange={handleChange(phase.code)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={phase.code}
                      id={phase.id}>
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {phase.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <UploadFiles 
                        id={selectedProject && selectedProject.id}
                        phaseId={phase && phase.id}/>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </div> 
        </Container>
      </Box>
                      

      </>
    )
}

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  
  export default Page;