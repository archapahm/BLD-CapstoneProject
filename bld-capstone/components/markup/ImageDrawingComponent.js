import { useState, useEffect, useRef } from "react";
import { fabric } from 'fabric';
import { Box, Button, Checkbox, FormControlLabel, IconButton, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Check, Close, Delete, Download, Draw, Highlight, Mouse, Redo, Undo } from "@mui/icons-material";
import TextFormatIcon from '@mui/icons-material/TextFormat';

function getImageSize(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const markupRectangleIconBoxSize = 24;
const usingBackgroundImage2 = false;

export default function ImageDrawingComponent(props) {
    const canvasEl = useRef(null);
    const fabricCanvasRef = useRef(null);
    //const [canvasImageBase64, setCanvasImageDataBase64] = useState("");

    const [canvasWidth, setCanvasWidth] = useState("0");
    const [canvasHeight, setCanvasHeight] = useState("0");
    const [drawingMode, setDrawingMode] = useState(false);
    const [textBoxSelected, setTextBoxSelected] = useState(false);
    const [canvasChangesMade, setCanvasChangesMade] = useState(false);
    const [saveImageDataTimeStamp, setSaveImageDataTimeStamp] = useState(Date.now());
    const [selectedDrawingTool, setSelectedDrawingTool] = useState("pen");
    const [drawingPenSize, setDrawingPenSize] = useState(8);
    const [drawingPenColor, setDrawingPenColor] = useState('#00aeff');
    const [highlighterPenSize, setHighlighterPenSize] = useState(40);
    const [itemsAreSelected, setItemsAreSelected] = useState(false);
    const [textBoxColor, setTextBoxColor] = useState("#000000");
    const [textBoxFontSize, setTextBoxFontSize] = useState(24);
    const [textBoxBackgroundColorEnabled, setTextBoxBackgroundColorEnabled] = useState(false);
    const [textBoxBackgroundColor, setTextBoxBackgroundColor] = useState("#FFFF00");
    const [imageLoadfailure, setImageLoadFailure] = useState(false);

    useEffect(() => {
        if (fabricCanvasRef.current && textBoxSelected == true) {
            let selectedObject = fabricCanvasRef.current.getActiveObjects()[0];
            selectedObject.fill = textBoxColor;
            selectedObject.fontSize = textBoxFontSize;
            if(textBoxBackgroundColorEnabled == false){
                selectedObject.backgroundColor = "";
            }
            else{
                selectedObject.backgroundColor = textBoxBackgroundColor;
            }
            fabricCanvasRef.current.renderAll();
        }
    }, [textBoxColor, textBoxFontSize, textBoxBackgroundColorEnabled, textBoxBackgroundColor]);

    /* useEffect(() => {
        if (fabricCanvasRef.current && textBoxSelected == true) {
            let selectedObject = fabricCanvasRef.current.getActiveObjects()[0];
        }
    }, [textBoxSelected]); */

    useEffect(() => {
        if (fabricCanvasRef.current && drawingMode == true) {
            if (selectedDrawingTool == "pen") {
                fabricCanvasRef.current.freeDrawingBrush.color = drawingPenColor;
                fabricCanvasRef.current.freeDrawingBrush.width = drawingPenSize;
            }
            else if (selectedDrawingTool == "highlighter") {
                fabricCanvasRef.current.freeDrawingBrush.color = '#ffff0055';
                fabricCanvasRef.current.freeDrawingBrush.width = highlighterPenSize;
            }
        }
    }, [selectedDrawingTool, drawingPenSize, drawingPenColor, highlighterPenSize, drawingMode]);

    const canvasToImageDataURL = () => {
        if (props.allowExportImageData == false) {
            return "";
        }
        return fabricCanvasRef.current.toDataURL({
            format: 'jpeg',
            quality: 0.8
        });
    };

    const SaveImageData = () => {
        //setCanvasImageDataBase64(canvasToImageDataURL);
        if (fabricCanvasRef.current) {
            props.onCanvasImageDataChanged(canvasToImageDataURL());
            let obg = null;
            fabricCanvasRef.current.getObjects().forEach((o) => {
                try {
                    if (o.id == 'background') {
                        obg = o;
                        fabricCanvasRef.current.remove(obg);
                    }
                }
                catch (e) {}
            });
            props.onCanvasJSONStringChanged(JSON.stringify(fabricCanvasRef.current.toJSON(['isMarkupRectangle', 'id'])));
            if(obg){
                fabricCanvasRef.current.add(obg);
                fabricCanvasRef.current.sendToBack(obg);
            }
            setSaveImageDataTimeStamp(Date.now());
            //setCanvasChangesMade(false);
        }
    };

    useEffect(() => {
        if (props.demandSave == true) {
            SaveImageData();
        }
    }, [props.demandSave]);

    useEffect(() => {
        if (fabricCanvasRef.current != null) {
            try {
                fabricCanvasRef.current.setDimensions({ width: canvasWidth, height: canvasHeight });
                //resizeAndMoveBackground(canvasWidth, canvasHeight);
                updateBackgroundImage(props.baseImageURL);
            }
            catch (e) { }

        }
    }, [canvasWidth, canvasHeight]);

    const setCanvasSize = () => {

        if (props.autoSize == false && usingBackgroundImage2 == false) {
            setCanvasWidth(props.width);
            setCanvasHeight(props.height);
            return;
        }
        else {
            let imageSizesTaskAsyncFunc = async () => {
                if (props.baseImageURL != "") {
                    let img = await getImageSize(props.baseImageURL);
                    if (props.autoSize == false && usingBackgroundImage2 == true) {
                        //resize img to size of props width and height
                        let w = img.width;
                        let h = img.height;
                        if (img.width > props.width) {
                            w = props.width;
                        }
                        if (img.height > props.height) {
                            h = props.height;
                        }
                        setCanvasWidth(w);
                        setCanvasHeight(h);
                    }
                    else {
                        setCanvasWidth(img.width);
                        setCanvasHeight(img.height);
                    }
                }
            }
            imageSizesTaskAsyncFunc();
            return;
        }

    }

    useEffect(() => {
        setCanvasSize();
    }, [props.width, props.height, props.autoSize]);

    const UpdateFromJSON = async () => {
        if (props.baseCanvasJSONString != "") {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.loadFromJSON(props.baseCanvasJSONString, () => {
                    fabricCanvasRef.current.renderAll();
                    //lock background
                    //updateBackgroundImage();
                    fabricCanvasRef.current.getObjects().forEach((o) => {
                        try {
                            if (o.id == 'background') {
                                let img = o;
                                img.selectable = false;
                                img.crossOrigin = 'anonymous';
                                img.lockMovementY = true;
                                img.lockMovementX = true;
                                img.hasBorders = false;
                                img.hasControls = false;
                                img.hoverCursor = 'default';
                                img.sendToBack();
                            }
                        }
                        catch (e) { }
                    });
                });
            }
        }
    }
  
    useEffect(() => {
        //initalize fabric js 
        fabric.Object.prototype.objectCaching = false;
        fabric.Object.prototype.transparentCorners = false;
        fabricCanvasRef.current = new fabric.Canvas(canvasEl.current, {
            //backgroundColor: 'white',
            backgroundColor: "rgba(0,0,0,0)",
            uniformScaling: false,
        });
        fabricCanvasRef.current.on("object:scaling", (e) => {
            var shape = e.target;
            try {
                if (shape.isMarkupRectangle == true) {
                    let group = shape;
                    let iconRect = group._objects[1];
                    iconRect.width = markupRectangleIconBoxSize / group.scaleX;
                    iconRect.height = markupRectangleIconBoxSize / group.scaleY;
                    let iconTextRect = group._objects[2];
                    iconTextRect.scaleX = 1 / group.scaleX;
                    iconTextRect.scaleY = 1 / group.scaleY;
                }
            }
            catch (e) { }
        });
        fabricCanvasRef.current.on('object:modified', (e) => {
            SaveImageData();
        });
        const checkTextBoxSelection = () => {
            let selectedObject = fabricCanvasRef.current.getActiveObjects()[0];
            if (selectedObject.type == "textbox") {
                setTextBoxSelected(true);
            }
            else {
                setTextBoxSelected(false);
            }
        }
        fabricCanvasRef.current.on('selection:created', (e) => {
            //console.log(fabricCanvasRef.current.getActiveObjects()[0]);
            checkTextBoxSelection();
            setItemsAreSelected(true);
        });
        fabricCanvasRef.current.on('selection:updated', (e) => {
            checkTextBoxSelection();
            setItemsAreSelected(true);
        });
        fabricCanvasRef.current.on('selection:cleared', (e) => {
            setTextBoxSelected(false);
            setItemsAreSelected(false);
        });
        setCanvasSize();
        return () => {
            fabricCanvasRef.current.dispose();
        }
    }, []);

    const updateBackgroundImage2 = async (url) => {
        fabric.Image.fromURL(url, (img) => {
            if (fabricCanvasRef.current) {
                // remove existing background
                fabricCanvasRef.current.getObjects().forEach((o) => {
                    try {
                        if (o.id == 'background') {
                            fabricCanvasRef.current.remove(o);
                            //return;
                            //break;
                        }
                    }
                    catch (e) { }
                });
                //fabric JS SET BACKGROUND IMAGE has bugs so USE custom background object instead
                fabricCanvasRef.current.setBackgroundImage(img, fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current), {
                    scaleX: canvasWidth / img.width,
                    scaleY: canvasHeight / img.height
                });
            }
        }, { crossOrigin: 'Anonymous' });
    }

    const updateBackgroundImage = async (url) => {
        if (usingBackgroundImage2 == true) {
            return updateBackgroundImage2(url);
        }
        fabric.Image.fromURL(url, (img, error) => {
            if(url){
            if(error){
                setImageLoadFailure(true);
            }
            else{
                setImageLoadFailure(false);
            }
        }
            if (fabricCanvasRef.current) {
                // remove existing background
                fabricCanvasRef.current.getObjects().forEach((o) => {
                    try {
                        if (o.id == 'background') {
                            fabricCanvasRef.current.remove(o);
                            //return;
                            //break;
                        }
                    }
                    catch (e) { }
                });
                // add background image
                img.selectable = false;
                img.crossOrigin = 'anonymous';
                img.lockMovementY = true;
                img.lockMovementX = true;
                img.hasBorders = false;
                img.hasControls = false;
                img.hoverCursor = 'default';
                img.id = 'background';
                //img.width = canvasWidth;
                //img.height = canvasHeight;
                img.scaleToWidth(canvasWidth);
                img.scaleToHeight(canvasHeight);
                fabricCanvasRef.current.add(img);
                fabricCanvasRef.current.centerObject(img);
                //resizeAndMoveBackground(fabricCanvasRef.current.width, fabricCanvasRef.current.height);
                img.sendToBack();
            }
        }, { crossOrigin: 'Anonymous' });
    };

    useEffect(() => {
        let imageSizesTaskAsyncFunc = async () => {
            if (props.baseImageURL != "") {
                setCanvasSize();
                //updateBackgroundImage(props.baseImageURL);
            }
        }
        imageSizesTaskAsyncFunc();
    }, [props.baseImageURL]);

    useEffect(() => {
        let canvasLoadJSONTaskAsync = async () => {
            UpdateFromJSON();
        }
        canvasLoadJSONTaskAsync();
    }, [props.baseCanvasJSONString]);

    const addMarkupRectangle = (color, icon) => {
        let top = getRandomInt(0, 0.60 * fabricCanvasRef.current.height);
        let left = getRandomInt(0, 0.60 * fabricCanvasRef.current.width);
        const rect = new fabric.Rect({
            width: 200,
            height: 100,
            stroke: color,
            strokeWidth: 2,
            fill: 'rgba(0,0,0,0)',
            noScaleCache: true,
            isMarkupRectangle: true,
            strokeUniform: true,
        });
        const iconRect = new fabric.Rect({
            width: markupRectangleIconBoxSize,
            height: markupRectangleIconBoxSize,
            fill: color,
            noScaleCache: true,
        });
        var text = new fabric.Text(icon, {
            fontSize: markupRectangleIconBoxSize,
            fill: 'white'
        });
        var group = new fabric.Group([rect, iconRect, text], {
            top: top,
            left: left,
            isMarkupRectangle: true,
        });
        //add the group to the array
        fabricCanvasRef.current.add(group);
        fabricCanvasRef.current.setActiveObject(group);
    };

    useEffect(() => {
        fabricCanvasRef.current.isDrawingMode = drawingMode;
    }, [drawingMode]);

    const selectElementsMode = () => {
        setDrawingMode(false);
    }

    const drawApproveRectangle = () => {
        selectElementsMode();
        addMarkupRectangle('green', '\u2714');
    };

    const drawRejectRectangle = () => {
        selectElementsMode();
        addMarkupRectangle('red', '\u2716');
    }

    const deleteSelectedObjects = () => {
        fabricCanvasRef.current.getActiveObjects().forEach((obj) => { fabricCanvasRef.current.remove(obj); });
        SaveImageData();
    }

    const downloadCanvasImage = () => {
        let a = document.createElement('a');
        a.href = canvasToImageDataURL();
        a.download = 'image.jpg';
        a.click();
    }

    const drawTextBox = () => {
        let top = getRandomInt(0, 0.60 * fabricCanvasRef.current.height);
        let left = getRandomInt(0, 0.60 * fabricCanvasRef.current.width);
        let textEditable = new fabric.Textbox(
            'Editable Textbox', {
                top: top,
                left: left,
            width: 200,
            editable: true,
            fontSize: textBoxFontSize,
            fill: textBoxColor
        });
        if(textBoxBackgroundColorEnabled == false){
            textEditable.backgroundColor = "";
        }
        else{
            textEditable.backgroundColor = textBoxBackgroundColor;
        }
        fabricCanvasRef.current.add(textEditable);
        fabricCanvasRef.current.setActiveObject(textEditable);
        SaveImageData();
    }

    const history = [];

    const undo = () => {
        //set to 1 to not delete the background object
        if (fabricCanvasRef.current._objects.length > 1) {
            history.push(fabricCanvasRef.current._objects.pop());
        }
        fabricCanvasRef.current.renderAll();
        SaveImageData();
    }

    const redo = () => {
        if (history.length > 0) {
            fabricCanvasRef.current.add(history.pop());
        }
        fabricCanvasRef.current.renderAll();
        SaveImageData();
    }

    const clear = () => {
        fabricCanvasRef.current.getObjects().forEach((o) => {
            if (o.id != 'background') {
                fabricCanvasRef.current.remove(o);
            }
        });
        history.splice(0, history.length);
        SaveImageData();
    }

    const canvasMouseUp = () => {
            SaveImageData();
    };

    const toolbarRef = useRef(null);

    useEffect(()=>{
            if(canvasEl){
        if(imageLoadfailure == true){
                canvasEl.current.parentElement.style.display = 'none';
                toolbarRef.current.style.display = 'none';
        }
        else{
            canvasEl.current.parentElement.style.display = 'block'; 
            toolbarRef.current.style.display = 'flex';
        }
    }
    }, [imageLoadfailure]);

    const getFileExtensionFromString = (filename)=>{
        if(filename){
            return filename.split("?")[0].split("#")[0].split('.').pop();
        }
    };

    return <Box onMouseUp={canvasMouseUp}>
        {imageLoadfailure == true &&
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{textTransform: "uppercase", fontSize: "60px", backgroundColor: "red"}}>{getFileExtensionFromString(props.baseImageURL)}</div>
                <div>Cannot markup this submission, but you can view it in another editor.</div>
                <Button href={props.baseImageURL}>View submission</Button>
            </Box>
        }
        
        <Box ref={toolbarRef} sx={{ display: "Flex", flexDirection: "row", alignItems: "center" }}>
            <IconButton onClick={undo} title="Undo">
                <Undo></Undo>
            </IconButton>
            <IconButton onClick={redo} title="Redo">
                <Redo></Redo>
            </IconButton>
            <IconButton disabled={!itemsAreSelected} onClick={deleteSelectedObjects} title="Delete selected object">
                <Delete></Delete>
            </IconButton>
            <IconButton onClick={drawApproveRectangle} title="Draw an Approve rectangle around the items that you like.">
                <Check></Check>
            </IconButton>
            <IconButton onClick={drawRejectRectangle} title="Draw a Reject rectangle around the items that you do not like.">
                <Close></Close>
            </IconButton>
            <IconButton onClick={drawTextBox} title="Add text box">
                <TextFormatIcon></TextFormatIcon>
            </IconButton>
            {props.allowExportImageData != false &&
                //ability to export canvas to image will not be supported on database images for security reasons (CORS)
                <IconButton onClick={downloadCanvasImage} title="Download drawing">
                    <Download></Download>
                </IconButton>
            }
            <Button onClick={clear}>Clear</Button>
            <ToggleButtonGroup
                color="primary"
                value={drawingMode}
                exclusive
                onChange={(e, value) => { setDrawingMode(value); }}
                aria-label="Change interaction mode"
            >
                <ToggleButton value={false} title="Selection mode"><Mouse></Mouse></ToggleButton>
                <ToggleButton value={true} title="Drawing mode"><Draw></Draw></ToggleButton>
            </ToggleButtonGroup>
            {drawingMode == true &&
                <Box sx={{ display: "Flex", flexDirection: "row", alignItems: "center" }}>
                    {/*drawing tools */}
                    <ToggleButtonGroup
                        color="primary"
                        value={selectedDrawingTool}
                        exclusive
                        onChange={(e, value) => { setSelectedDrawingTool(value); }}
                        aria-label="Drawing tool"
                    >
                        <ToggleButton value="highlighter">Highlighter</ToggleButton>
                        <ToggleButton value="pen">Pen</ToggleButton>
                    </ToggleButtonGroup>
                    {selectedDrawingTool == "pen" &&
                        <>
                            <TextField
                                type="number"
                                value={drawingPenSize}
                                onChange={(e) => { setDrawingPenSize(e.target.value) }}
                                title="Pen size"
                                size="small"
                            />
                            <input type="color" title="Pen color" value={drawingPenColor} onChange={(e) => { setDrawingPenColor(e.target.value); }}></input>
                        </>}
                    {selectedDrawingTool == "highlighter" &&
                        <TextField
                            type="number"
                            value={highlighterPenSize}
                            onChange={(e) => { setHighlighterPenSize(e.target.value) }}
                            title="Highlighter pen size"
                            size="small"
                        />
                    }
                </Box>
            }
            {(textBoxSelected == true && drawingMode == false) &&
                <Box sx={{ display: "Flex", flexDirection: "row", alignItems: "center" }}>
                    <span>Text size: </span>
                        <TextField
                            type="number"
                            value={textBoxFontSize}
                            onChange={(e) => { setTextBoxFontSize(e.target.value) }}
                            title="Text box font size"
                            size="small"
                        />
                    <span>Text color: </span>
                    <input type="color" value={textBoxColor} onChange={(e) => { setTextBoxColor(e.target.value); }}></input>
                    <FormControlLabel control={
                        <Checkbox checked={textBoxBackgroundColorEnabled} onChange={(e) => {setTextBoxBackgroundColorEnabled(e.target.checked)}}></Checkbox>} label="Background: ">
                    </FormControlLabel>
                    <input type="color" title="Text box background color" value={textBoxBackgroundColor} onChange={(e) => { setTextBoxBackgroundColor(e.target.value); }}></input>
                </Box>
            }
        </Box>

        <canvas ref={canvasEl} ></canvas>
    </Box>;
}

ImageDrawingComponent.defaultProps = {
    width: "0",
    height: "0",
    baseImageURL: "",
    baseCanvasJSONString: "",
    autoSize: false,
    allowExportImageData: false,
    demandSave: false,
    onCanvasImageDataChanged: (b64url) => { },
    onCanvasJSONStringChanged: (jsonstring) => { },
}