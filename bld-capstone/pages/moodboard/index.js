import * as React from 'react';
import FeedbackForm from '@/components/FeedbackForm';
import Box from '@mui/material/Box';
import FeedbackView from '@/components/FeedbackView';

const projectId = "L9k9HFScp7VxkLlWk4bX";
const phaseId = "4Lv5yYaywdagpSdD33Nx";
const version = "One";
const imageId = "ee89bc4f-971a-46df-b1dc-6c3ac945beb9.png";

export default function Moodboard() {

    return (
        <Box sx={{ marginTop: 8 }}>
            <FeedbackForm />
            <FeedbackView
                selectedProject={projectId}
                selectedProjectPhase={phaseId}
                selectedProjectVersion={version}
                selectedProjectImage={imageId}
            />
        </Box>
    )
}