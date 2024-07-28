import FeedbackForm from "@/components/FeedbackForm";
import { markupDecodeString, markupGetFileNameFromPath } from "@/components/markup/MarkupConfig";
import MarkupImageItem from "@/components/markup/MarkupImageItem";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

export default function MarkupImageItemPage(props) {
    const r = useRouter();
    return <Box sx={{ display: 'flex', alignItems: "center", flexDirection: "column" }}>
        {r.isReady &&
            <>
                <div>
                    <MarkupImageItem fbDocPath={markupDecodeString(r.query.dbDocPath)}></MarkupImageItem>
                </div>
            </>
        }
    </Box>;
}