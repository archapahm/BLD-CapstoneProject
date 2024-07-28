import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import NextLink from 'next/link'
import Link from '@mui/material/Link';
import { MarkupConfig, markupEncodeString, markupGetFileNameFromPath } from "./MarkupConfig";
import { Box } from "@mui/material";
import MarkupImagePreview from "./MarkupImagePreview";

export default function MarkupDocumentList(props) {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const listAsync = async () => {
            const querySnapshot = await getDocs(collection(db, props.docsPath));
            let docs = []
            querySnapshot.forEach((doc) => {
                let pageObject = {
                    id: markupEncodeString("page" + doc.ref.path),
                    fbDocPath: doc.ref.path,
                };
                docs.push(pageObject);
            });
            setPages(docs);
        }
        listAsync();
    }, [props.docsPath]);

    return <div>
        {pages.map((item, index) => (
            <Box key={item.id} >
                <Link href={`/markup/image/${markupEncodeString(item.fbDocPath)}`} component={NextLink}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <MarkupImagePreview fbImgURL={item.fbDocPath}></MarkupImagePreview>
                        {markupGetFileNameFromPath(item.fbDocPath)}
                        </Box>
                    </Link>
            </Box>))}
    </div>;
}