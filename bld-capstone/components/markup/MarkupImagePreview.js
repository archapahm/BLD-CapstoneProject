import { db } from "@/firebase/config";
import { Box, CircularProgress } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

export default function MarkupImagePreview(props){
    useEffect(()=>{
        const updateImageURLFunc = async () => {
            const docReference = doc(db, props.fbImgURL);
            const docSnapshot = await getDoc(docReference);
            setImageURL(docSnapshot.data().imageURL)
        }
        updateImageURLFunc();
    }, [props.fbImgURL]);
    const [imageURL, setImageURL] = useState("");
    return <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "120px", height: "100px"}}>
        {imageURL == "" &&
        <CircularProgress></CircularProgress>
}
{imageURL != "" &&
    <img src={imageURL} style={{maxHeight: "100%", maxWidth: "100%", marginRight: "20px"}}></img>
}
    </Box>    
}