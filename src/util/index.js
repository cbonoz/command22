import { LARGE_FILE_MB } from "./constants";

export const getDataUrl = (data) => `data:image/jpeg;base64,${data}`

export const createObjectUrl = (f) => {
    const objectURL = window.URL.createObjectURL(f);
    return objectURL;
}
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const getDomainFromEmail = email => email?.split('@')[1].toLowerCase()

export const convertToArray = (value) => {
    return value ? (Array.isArray(value) ? value: [value]) : []
}

export const getReadableDateTime = d => {
    if (!(d instanceof Date)) {
        d = new Date(d)
    }
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

// list of [[1, "0.98777175", [[0.802286873282967, 0.6504241824150085], ...
export const getBoundBoxes = (analyticsBoxes, width, height) => {
    if (!analyticsBoxes) {
        return []
    }

    if (typeof analyticsBoxes === 'string') {
        analyticsBoxes = JSON.parse(analyticsBoxes)
    }

    if (!Array.isArray(analyticsBoxes)) {
        return []
    }
    // Returns [[x, y, width, height], ...] where x,y is top left corner.
    const locations = analyticsBoxes.map(x => x[2])
    let results = [];
    try {
        results = locations.map((box, i) => {
            const diffY = box[1][1] - box[0][1]
            const diffX = box[1][0] - box[0][0]
            return [box[0][0]*width, box[0][1]*height, diffX*width, diffY*height]
        })
    } catch (e) {
        console.error(e)
    }
    return results;
}

export const isLargeData = (dataBytes) => {
    return dataBytes.length > LARGE_FILE_MB*Math.pow(10, 6);
}

export const col = (key, render) => {
    return {
        title: capitalize(key),
        dataIndex: key,
        key,
        render,
    }
}

export const NOTIFICATION_COLUMNS = [
    col('type'),
    col('text'),
    col('createdAt', getReadableDateTime),
    col('createdBy'),
]