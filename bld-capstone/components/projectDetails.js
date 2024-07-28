import { Container, Grid, Typography, Button, TextField, Alert, MenuItem, Select, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import UploadMoodboardsWithProps from './upload/upload-moodboards-with-props';
import { updateProject, updateProjectDescription, updateProjectPhase, togglePhase } from '@/utils/queries';
import UploadFiles from './upload/upload-files';
import { getPhases } from '@/firebase/phases';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FeedbackView from './FeedbackView';


export default function ProjectDetails( {project} ) {

    const [projectDetails, setProjectDetails] = useState(project);
    const [description, setDescription] = useState(project.projectDescription);
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [showSubmitPopup, setShowSubmitPopup] = useState(false);
    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPhase, setSelectedPhase] = useState(project.currentPhase);
    const [successMessage, setSuccessMessage] = useState(null);

    // --- START: Add project phases
    const [phases, setPhases] = useState();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        getPhases().then((res) => {
            if (res) {
                setPhases(res);
            }
        });
    },[]);
    // --- END: Add project phases


    // Updates the local description state when the description is changed
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    // Handles logic for the edit description button
    const handleEditDescription = () => {
        setIsEditingDescription(!isEditingDescription);
        setIsDescriptionEditable(true);
    };

    // Handles logic for the submit button when submitting description changes
    const handleConfirmSubmit = async () => {
        try {
            await updateProjectDescription(project.id, description);
            setProjectDetails({...projectDetails, projectDescription: description});
            setIsDescriptionEditable(false);
            setIsEditingDescription(false);
            setShowSubmitPopup(false);
            setError(null);
            setSuccessMessage("Project description updated successfully");
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    // Handles logic for the cancel button in the confirm cancel popup
    const handleConfirmCancel = () => {
        setDescription(project.projectDescription);
        setIsDescriptionEditable(false);
        setIsEditingDescription(false);
        setShowCancelPopup(false);
    };

    // Handles logic for dismissing the error alert
    const handleDismissError = () => {
        setError(null);
    };

    // Handles logic for the phase select when the phase is changed
    const handlePhaseChange = (event) => {
        const selectedPhaseId = event.target.value;
        const selectedPhase = projectDetails.phases.find(phase => phase.id === selectedPhaseId);
        if (selectedPhase.enabled) {
            setSelectedPhase(selectedPhaseId);
        }
    };

    // Update the project phase in the project details and push to the database
    const handleUpdatePhase = async () => {
        try {
            await updateProjectPhase(project.id, selectedPhase);
            setSuccessMessage("Project phase updated successfully");
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    // Toggle the enabled state of a phase in the project details and push to the database
    const handleTogglePhase = async (phaseId) => {
        const updatedPhases = projectDetails.phases.map(phase => {
            if (phase.id === phaseId) {
                return {
                    ...phase,
                    enabled: !phase.enabled
                };
            }
            return phase;
        });
        setProjectDetails({...projectDetails, phases: updatedPhases});
        try{
            await togglePhase(project.id, phaseId); 
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(null), 5000);
        }
    };

    return <>
        {error && (
            <Alert severity="error" onClose={handleDismissError}>
                {error}
            </Alert>
        )}
        {successMessage && (
            <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
            </Alert>
        )}

        <Container sx={{paddingTop:3}}>
            <Typography variant='h3'>
                {projectDetails.projectName}
            </Typography>
            <Typography variant='h5'>
                {projectDetails.client}
            </Typography>
            <Typography variant='subtitle2'>
                {projectDetails.address.city}, {projectDetails.address.province}, {projectDetails.address.country} 
            </Typography>
            <Typography variant='subtitle2'>
                {projectDetails.address.street}
            </Typography>
            <Typography variant='subtitle2' marginBottom={3}>
                {projectDetails.address.street2}
            </Typography>
            {isDescriptionEditable ? (
                <TextField
                    label="Project Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    margin="normal"
                />
            ) : (
                <Typography variant='body1' marginBottom={3}>
                    {description}
                </Typography>
            )}
            {isEditingDescription ? (
                <>
                    <Button
                        variant="contained"
                        onClick={() => setShowCancelPopup(true)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setShowSubmitPopup(true)}
                        sx={{marginLeft: 2}}
                    >
                        Save
                    </Button>
                </>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleEditDescription}
                >
                    Edit Description
                </Button>
            )}
            <Box
                sx={{mt: 5}}
            >
                {(phases && projectDetails.id) && phases.map((phase) => {
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
                        id={projectDetails.id}
                        phaseId={phase && phase.id}/>
                    </AccordionDetails>
                    </Accordion>
                )
                })}
            </Box> 
        </Container>


        {/** Add submit popup when submitting description changes */}
        {showSubmitPopup && (
            <div className="popup">
                <div className="popup-content">
                    <Typography variant='h6' gutterBottom>
                        Are you sure you want to submit the changes?
                    </Typography>
                    <div className="popup-buttons">
                        <Button
                            variant="contained"
                            onClick={() => setShowSubmitPopup(false)}
                        >
                            No
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmSubmit}
                        >
                            Yes
                        </Button>                        
                    </div>
                </div>
            </div>
        )}
        {/** Add cancel popup when cancelling description changes */}
        {showCancelPopup && (
            <div className="popup">
                <div className="popup-content">
                    <Typography variant='h6' gutterBottom>
                        Are you sure you want to cancel the changes? (This will revert the description back to the original)
                    </Typography>
                    <div className="popup-buttons">
                        <Button
                            variant="contained"
                            onClick={() => setShowCancelPopup(false)}
                        >
                            No
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmCancel}
                        >
                            Yes
                        </Button>                        
                    </div>
                </div>
            </div>
        )}

        <FeedbackView selectedProject={projectDetails.id}/>

        <style>{`
            
            .popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            }

            .popup-content {
                background-color: #242424;
                padding: 20px;
                border-radius: 5px;
                color: white;
                max-width: 400px;
                word-wrap: break-word;
            }

            .popup-buttons {
                display: flex;
                justify-content: space-around;
                margin-top: 10px;
            }
            .popup-buttons > Button {
                width: 100px;
            }
        `}</style>
    </>
}
