import ImageDrawingComponent from "@/components/markup/ImageDrawingComponent";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getStorage, listAll, ref } from "firebase/storage";
import MarkupImagesView from "@/components/markup/MarkupImagesView";
import { Box, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import FeedbackForm from "../FeedbackForm";

export default function MoodboardOpener(props) {

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedVersionName, setSelectedVersionName] = useState("");
    const [projectVersions, setProjectVersions] = useState([]);

    const getProjectNameFromId = (id) => {
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id == id) {
                return projects[i].name;
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
        const getProjectVersionsAsyncFunc = async () => {
            setSelectedVersionName("");
            const listreference = ref(getStorage(), `moodboards/${selectedProjectId}`);
            let listresult = await listAll(listreference)
            let projVersions = [];
            listresult.prefixes.forEach((item, index) => {
                let docObject = {
                    id: index,
                    name: item._location.path_.split('/')[2]
                }
                projVersions.push(docObject);
            });
            setProjectVersions(projVersions);
        }
        if (selectedProjectId) {
            getProjectVersionsAsyncFunc();
        }
    }, [selectedProjectId]);

    const getMoodboardImagesPath = ()=>{
        return `moodboards/${selectedProjectId}/${selectedVersionName}`;
    };

    const [imagesPath, setImagesPath] = useState("");
    useEffect(()=>{
        if(selectedProjectId != "" && selectedVersionName != ""){
            setImagesPath(getMoodboardImagesPath());
        }
        else{
            setImagesPath("");
        }
    }, [selectedProjectId, selectedVersionName]);

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }}>
        <h1>Markup Images</h1>
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
            {(imagesPath != "") &&
                <>
                    <h2>Markup Images for {getProjectNameFromId(selectedProjectId)}, {selectedVersionName}</h2>
                    <MarkupImagesView docsPath={imagesPath}></MarkupImagesView>
                </>
            }
        </div>
    </Box>;
}