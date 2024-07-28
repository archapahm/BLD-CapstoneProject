import * as React from 'react';
import { Button, Container, Grid, Typography, FormControl, TextField, Box, RadioGroup, Radio, FormControlLabel, MenuItem, InputLabel, Select } from '@mui/material';
import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { createProject, getClients, getProjects } from '@/utils/queries';
import { useEffect } from 'react';
import ProjectList from './ProjectList';
import CreateProjectForm from './CreateProjectForm';

export default function Landing(){
    // gets the user and authIsReady from the useAuthContext hook
    const {user, authIsReady } = useAuthContext()
    const [open, setIsOpen] = useState(false)
    const [viewingProject, setViewingProject] = useState(false) //used to display the project creation form button if a project is being viewed
    const [projects, setProjects] = useState([]) // state to hold the list of projects
    

    // used for opening and closing the form
    const openForm = () => setIsOpen(!open) 
    const viewingProjectHandler = () => setViewingProject(!viewingProject) 

        return<>
            <Container sx={{paddingTop:3}}>
                {!viewingProject && // if viewingProject is false, show the button
                    <Button
                        variant="outlined"
                        onClick={openForm}
                        >{open ? 'Cancel' : 'New Project'}</Button>
                }
                {open && // if open is true, show the form
                    <CreateProjectForm user={user} openForm={openForm}/>
                }
            </Container>
            {!open && <ProjectList projects={projects} viewingProjectHandler={viewingProjectHandler}/>}
    </>
}