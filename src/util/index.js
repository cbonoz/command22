
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