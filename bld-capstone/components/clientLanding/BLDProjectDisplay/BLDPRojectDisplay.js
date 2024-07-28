import React, { useEffect, useState } from 'react';
import { Grid, Typography, ToggleButtonGroup, ToggleButton, Divider, Box, Fade, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getProjectsByID, getMoodBoards } from '@/utils/queries';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';

// PDF Viewer
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function BLDProjectDisplayNew({ setTopLevelProjectChoice }) {
    const [moodboardSortingChoice, setMoodboardSortingChoice] = useState(0);
    const [projectChoice, setProjectChoice] = useState(0);
    const [userProjects, setUserProjects] = useState([]);
    const [userDocuments, setUserDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();
    const router = useRouter();
    const { user, authIsReady } = useAuthContext();

    const logging = true;

    useEffect(() => {
        if (userProjects.length > 0) {
            setTopLevelProjectChoice(userProjects[projectChoice].id);
        }
    }, [userProjects, projectChoice]);

    useEffect(() => {
        if (authIsReady && !user) {
            router.push('/login');
        }
        if (authIsReady && user) {
            setIsLoading(true);
            getProjectsByID(user.uid).then((res) => {
                setUserProjects(res);
                setTopLevelProjectChoice(userProjects[projectChoice].id);
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [authIsReady, user]);

    useEffect(() => {
        if (userProjects.length > 0) {
            setIsLoading(true);

            // Map over userProjects to get an array of promises
            const moodboardPromises = userProjects.map(project =>
                getMoodBoards(project.id)
            );

            Promise.all(moodboardPromises)
                .then(results => {
                    // Flatten the array of arrays
                    const moodboards = results.flat();
                    setUserDocuments(moodboards);
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [userProjects]);

    useEffect(() => {
        if (userDocuments.length > 0) {
            setIsLoading(false);
            logging ? console.log('[FETCH] userDocuments => ', userDocuments) : null;
        }
    }, [userDocuments]);

    // event handlers
    const handleMoodboardSortingChoice = (event, newMoodboardSortingChoice) => {
        logging ? console.log('[EVENT] Moodboard Sorting => ', newMoodboardSortingChoice) : null;
        setMoodboardSortingChoice(newMoodboardSortingChoice);
    };

    const handleProjectChoice = (event, newProjectChoice) => {
        logging ? console.log('[EVENT] Project Choice => ', userProjects[newProjectChoice]) : null;
        console.log(newProjectChoice, " : ", projectChoice);
        if (newProjectChoice === null) {
            return;
        }
        setTopLevelProjectChoice(userProjects[newProjectChoice].id);
        setProjectChoice(newProjectChoice);
    };


    /*
        href={`/markup/${document.projectId}/${document.phaseId}/${version.version}`}

        <img
            key={fileIndex}
            src={file.downloadURL}
            alt={file.name}
            style={{ width: '100%' }}
        />
    */


    // Component-ify all major jsx sections
    const DocumentDisplay = () => {
        if (isLoading) {
            return <Typography>Loading...</Typography>;
        }
        const documentsFilteredByProjectId = userDocuments.filter(docs => docs.projectId === userProjects[projectChoice].id);
        console.log('[INFO] documentsFilteredByProjectId => ', documentsFilteredByProjectId);
        return (
            <div>
                {documentsFilteredByProjectId.map((document, docIndex) => (
                    <Paper elevation={1} key={docIndex} sx={{ mt: 2, p: 2, minWidth: 'fit-content' }}>

                        <Grid item xs={12}>
                            <Typography variant="h4">{document.phaseName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {document.versions.map((version, verIndex) => (
                                    <Grid item xs={3} sx={{ mt: 2 }} key={verIndex}> {/* Each version is a Grid item */}
                                        <Paper elevation={3}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
                                                <Typography variant="h6" sx={{ mx: 2 }}>{version.version}</Typography>
                                                <Link href={`/markup/${document.projectId}/${document.phaseId}/${version.version}`} passHref>
                                                    <IconButton aria-label="edit" sx={{ mx: 2 }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Link>
                                            </Box>
                                            <Fade in={!isLoading} timeout={500}>
                                                <Box p={2}>
                                                    {version.files.map((file, fileIndex) => (
                                                        console.log('PDF or IMAGE', file),
                                                        file && file.id && file.id.endsWith('.pdf') ?
                                                            <Document
                                                                key={fileIndex}
                                                                file={file.downloadURL}>
                                                                <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
                                                                    <Page pageNumber={1} renderMode='canvas' width={200} />
                                                                </Box>
                                                            </Document> :
                                                            <img
                                                                key={fileIndex}
                                                                src={file.downloadURL}
                                                                alt={file.id}
                                                                style={{ width: '100%' }}
                                                            />
                                                    ))}
                                                </Box>
                                            </Fade>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                    </Paper>
                ))}
            </div>
        );
    };



    const SortingPicker = () => {
        return (<>
            <Grid item xs={12} sx={{ display: 'flex' }}>
                <Grid item xs={2}>
                    <Typography variant="h4">Documents</Typography>
                </Grid>
                <ToggleButtonGroup
                    value={moodboardSortingChoice}
                    exclusive
                    onChange={handleMoodboardSortingChoice}
                    aria-label="text alignment"
                    sx={{
                        display: 'flex',
                        flexGrow: 1, // Allow the ToggleButtonGroup to fill all available space
                        justifyContent: 'space-evenly', // Distribute space evenly between buttons
                    }}
                >
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
                    <ToggleButton value={0} sx={{ border: 0, flex: 1 }} aria-label="right aligned">
                        <Typography>All</Typography>
                    </ToggleButton>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
                    <ToggleButton value={1} sx={{ border: 0, flex: 1 }} aria-label="centered">
                        <Typography>Marked</Typography>
                    </ToggleButton>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
                    <ToggleButton value={2} sx={{ border: 0, flex: 1 }} aria-label="left aligned">
                        <Typography>Unmarked</Typography>
                    </ToggleButton>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
                </ToggleButtonGroup>
            </Grid>
        </>);
    }

    const ProjectPicker = () => {
        return (<>
            <Grid item xs={12} sx={{ display: 'flex' }}>
                <Grid item xs={2}>
                    <Typography variant="h4">Projects</Typography>
                </Grid>
                <ToggleButtonGroup
                    value={projectChoice}
                    exclusive
                    onChange={handleProjectChoice}
                    aria-label="text alignment"
                    sx={{
                        display: 'flex',
                        flexGrow: 1, // Allow the ToggleButtonGroup to fill all available space
                        justifyContent: 'space-evenly', // Distribute space evenly between buttons
                    }}
                >
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
                    {userProjects.map((project, index) => {
                        return (
                            <ToggleButton key={index} value={index} sx={{ border: 0, flex: 1 }} aria-label="left aligned">
                                <Typography>{project.projectName}</Typography>
                            </ToggleButton>);
                    })}
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
                </ToggleButtonGroup>
            </Grid>
        </>);
    }

    return (<>
        <ProjectPicker />
        {/* <SortingPicker /> */}
        <DocumentDisplay />
    </>)
}