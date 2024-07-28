import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Typography, MenuItem, Box, Button, Select, FormControl, InputLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { getStorage, listAll, ref } from "firebase/storage";
import { getFeedback } from '@/utils/queries';

function FeedbackView({ selectedProject }) {
    console.log(selectedProject);
    const [projectPhases, setProjectPhases] = useState([]);
    const [selectedProjectPhase, setSelectedProjectPhase] = useState('');
    const [projectVersions, setProjectVersions] = useState([]);
    const [selectedProjectVersion, setSelectedProjectVersion] = useState('');
    const [projectImages, setProjectImages] = useState([]);
    const [selectedProjectImage, setSelectedProjectImage] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProjectPhases = async () => {
            setSelectedProjectPhase('');
            setProjectPhases([]);
            setLoading(true);

            if (selectedProject) {
                const db = getFirestore();
                // const phasesRef = collection(db, `phases`);
                const q = query(collection(db, "phases"), orderBy("sequence"));

                try {
                    const snapshot = await getDocs(q);
                    const projectPhases = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.data().title,
                    }));

                    setProjectPhases(projectPhases);
                } catch (error) {
                    console.error('Error fetching project phases:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProjectPhases();

        return () => {
        };
    }, [selectedProject]);

    useEffect(() => {
        const fetchProjectVersions = async () => {

            setSelectedProjectVersion('');
            setProjectVersions([]);

            if (selectedProject && selectedProjectPhase) {
                const db = getFirestore();
                const versionsRef = collection(
                    db,
                    `projectPhase/${selectedProject}/phases/${selectedProjectPhase}/versions`
                );

                try {
                    const snapshot = await getDocs(versionsRef);
                    const projectVersions = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.data().version,
                    }));

                    setProjectVersions(projectVersions);
                } catch (error) {
                    console.error('Error fetching project versions:', error);
                }
            }
        };

        fetchProjectVersions();
    }, [selectedProject, selectedProjectPhase]);

    useEffect(() => {
        const fetchProjectImages = async () => {
            setSelectedProjectImage('');
            setProjectImages([]);

            if (selectedProject && selectedProjectPhase && selectedProjectVersion) {
                const db = getFirestore();
                const imagesRef = collection(
                    db,
                    `projectPhase/${selectedProject}/phases/${selectedProjectPhase}/versions/${selectedProjectVersion}/files`
                );

                try {
                    const snapshot = await getDocs(imagesRef);
                    const projectImages = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.data().imageName,
                        url: doc.data().imageURL,
                    }));

                    setProjectImages(projectImages);
                } catch (error) {
                    console.error('Error fetching project images:', error);
                }
            }
        };

        fetchProjectImages();
    }, [selectedProject, selectedProjectPhase, selectedProjectVersion]);

    useEffect(() => {
        if (selectedProject && selectedProjectPhase && selectedProjectVersion && selectedProjectImage) {
            const fetchFeedback = async () => {
                try {
                    const feedbackData = await getFeedback(
                        selectedProject,
                        selectedProjectPhase,
                        selectedProjectVersion,
                        selectedProjectImage
                    );
                    setFeedback(feedbackData);
                } catch (error) {
                    console.error('Error fetching feedback:', error);
                }
            };

            fetchFeedback();
        }
    }, [selectedProject, selectedProjectPhase, selectedProjectVersion, selectedProjectImage]);

    return (
        <Container component="main">
            <Typography variant="h3" align="center" sx={{ marginTop: 8, marginBottom: 2 }}>
                Feedback Information
            </Typography>
            <Box component="form" noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="selectedProjectPhase">Select a Phase</InputLabel>
                            <Select
                                name="selectedProjectPhase"
                                value={selectedProjectPhase}
                                onChange={(event) => setSelectedProjectPhase(event.target.value)}
                                label="Select a Phase"
                                required
                            >
                                <MenuItem value="">Select a Phase</MenuItem>
                                {projectPhases.map((projectPhase) => (
                                    <MenuItem key={projectPhase.id} value={projectPhase.id}>
                                        {projectPhase.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {selectedProjectPhase && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="selectedProjectVersion">Select a Version</InputLabel>
                                <Select
                                    name="selectedProjectVersion"
                                    value={selectedProjectVersion}
                                    onChange={(event) => setSelectedProjectVersion(event.target.value)}
                                    label="Select a Version"
                                    required
                                >
                                    <MenuItem value="">Select a Version</MenuItem>
                                    {projectVersions.map((projectVersion) => (
                                        <MenuItem key={projectVersion.id} value={projectVersion.id}>
                                            {projectVersion.id}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {selectedProjectVersion && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="selectedProjectImage">Select an Image</InputLabel>
                                <Select
                                    name="selectedProjectImage"
                                    value={selectedProjectImage}
                                    onChange={(event) => setSelectedProjectImage(event.target.value)}
                                    label="Select an Image"
                                    required
                                >
                                    <MenuItem value="">Select an Image</MenuItem>
                                    {projectImages.map((projectImage) => (
                                        <MenuItem key={projectImage.id} value={projectImage.id}>
                                            {projectImage.id}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {selectedProjectPhase && selectedProjectVersion && selectedProjectImage && feedback ? (
                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                                <Typography>
                                    <strong>Email:</strong> {feedback.email || 'No email provided'}
                                </Typography>
                                <Typography style={{ marginTop: 10 }}>
                                    <strong>Comment:</strong> {feedback.comment || 'No feedback provided'}
                                </Typography>
                            </Paper>
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                                <Typography variant="h5">No feedback available</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );

}

export default FeedbackView;
