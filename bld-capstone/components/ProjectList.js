import {  Table, TableContainer, TableCell, TableBody, Paper, TableRow, TableHead, Container, LinearProgress, Button, Grid, TablePagination, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { getProjects } from "@/utils/queries";
import { useState, useEffect } from "react";
import ProjectDetails from "./projectDetails";
import { PortableWifiOff } from "@mui/icons-material";

export default function ProjectList({projects, viewingProjectHandler}){

    const [projectList, setProjectList] = useState([projects]);
    const [projectToView, setProjectToView] = useState({})
    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [viewProject, setViewProject] = useState(true)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderBy, setOrderBy] = useState("projectName");
    const [order, setOrder] = useState("asc");
    
    const getAllProjects = async () => {
        return await getProjects();
    }

    useEffect(() => {
        getAllProjects().then((projects) => {
            setProjectList(projects); 
            setProjectsLoaded(true);
        });
    }, []);

    const returnToProjects = () => {
        viewingProjectHandler();
        setViewProject(true);
    }

    const openProject = (id) => {
        const project = projectList.find((project) => project.id === id);
        setProjectToView(project);
        setViewProject(false);
        viewingProjectHandler();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleOrderBy = (event) => {
        setOrderBy(event.target.value);
    };

    const handleOrder = (event) => {
        setOrder(event.target.value);
    };

    const filteredProjects = projectList.filter((project) => {
        return project.projectName && project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortedProjects = filteredProjects.sort((a, b) => {
        if (order === "asc") {
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    if(!projectsLoaded){
        return <><Container sx={{paddingTop:3}}><LinearProgress /></Container></>
    }else if(viewProject){
        return <>
            <Container sx={{paddingTop:3}}>
                <Typography variant="h4" marginBottom={2}>Projects</Typography>
                <Grid container spacing={2} marginBottom={1}>
                    <Grid item xs={12} sm={6} >
                        <TextField
                            label="Search Projects"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearch}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <Select size="small" value={orderBy} onChange={handleOrderBy}>
                                <MenuItem value="projectName">Project Name</MenuItem>
                                <MenuItem value="client">Client</MenuItem>
                            </Select>
                            <FormHelperText>Order By</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <Select size="small" value={order} onChange={handleOrder}>
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                            <FormHelperText>Sort</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ marginBottom: 0 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                        <TableHead sx={{backgroundColor: '#454545'}}>
                            <TableRow >
                                <TableCell width="50%">Project Name</TableCell>
                                <TableCell align="right" width="25%">Client</TableCell>
                                <TableCell align="right" width="25%"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {(rowsPerPage > 0
                            ? sortedProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : sortedProjects
                        ).map((project) => (
                            <TableRow
                            key={project.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {project.projectName}
                                </TableCell>
                                <TableCell align="right">{project.client}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="primary" onClick={() => openProject(project.id)}>View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        component="div"
                        count={sortedProjects.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Container>
        </>
    }else{
        return <>
            <Container>
                <Grid container columns={12}>
                    <Grid item xs={9}>
                        <ProjectDetails project={projectToView} />
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{marginTop:4}} color="primary" onClick={returnToProjects}>Back To Projects</Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    }
}