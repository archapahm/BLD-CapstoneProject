// // Import modules
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { Typography, Grid, Paper, Box, Divider, LinearProgress, IconButton, Fade } from '@mui/material';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { ref, listAll, getDownloadURL, connectStorageEmulator } from 'firebase/storage';
// import { Image } from 'next/image';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { useTheme } from '@mui/material/styles';
// import { Edit } from '@mui/icons-material';
// import { useAuthContext } from '@/hooks/useAuthContext';
// import { ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { Document, pdfjs, Page } from 'react-pdf';
// // Import custom modules
// import { getMoodBoardsNew, getProjectsByID, getProjectPhases } from '@/utils/queries';
// import { auth, storage } from '@/firebase/config';
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // Import pdf viewer styles
// import 'react-pdf/dist/Page/TextLayer.css';
// import 'react-pdf/dist/Page/AnnotationLayer.css';

// // Define the component
// export default function BLDProjectDisplay({ setTopLevelProjectChoice }) {
//     // Define state variables
//     const [moodboards, setMoodboards] = useState([]);
//     const [loadedMoodBoards, setLoadedMoodBoards] = useState({});
//     const [userProject, setUserProject] = useState([]);
//     const [moodboardSorting, setMoodboardSorting] = useState(0);
//     const [projectChoice, setProjectChoice] = useState(0);
//     const [loadAttempted, setLoadAttempted] = useState(false);

//     // Define bool for logging
//     const logging = true;

//     // Define variables
//     const db = getFirestore();
//     const theme = useTheme();
//     const { user, authIsReady } = useAuthContext();
//     const router = useRouter();

//     const fetchProject = useCallback(async () => {
//         try {
//             const project = await getProjectsByID(user.uid);
//             project && logging ? console.log("[INFO] " + project.length + " Project(s) found from userID:", user.uid) : console.log('No project found.');
//             return project;
//         } catch (error) {
//             console.error('Failed to fetch project in fetchProject:', error);
//         }
//     }, [user?.uid]);

//     const fetchAndUpdateMoodboards = useCallback(async (projectChoice) => {
//         setLoadAttempted(false);
//         try {
//             const updatedMoodboards = await getMoodBoardsNew();
//             // Filter moodboards based on projectChoice
//             const filteredMoodboards = updatedMoodboards.filter(board => board.id == projectChoice);
//             setMoodboards(filteredMoodboards);
//             setLoadAttempted(true)
//         } catch (error) {
//             console.error('Failed to fetch and update moodboards:', error);
//         }
//     }, [db, projectChoice]);

//     useEffect(() => {
//         if (authIsReady && !user) {
//             router.push('/login');
//         }
//     }, [authIsReady, user, router]);

//     // Fetch and update moodboards on component mount
//     useEffect(() => {
//         if (authIsReady && user && userProject.length > 0) {
//             fetchAndUpdateMoodboards(projectChoice); // Pass projectChoice as a parameter
//         }
//     }, [authIsReady, user, userProject, projectChoice, fetchAndUpdateMoodboards]);

//     useEffect(() => {
//         if (authIsReady && user?.uid) {
//             (async () => {
//                 const project = await fetchProject();
//                 setUserProject(project);
//                 if (project && project.length > 0) {
//                     setProjectChoice(project[0].id); // Automatically set the first project as selected
//                 }
//             })();
//         }
//     }, [authIsReady, user?.uid, fetchProject]);

//     useEffect(() => {
//         if (projectChoice && projectChoice !== 0) {
//             fetchAndUpdateMoodboards(projectChoice);
//         }
//         getProjectPhases(projectChoice);
//     }, [projectChoice, fetchAndUpdateMoodboards]);


//     // Set the project choice to the first project in the list
//     useEffect(() => {
//         userProject.length > 0 && setProjectChoice(userProject[0].id);
//         userProject.length > 0 && setTopLevelProjectChoice(userProject[0].id);
//     }, [userProject, setTopLevelProjectChoice]);

//     // Define event handlers
//     const handleMoodboards = (event, newMoodboardSorting) => {
//         if (newMoodboardSorting !== null) { // Check if the new value is not null
//             setMoodboardSorting(newMoodboardSorting);
//         }
//     };

//     const handleProjectChoice = (event, newProjectChoice) => {
//         if (newProjectChoice !== null) { // Check if the new value is not null
//             setProjectChoice(newProjectChoice);
//             setTopLevelProjectChoice(newProjectChoice); // Pass the new projectChoice to the top level component
//             // Call fetchAndUpdateMoodboards with the new projectChoice
//             fetchAndUpdateMoodboards(newProjectChoice);

//             // Reset moodboardSorting to 0
//             handleMoodboards(null, 0); // Reset moodboardSorting to 0
//         }
//     };

//     const handleImageLoad = useCallback((id) => {
//         logging ? console.log('[INFO] Image loaded:', id) : null;
//         setLoadedMoodBoards((prevLoadedImages) => ({
//             ...prevLoadedImages,
//             [id]: true // Set the specific image as loaded
//         }));
//     });

//     // Define helper functions
//     function IconDisplayAcceptState(image, boardId, collectionVersion) {
//         // Ensure that imageAcceptState is a string
//         const imageAcceptState = image.imageAcceptState;
//         const state = typeof imageAcceptState === 'string' ? imageAcceptState.toLowerCase() : '';

//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, zIndex: 1 }}>
//                 {loadedMoodBoards[image.id] && (
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         {state === 'accepted' && <CheckCircleIcon sx={{ m: .5, color: theme.palette.success.dark }} />}
//                         {state === 'rejected' && <CancelIcon sx={{ m: .5, color: theme.palette.error.dark }} />}
//                     </Box>
//                 )}
//                 {loadedMoodBoards[image.id] && (
//                     <Link href={`/markup/${boardId}/${collectionVersion}`} passHref>
//                         <IconButton sx={{ p: 0 }}>
//                             <Edit sx={{ color: theme.palette.primary.dark, m: .5 }} />
//                         </IconButton>
//                     </Link>
//                 )}
//             </Box>
//         );
//     }
//     const renderPDF = (image, boardId, collectionVersion) => {
//         return (
//             <Box key={image.id} sx={{ position: 'relative', width: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}>
//                 {IconDisplayAcceptState(image, boardId, collectionVersion)}
//                 <div style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}>
//                     <Document
//                         file={image.url}
//                         onLoadSuccess={({ numPages }) => {
//                             logging ? console.log(`Number of pages: ${numPages}`) : null;
//                         }}
//                         onLoadError={(error) => {
//                             console.error('PDF load error:', error);
//                         }}
//                         noData="Error with PDF"
//                         loading="Loading PDF..."
//                     >
//                         <Page
//                             pageNumber={2} // Ensure this is the correct page number
//                             noData="Error with PDF"
//                             loading="Loading PDF..."
//                             onLoadSuccess={() => handleImageLoad(image.id)}
//                             width={200}
//                             height="auto" // Set height to "auto" to maintain aspect ratio
//                             scale={1} // Set scale to 1 (no scaling)
//                         />
//                     </Document>
//                 </div>
//             </Box>
//         );
//     };

//     const renderImage = (image, boardId, collectionVersion) => {
//         console.log(image);
//         console.log(boardId);
//         console.log(collectionVersion);
//         return (
//             <Box key={image.id} sx={{ position: 'relative', width: '100%' }}>
//                 {IconDisplayAcceptState(image, boardId, collectionVersion)}
//                 <img
//                     src={image.downloadURL}
//                     alt={image.id}
//                     width="100%"
//                     onLoad={() => { handleImageLoad(image.id) }}
//                 />
//             </Box>
//         );
//     };

//     const renderCollection = (version, boardId) => {
//         logging ? console.log('[INFO] Collection to Be Rendered => ', version) : null;
//         const shouldRender = moodboardSorting === 1
//             ? Object.values(version.documents).some(doc => doc.imageAcceptState && doc.imageAcceptState.toLowerCase() !== 'none')
//             : moodboardSorting === 2
//                 ? Object.values(version.documents).every(doc => !doc.imageAcceptState || doc.imageAcceptState.toLowerCase() === 'none')
//                 : true;

//         if (!shouldRender) return null;

//         return (
//             <Fade in={shouldRender} key={version.version} timeout={500}>
//                 <Grid item xs={3} key={version.version}>
//                     <Paper elevation={3}>
//                         <Fade in={loadedMoodBoards[Object.keys(version.documents)[0]]} timeout={250}>
//                             <Box p={2}>
//                                 {console.log('[INFO] Version => ', version)}
//                                 <Typography>{version.version}</Typography>
//                                 {Object.values(version.documents)
//                                     .filter(image => !image.id.endsWith('.pdf'))
//                                     .map(image => renderImage(image, boardId, version.version))}
//                                 {Object.values(version.documents)
//                                     .filter(image => image.id.endsWith('.pdf'))
//                                     .map(image => renderPDF(image, boardId, version.version))}
//                             </Box>
//                         </Fade>
//                     </Paper>
//                 </Grid>
//             </Fade>
//         );
//     };


//     // Render the component
//     return (
//         <>
//             <Divider sx={{ mb: 2 }} />
//             <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between' }
//             }>
//                 <Grid item xs={2}>
//                     {userProject.length > 1 ? <Typography variant="h4">Projects</Typography> : <Typography variant="h4">Project</Typography>}
//                 </Grid>
//                 <Grid item xs={10} sx={{ display: 'flex' }}>
//                     <ToggleButtonGroup
//                         value={projectChoice}
//                         exclusive
//                         onChange={handleProjectChoice}
//                         aria-label="text alignment"
//                         sx={{
//                             display: 'flex',
//                             flexGrow: 1,
//                             justifyContent: 'space-evenly',
//                         }}
//                     >

//                         <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
//                         {userProject && userProject.map((project, index) => (
//                             <ToggleButton key={project.id} value={project.id} sx={{ border: 0, flex: 1 }} aria-label="left aligned">
//                                 <Typography>{project.projectName}</Typography>
//                             </ToggleButton>
//                         ))}
//                         <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
//                     </ToggleButtonGroup>
//                 </Grid>
//             </Grid>
//             {/* Render the mood boards */}
//             <Divider sx={{ my: 2 }} />
//             < Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'space-between' }
//             }>

//                 <Grid item xs={2}>
//                     <Typography variant="h4">Documents</Typography>
//                 </Grid>

//                 <Grid item xs={10} sx={{ display: 'flex' }}>
//                     <ToggleButtonGroup
//                         value={moodboardSorting}
//                         exclusive
//                         onChange={handleMoodboards}
//                         aria-label="text alignment"
//                         sx={{
//                             display: 'flex',
//                             flexGrow: 1, // Allow the ToggleButtonGroup to fill all available space
//                             justifyContent: 'space-evenly', // Distribute space evenly between buttons
//                         }}
//                     >
//                         <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
//                         <ToggleButton value={0} sx={{ border: 0, flex: 1 }} aria-label="right aligned">
//                             <Typography>All</Typography>
//                         </ToggleButton>
//                         <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
//                         <ToggleButton value={1} sx={{ border: 0, flex: 1 }} aria-label="centered">
//                             <Typography>Marked</Typography>
//                         </ToggleButton>
//                         <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
//                         <ToggleButton value={2} sx={{ border: 0, flex: 1 }} aria-label="left aligned">
//                             <Typography>Unmarked</Typography>
//                         </ToggleButton>
//                         <Divider orientation="vertical" flexItem sx={{ backgroundColor: theme.palette.divider }} />
//                     </ToggleButtonGroup>
//                 </Grid>
//             </Grid >
//             <Divider sx={{ my: 2 }} />
//             {logging ? console.log('[INFO] Load Attempted => ', loadAttempted) : null}
//             {loadAttempted ? ( // Check if loadAttempted is true
//                 moodboards.length === 0 ? ( // Check if no moodboards found
//                     <Typography variant="h2" sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>No documents found</Typography>
//                 ) : (
//                     <Grid container spacing={2}>
//                         {moodboards.map(board => {
//                             logging ? console.log('[INFO] Moodboard => ', board) : null;
//                             board.versions.map(collection => renderCollection(collection, board.id));
//                         }
//                         )}
//                     </Grid>
//                 )
//             ) : (
//                 <LinearProgress sx={{ mx: 2 }} /> // Display loading bar while fetching
//             )}
//         </>
//     );
// }