import ImageDrawingComponent from "@/components/markup/ImageDrawingComponent";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";

function markupAskUserForFile(callback) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.addEventListener("change", (e) => {
        //callback(input.files);
        var fr = new FileReader();
        fr.onload = function () {
            callback(fr.result);
        }
        fr.readAsDataURL(input.files[0]);

    })
    input.click();
}


function markupMakeId(beginString) {
    return beginString + (Date.now() + Math.random());
}

export default function OpenLocalImages() {
    const [pages, setPages] = useState([]);

    const [fullSizePage, setFullSizePage] = useState(false);

    const newPageFromImageURL = (url, shouldautosize) => {
        setPages([...pages, {
            id: markupMakeId("page"),
            baseImageURL: url,
            imageDataBase64String: "",
            canvasDataJSONString: "",
            autoSize: shouldautosize
        }])
    };

    const setPageAutoSize = (pageId, shouldautosize) => {
        setPages(pages.map((page) => {
            if (page.id == pageId) {
                return { ...page, autoSize: shouldautosize };
            }
            else {
                return page;
            }
        }))
    };

    const OpenImage = () => {
        markupAskUserForFile((url) => {
            //newPageFromImageURL(url[0].name);
            newPageFromImageURL(url, fullSizePage);
        })
    };

    const newImage = () => {
        newPageFromImageURL("", false);
    };

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }}>
        <div>Default Options:</div>
        <FormControlLabel control={
            <Checkbox checked={fullSizePage} onChange={(e) => { setFullSizePage(e.target.checked); }}></Checkbox>} label="Full size (auto)">

        </FormControlLabel>
        <Button onClick={OpenImage}>Load image</Button>
            <Button onClick={newImage}>New image</Button>
        <h1>Markup Images</h1>
        {pages.map((item, index) => (
            <div
                key={item.id}>
                <div>Page {index + 1}</div>
                <FormControlLabel control={
                    <Checkbox checked={item.autoSize} onChange={(e)=>{setPageAutoSize(item.id, e.target.checked);}}></Checkbox>} label="Full size (auto)">
                </FormControlLabel>
                <ImageDrawingComponent
                    baseImageURL={item.baseImageURL}
                    width="1280"
                    height="720"
                    autoSize={item.autoSize}
                    allowExportImageData={true}
                    onCanvasImageDataChanged={(data) => { item.imageDataBase64String = data }}
                    onCanvasJSONStringChanged={(data) => { item.canvasDataJSONString = data }}
                ></ImageDrawingComponent>
            </div>
        ))}
    </Box>
}