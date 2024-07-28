import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Typography, MenuItem, Box, Button, Select, FormControl, InputLabel } from '@mui/material';
import { useRouter } from 'next/router';
import { addFeedback } from '@/utils/queries';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function FeedbackForm(selectedProject) {
  console.log(selectedProject);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [projectPhases, setProjectPhases] = useState([]);
  const [selectedProjectPhase, setSelectedProjectPhase] = useState('');
  const [projectVersions, setProjectVersions] = useState([]);
  const [selectedProjectVersion, setSelectedProjectVersion] = useState('');
  const [projectImages, setProjectImages] = useState([]);
  const [selectedProjectImage, setSelectedProjectImage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const [phaseError, setPhaseError] = useState('');
  const [versionError, setVersionError] = useState('');
  const [imageError, setImageError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
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
  }, [selectedProject.selectedProject]);

  useEffect(() => {
    const fetchProjectVersions = async () => {
      setSelectedProjectVersion('');
      setProjectVersions([]);

      if (selectedProject && selectedProjectPhase) {
        const db = getFirestore();
        const versionsRef = collection(
          db,
          `projectPhase/${selectedProject.selectedProject}/phases/${selectedProjectPhase}/versions`
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
  }, [selectedProject.selectedProject, selectedProjectPhase]);

  useEffect(() => {
    const fetchProjectImages = async () => {
      setSelectedProjectImage('');
      setProjectImages([]);

      if (selectedProject && selectedProjectPhase && selectedProjectVersion) {
        const db = getFirestore();
        const imagesRef = collection(
          db,
          `projectPhase/${selectedProject.selectedProject}/phases/${selectedProjectPhase}/versions/${selectedProjectVersion}/files`
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
  }, [selectedProject.selectedProject, selectedProjectPhase, selectedProjectVersion]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setPhaseError('');
    setVersionError('');
    setImageError('');
    setEmailError('');
    setFeedbackError('');

    // Validate form fields
    if (!selectedProjectPhase) {
      setPhaseError('Please select a phase.')
    }

    if (!selectedProjectVersion) {
      setVersionError('Please select a version.');
    }

    if (!selectedProjectImage) {
      setImageError('Please select an image.');
    }

    if (!email) {
      setEmailError('Please provide your email.');
    }

    if (!feedback) {
      setFeedbackError('Please provide your feedback.');
    }

    if (phaseError || versionError || imageError || emailError || feedbackError) {
      return;
    }

    if (selectedProjectImage != "" && feedback != "" && email != "") {
      const feedbackPath = `projectPhase/${selectedProject.selectedProject}/phases/${selectedProjectPhase}/versions/${selectedProjectVersion}/files/${selectedProjectImage}`;

      const db = getFirestore();
      const feedbackDocRef = doc(db, feedbackPath);

      try {
        const feedbackDoc = await getDoc(feedbackDocRef);

        if (feedbackDoc.exists() && feedbackDoc.data().comment) {
          setOpenDialog(true);
        } else {
          submitFeedback();
        }
      } catch (error) {
        console.error('Error checking for existing feedback:', error);
      }
    }
  };

  const submitFeedback = () => {
    addFeedback(selectedProject.selectedProject, selectedProjectPhase, selectedProjectVersion, selectedProjectImage, email, feedback)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        console.error('Error submitting feedback:', error);
      });
  };

  const handleConfirm = (confirmed) => {
    setOpenDialog(false);
    if (confirmed) {
      submitFeedback();
    }
  };


  return (
    <Container component="main" maxWidth="sm">
      <Typography
        variant="h3"
        align="center"
        sx={{ marginTop: 8, marginBottom: 2 }}
      >
        Feedback Form
      </Typography>
      <Typography
        variant='body1'
        align='center'
        sx={{ marginBottom: 2 }}
      >
        Have a question or feedback about the project? Please provide us some response on some improvements we can make to the project!
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel htmlFor="selectedProjectPhase">Select a Phase</InputLabel>
              <Select
                name='selectedProjectPhase'
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
              <Typography variant="caption" color="error">
                {phaseError}
              </Typography>
            </FormControl>
          </Grid>
          {selectedProjectPhase && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel htmlFor="selectedProjectVersion">Select a Version</InputLabel>
                <Select
                  name='selectedProjectVersion'
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
                <Typography variant="caption" color="error">
                  {versionError}
                </Typography>
              </FormControl>
            </Grid>
          )}
          {selectedProjectVersion && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel htmlFor="selectedProjectImage">Select a Image</InputLabel>
                <Select
                  name='selectedProjectImage'
                  value={selectedProjectImage}
                  onChange={(event) => setSelectedProjectImage(event.target.value)}
                  label="Select a Image"
                  required
                >
                  <MenuItem value="">Select an Image</MenuItem>
                  {projectImages.map((projectImage) => (
                    <MenuItem key={projectImage.id} value={projectImage.id}>
                      {projectImage.id}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {imageError}
                </Typography>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Client Email"
              variant="outlined"
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Typography variant="caption" color="error">
              {emailError}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Feedback Responses"
              variant="outlined"
              multiline
              rows={4}
              name="feedback"
              required
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
            />
            <Typography variant="caption" color="error">
              {feedbackError}
            </Typography>
          </Grid>
          <Dialog open={openDialog} onClose={() => handleConfirm(false)}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              Are you sure you want to overwrite the current feedback inside the image?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleConfirm(false)}>Cancel</Button>
              <Button onClick={() => handleConfirm(true)}>Yes</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}