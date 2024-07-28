import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { getProjectPhases, getAllPhases } from 'utils/queries';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function BLDProjectStatus({ topLevelProjectChoice }) {
    const [phases, setPhases] = useState([]);
    const [phaseLibrary, setPhaseLibrary] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                const phaseLibraryData = await getAllPhases();
                setPhaseLibrary(phaseLibraryData);
                if (topLevelProjectChoice) { // Ensure topLevelProjectChoice is valid
                    const phasesData = await getProjectPhases(topLevelProjectChoice);
                    setPhases(phasesData);
                }
            } catch (error) {
                console.error("[ERROR] Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [topLevelProjectChoice]);

    return (
        <div>
            <Paper sx={{ px: 3, py: 4 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>Project Status</Typography>
                {loading ? <LinearProgress />
                    : phases.map((phase, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            {index < phases.length - 1 ? (
                                <>
                                    <CheckCircleIcon sx={{ mr: 1, color: theme.palette.success.dark }} />
                                    <Typography color={theme.palette.success.dark}>
                                        {phaseLibrary.filter(phaseLibItem => phaseLibItem.id === phase.id)[0].title}
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <BuildIcon sx={{ mr: 1, color: theme.palette.primary.dark }} />
                                    <Typography color={theme.palette.primary.dark}>
                                        {phaseLibrary.filter(phaseLibItem => phaseLibItem.id === phase.id)[0].title}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    ))}
            </Paper>
        </div>
    );
}
