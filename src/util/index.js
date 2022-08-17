


export const createObjectUrl = (videoFile) => {
    const objectURL = window.URL.createObjectURL(videoFile);
    // const audio = new Audio(objectURL);
    // const stream = audio.captureStream();
    return objectURL;
}