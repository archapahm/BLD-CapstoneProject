import ImageDrawingComponent from "@/components/markup/ImageDrawingComponent";
import { db } from "@/firebase/config";
import { Save } from "@mui/icons-material";
import { Box, Button, CircularProgress, FormControlLabel, Switch } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { MarkupConfig, markupEncodeString, markupGetFileNameFromPath } from "./MarkupConfig";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import NextLink from 'next/link'
import Link from '@mui/material/Link';

export default function MarkupImageItem(props) {
    const [itemInfo, setItemInfo] = useState(null);
    const [requestSave, setRequestSave] = useState(false);
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [autoSave, setAutoSave] = useState(MarkupConfig.defaultAutoSave);
    const refAutoSave = useRef(autoSave);
    const [imageAcceptStateVar, setImageAcceptState] = useState("NONE");

    const backgroundRef = useRef();

    const MIIgetFileExtensionFromString = (filename) => {
        if (filename) {
            return filename.split("?")[0].split("#")[0].split('.').pop();
        }
    };

    const isfileNameAPDF = (filename) => {
        if (MarkupConfig.pdfMarkupFeatureEnabled == true) {
            if (MIIgetFileExtensionFromString(filename).toLowerCase() == "pdf") {
                return true;
            }
        }
        return false;
    }

    const [imageArrayForPDF, setImageArrayForPDF] = useState([]);
    const [isPDF, setIsPDF] = useState(false);

    const loadPDFImagesBackgroundWorker = () => {
        if (isPDF && itemInfo) {
            if (itemInfo.baseImageURL) {
                let imageArray = [];
                for (let i = 0; i < itemInfo.numPagesPDF; i++) {
                    imageArray[i] = "";
                }
                let numWorkers = navigator.hardwareConcurrency;
                if (!numWorkers) {
                    numWorkers = 1;
                }
                let workers = [];
                let doneWorkers = 0;
                let pagesPerWorker = Math.floor(itemInfo.numPagesPDF / numWorkers);
                let pagesPerWorkerRemainder = itemInfo.numPagesPDF % numWorkers;
                if (pagesPerWorker <= 0) {
                    pagesPerWorker = 1;
                    numWorkers = itemInfo.numPagesPDF;//pagesPerWorker;
                    pagesPerWorkerRemainder = 0;
                }
                let start = 0;
                for (let i = 0; i < numWorkers; i++) {
                    const newWebWorker = new Worker(new URL("./PDFRenderer.js", import.meta.url), { type: 'module' });
                    let pagesNeeded = pagesPerWorker;
                    if (i == (numWorkers - 1)) {
                        pagesNeeded += pagesPerWorkerRemainder;
                    }
                    newWebWorker.onmessage = (msg) => {
                        try {
                            for (let i = 0; i < msg.data.workerImageArray.length; i++) {
                                let currentPage = i + msg.data.workerPageStart;
                                imageArray[currentPage] = msg.data.workerImageArray[i];
                            }
                            doneWorkers += 1;
                            if (doneWorkers == workers.length) {
                                //finish array
                                setImageArrayForPDF(imageArray);
                            }
                        }
                        catch (e) { }
                    }
                    newWebWorker.postMessage({
                        workerIndex: i,
                        pdfURL: itemInfo.baseImageURL,
                        pagesStart: start,
                        pagesToComplete: pagesNeeded,
                    })
                    workers.push(newWebWorker);
                    start += pagesPerWorker;
                }
            }
        }
    };

    const loadPDFImagesIntoArray = async () => {
        if (MarkupConfig.pdfWorkersEnabled == true) {
            return loadPDFImagesBackgroundWorker();
        }
        if (isPDF && itemInfo) {
            if (itemInfo.baseImageURL) {
                //load pdf information to image array
                const loadingTask = pdfjsLib.getDocument(itemInfo.baseImageURL);
                let pdf = await loadingTask.promise;
                let totalPages = pdf.numPages;
                let imageArray = [];
                for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                    let page = await pdf.getPage(pageNumber);
                    var scale = 1;
                    var viewport = page.getViewport({ scale: scale });

                    var canvas = document.createElement('canvas');
                    // Update canvas using PDF page dimensions
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = { canvasContext: context, viewport: viewport };

                    var renderTask = page.render(renderContext);
                    await renderTask.promise;
                    //imageArray.push(canvas.toDataURL('image/png'));
                    imageArray.push("");
                    canvas.toBlob((blob) => {
                        imageArray[pageNumber - 1] = URL.createObjectURL(blob);
                        if (pageNumber == totalPages) {
                            setImageArrayForPDF(imageArray);
                        }
                    })
                }
                //setImageArrayForPDF(imageArray);
            }
        }
    };

    useEffect(() => {
        loadPDFImagesIntoArray();
    }, [itemInfo]);

    useEffect(() => {
        if (MarkupConfig.generalAcceptRejectFeatureEnabled == true) {
            if (itemInfo && imageAcceptStateVar) {
                //save acceptance state to database
                const saveImageAcceptStateAsyncFunc = async () => {
                    const docReference = doc(db, props.fbDocPath);
                    await updateDoc(docReference, {
                        imageAcceptState: imageAcceptStateVar
                    })
                }
                saveImageAcceptStateAsyncFunc();
            }
            if (imageAcceptStateVar == "ACCEPTED") {
                backgroundRef.current.style.backgroundColor = "#00800044";
            }
            else if (imageAcceptStateVar == "REJECTED") {
                backgroundRef.current.style.backgroundColor = "#ff000044";
            }
            else {
                backgroundRef.current.style.backgroundColor = "";
            }
        }
    }, [imageAcceptStateVar]);

    useEffect(() => {
        refAutoSave.current = autoSave;
    }, [autoSave]);

    const [lastSuccessfulJSONSaved, setLastSuccessfulJSONSaved] = useState("");

    const saveJSONToDatabase = (jsonData, documentPath, isJSONForPdf, i) => {
        const saveJSONAsyncFunc = async () => {
            try {
                const docReference = doc(db, documentPath);
                if (isJSONForPdf) {
                    let updateDataObject = {};
                    updateDataObject[`fabricJSONPdfSlide${i}`] = jsonData;
                    await updateDoc(docReference, updateDataObject);
                }
                else {
                    await updateDoc(docReference, {
                        fabricJSON: jsonData,
                    })
                }
                //success
                setLastSuccessfulJSONSaved(jsonData);
            }
            catch (e) { }
            finally {
                setSavingInProgress(false);
                setRequestSave(false);
            }
        }
        if ((refAutoSave.current == true && MarkupConfig.autoSaveFeatureEnabled == true)) {
            if (jsonData != lastSuccessfulJSONSaved) {
                setSavingInProgress(true);
                saveJSONAsyncFunc();
            }
            else if (requestSave == true) {
                setSavingInProgress(true);
                saveJSONAsyncFunc();
            }
        }
        else if (requestSave == true) {
            setSavingInProgress(true);
            saveJSONAsyncFunc();
        }
    };

    useEffect(() => {
        const updateItemInfoAsyncFunc = async () => {
            const docReference = doc(db, props.fbDocPath);
            const docSnapshot = await getDoc(docReference);
            let fbIaState = docSnapshot.data().imageAcceptState;
            if (!fbIaState) {
                fbIaState = "NONE";
            }
            setImageAcceptState(fbIaState);
            if (isfileNameAPDF(docSnapshot.data().imageURL)) {
                setIsPDF(true);
                let newItemInfo = {
                    baseImageURL: docSnapshot.data().imageURL,
                    numPagesPDF: 0
                }
                newItemInfo.FabricJSONCanvasArray = [];
                const pdf = await pdfjsLib.getDocument(newItemInfo.baseImageURL).promise;
                newItemInfo.numPagesPDF = pdf.numPages;
                for (let i = 0; i < pdf.numPages; i++) {
                    newItemInfo.FabricJSONCanvasArray[i] = "";
                    //try reading from database
                    try {
                        newItemInfo.FabricJSONCanvasArray[i] = docSnapshot.data()[`fabricJSONPdfSlide${i}`];
                    }
                    catch (e) { }
                }
                setItemInfo(newItemInfo);
            }
            else {
                setIsPDF(false);
                let newItemInfo = {
                    baseImageURL: docSnapshot.data().imageURL,
                    canvasDataJSONString: "",
                }
                try {
                    newItemInfo.canvasDataJSONString = docSnapshot.data().fabricJSON;
                }
                catch (e) { }
                setItemInfo(newItemInfo);
            }
        }
        updateItemInfoAsyncFunc();
    }, [props.fbDocPath]);

    const toggleImageAcceptState = (status) => {
        if (imageAcceptStateVar == status) {
            setImageAcceptState("NONE");
        }
        else {
            setImageAcceptState(status);
        }
    }

    const toggleReject = () => {
        toggleImageAcceptState("REJECTED");
    }

    const toggleAccept = () => {
        toggleImageAcceptState("ACCEPTED");
    };

    const getTitleForThisItem = () => {
        if (!props.title) {
            if (props.fbDocPath) {
                return markupGetFileNameFromPath(props.fbDocPath);
            }
        }
        else {
            return props.title;
        }
        return "";
    };

    return <Box sx={{ display: "Flex", flexDirection: "row" }}>
        <Box ref={backgroundRef} sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
        }}>

            {itemInfo &&
                <>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Box>
                            <span style={{ textTransform: "uppercase", backgroundColor: "purple", marginRight: "5px" }}>{MIIgetFileExtensionFromString(itemInfo.baseImageURL)}</span>
                            <Link href={`/markup/image/${markupEncodeString(props.fbDocPath)}`} component={NextLink}>{getTitleForThisItem()}</Link>
                            {MarkupConfig.generalAcceptRejectFeatureEnabled == true &&
                                <>
                                    {imageAcceptStateVar == "ACCEPTED" &&
                                        <b> - ACCEPTED</b>
                                    }
                                    {imageAcceptStateVar == "REJECTED" &&
                                        <b> - REJECTED</b>
                                    }
                                </>
                            }
                        </Box>
                        <Box>
                            <Button href={itemInfo.baseImageURL}>View in External Viewer</Button>
                            {MarkupConfig.autoSaveFeatureEnabled == true &&
                                <FormControlLabel control={<Switch checked={autoSave} onChange={(e) => { setAutoSave(e.target.checked) }} />} label="AutoSave" />
                            }
                            <Button onClick={(e) => { setRequestSave(true) }}>
                                {savingInProgress == false &&
                                    <>
                                        <Save></Save>
                                        Save
                                    </>
                                }
                                {savingInProgress == true &&
                                    <>
                                        <CircularProgress size={20} />Saving
                                    </>
                                }
                            </Button>
                            {MarkupConfig.generalAcceptRejectFeatureEnabled == true &&
                                <>
                                    <Button onClick={toggleAccept}>Accept</Button>
                                    <Button onClick={toggleReject}>Reject</Button>
                                </>
                            }
                        </Box>
                    </Box>
                    {isPDF == true &&
                        <>
                            {imageArrayForPDF.length == 0 &&
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <CircularProgress></CircularProgress>
                                    <div>Please wait</div>
                                </Box>
                            }
                            {imageArrayForPDF.length > 0 &&
                                imageArrayForPDF.map((item, index) => (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                    }}>
                                        <Box>
                                            <span>Page {index + 1}</span>
                                        </Box>
                                        <ImageDrawingComponent
                                            baseImageURL={item}
                                            baseCanvasJSONString={itemInfo.FabricJSONCanvasArray[index]}
                                            width="1280"
                                            height="720"
                                            autoSize={false}
                                            allowExportImageData={false}
                                            demandSave={requestSave}
                                            onCanvasImageDataChanged={(data) => { itemInfo.imageDataBase64String = data }}
                                            onCanvasJSONStringChanged={(data) => {
                                                //save JSON to the database
                                                saveJSONToDatabase(data, props.fbDocPath, true, index);
                                            }}
                                        ></ImageDrawingComponent>
                                    </Box>
                                ))
                            }
                        </>
                    }
                    {isPDF == false &&
                        <ImageDrawingComponent
                            baseImageURL={itemInfo.baseImageURL}
                            baseCanvasJSONString={itemInfo.canvasDataJSONString}
                            width="1280"
                            height="720"
                            autoSize={false}
                            allowExportImageData={false}
                            demandSave={requestSave}
                            onCanvasImageDataChanged={(data) => { itemInfo.imageDataBase64String = data }}
                            onCanvasJSONStringChanged={(data) => {
                                //save JSON to the database
                                saveJSONToDatabase(data, props.fbDocPath, false);
                            }}
                        ></ImageDrawingComponent>
                    }
                </>
            }
        </Box>
    </Box>;
}