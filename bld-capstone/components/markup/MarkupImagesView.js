import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import MarkupImageItem from "./MarkupImageItem";
import FeedbackForm from "../FeedbackForm";

function markupMakeId(beginString) {
    return beginString + (Date.now() + Math.random());
}

export default function MarkupImagesView(props) {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const listAsync = async () => {
            const querySnapshot = await getDocs(collection(db, props.docsPath));
            let docs = []
            querySnapshot.forEach((doc) => {
                let pageObject = {
                    id: markupMakeId("page" + doc.ref.path),
                    fbDocPath: doc.ref.path,
                };
                docs.push(pageObject);
            });
            setPages(docs);
        }
        listAsync();
    }, [props.docsPath]);

    return <div sx={{display: 'flex'}}>
        {pages.length == 0 &&
            <div>No images found</div>
        }
        {pages.map((item, index) => (
            <div
                key={item.id}
                style={{marginBottom: '20px'}}>
                <MarkupImageItem fbDocPath={item.fbDocPath}></MarkupImageItem>
            </div>
        ))}
    </div>
}