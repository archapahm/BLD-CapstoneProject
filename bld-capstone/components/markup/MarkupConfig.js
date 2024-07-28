export let MarkupConfig = {
    autoSaveFeatureEnabled: true,
    defaultAutoSave: true,
    generalAcceptRejectFeatureEnabled: true,
    pdfMarkupFeatureEnabled: true,
    pdfWorkersEnabled: true
}

export function markupEncodeString(s){
    //encode string to base64 string
    return btoa(s);
}

export function markupDecodeString(s){
    //decode base64 string to string
    return atob(s);
}

export function markupGetFileNameFromPath(path){
    try{
    return path.split('\\').pop().split('/').pop();
    }
    catch(e){}
}