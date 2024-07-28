import ImageDrawingComponent from "@/components/markup/ImageDrawingComponent";
import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { getStorage, listAll, ref } from "firebase/storage";
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import MarkupDocumentList from "./MarkupDocumentList";
import MarkupImagesView from "./MarkupImagesView";

export default function DocumentBrowser(props) {

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedPhaseId, setSelectedPhaseId] = useState("");
    const [phases, setPhases] = useState([]);
    const [selectedVersionName, setSelectedVersionName] = useState("");
    const [projectVersions, setProjectVersions] = useState([]);

    const getProjectNameFromId = (id) => {
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id == id) {
                return projects[i].name;
            }
        }
    };

    const getPhaseNameFromIdUsingDB = async (id) => {
        const querySnapshot = await getDocs(collection(db, "phases"));
        let phaseName = "";
        querySnapshot.forEach((doc) => {
            if (id == doc.id) {
                phaseName = doc.data().title;
                return;
            }
        });
        return phaseName;
    }

    const getPhaseNameFromId = (id) => {
        for (let i = 0; i < phases.length; i++) {
            if (phases[i].id == id) {
                return phases[i].name;
            }
        }
    };

    useEffect(() => {
        const getMoodboardDocsAsyncFunc = async () => {
            const querySnapshot = await getDocs(collection(db, "projects"));
            let docs = []
            querySnapshot.forEach((doc) => {
                let docObject = {
                    id: doc.id,
                    name: doc.data().projectName
                }
                docs.push(docObject);
            });
            setProjects(docs);
        }
        getMoodboardDocsAsyncFunc();
    }, []);

    useEffect(() => {
        const getPhasesAsyncFunc = async () => {
            setSelectedPhaseId("");
            const querySnapshot = await getDocs(collection(db, `projectPhase/${selectedProjectId}/phases`));
            let docs = []
            querySnapshot.forEach((doc) => {
                let docObject = {
                    id: doc.id,
                    name: doc.id
                }
                docs.push(docObject);
            });
            if (docs.length == 0) {
                setPhases(docs);
            }
            else {
                for (let i = 0; i < docs.length; i++) {
                    const asyncFunc = async () => {
                        docs[i].name = await getPhaseNameFromIdUsingDB(docs[i].id);
                        if (i == (docs.length - 1)) {
                            setPhases(docs);
                        }
                    }
                    asyncFunc();
                }
            }
        }
        if (selectedProjectId) {
            getPhasesAsyncFunc();
        }
    }, [selectedProjectId]);

    useEffect(() => {
        const getPhasesVersionsAsyncFunc = async () => {
            setSelectedVersionName("");
            const querySnapshot = await getDocs(collection(db, `projectPhase/${selectedProjectId}/phases/${selectedPhaseId}/versions`));
            let docs = []
            querySnapshot.forEach((doc) => {
                let docObject = {
                    id: doc.id,
                    name: doc.id
                }
                docs.push(docObject);
            });
            setProjectVersions(docs);
        }
        if (selectedPhaseId) {
            getPhasesVersionsAsyncFunc();
        }
    }, [selectedPhaseId]);

    const getDocumentsImagesPath = ()=>{
        if (selectedProjectId != "" && selectedPhaseId != ""){
            if(selectedVersionName != ""){
                return `projectPhase/${selectedProjectId}/phases/${selectedPhaseId}/versions/${selectedVersionName}/files`;
            }
        }
        return "";
    };

    const mivRef = useRef(null);

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }}>
        <h1>Markup Documents</h1>
        <Container maxWidth="sm">
            <Stack spacing={2}>
                <FormControl fullWidth>
                    <InputLabel>Select project</InputLabel>
                    <Select label="Select project" onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                    }}>
                        {projects.map((item, index) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedProjectId != "" &&
                    <>
                        {phases.length != 0 &&
                            <FormControl fullWidth>
                                <InputLabel>Select phase</InputLabel>
                                <Select label="Select phase" onChange={(e) => {
                                    setSelectedPhaseId(e.target.value);
                                }}>
                                    {phases.map((item, index) => (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                        {phases.length == 0 &&
                            <div>No phases found.</div>
                        }
                    </>
                }
                {selectedPhaseId != "" &&
                    <>
                        {projectVersions.length != 0 &&
                            <FormControl fullWidth>
                                <InputLabel>Select version</InputLabel>
                                <Select label="Select version" onChange={(e) => {
                                    setSelectedVersionName(e.target.value);
                                }}>
                                    {projectVersions.map((item, index) => (
                                        <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                        {projectVersions.length == 0 &&
                            <div>No versions found.</div>
                        }
                    </>
                }</Stack>
        </Container>
        <div>
        {(getDocumentsImagesPath() != "") &&
                <>
                    <Box sx={{display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "20px"}}>
                    <h2>Choose the document to markup:</h2>
                    <MarkupDocumentList docsPath={getDocumentsImagesPath()}></MarkupDocumentList>
                    <Button variant="contained" onClick={(e)=>{mivRef.current.scrollIntoView({behavior: "smooth"});}}>MARKUP ALL DOCUMENTS</Button>
                    </Box>
                    <div ref={mivRef} >
                    <MarkupImagesView docsPath={getDocumentsImagesPath()}></MarkupImagesView>
                    </div>
                </>
        }
        </div>
    </Box>;
}