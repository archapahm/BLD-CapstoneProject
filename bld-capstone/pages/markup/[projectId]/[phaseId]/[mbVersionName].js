import MarkupImagesView from "@/components/markup/MarkupImagesView";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";

export default function MarkupImages(props) {
    const r = useRouter();
    const [projectName, setProjectName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [phaseName, setPhaseName] = useState("");

    useEffect(() => {
        const getProjectNameAsyncFunc = async () => {
            const querySnapshot = await getDocs(collection(db, "projects"));
            querySnapshot.forEach((doc) => {
                if (r.query.projectId == doc.id) {
                    setProjectId(doc.id)
                    setProjectName(doc.data().projectName);
                    return;
                }
            });
        }
        getProjectNameAsyncFunc();
    }, [r]);

    useEffect(()=>{
        if(projectName != ""){
            const getPhaseNameAsyncFunc = async () => {
                const querySnapshot = await getDocs(collection(db, "phases"));
                querySnapshot.forEach((doc)=>{
                    if(r.query.phaseId == doc.id){
                        setPhaseName(doc.data().title);
                        return;
                    }
                });
            }
            getPhaseNameAsyncFunc();
        }
    }, [projectName]);

    const getDocumentsImagesPath = ()=>{
        return `projectPhase/${r.query.projectId}/phases/${r.query.phaseId}/versions/${r.query.mbVersionName}/files`;
    };

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }}>
        <h1>Markup Images for {projectName}, Phase {phaseName}, Version {r.query.mbVersionName}</h1>
        <MarkupImagesView docsPath={getDocumentsImagesPath()}></MarkupImagesView>
        <FeedbackForm selectedProject={projectId}/>
    </Box>
}