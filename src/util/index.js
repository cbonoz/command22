


export const createObjectUrl = (f) => {
    const objectURL = window.URL.createObjectURL(f);
    return objectURL;
}
export function capitalize(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);

}

export const getDomainFromEmail = email => email?.split('@')[1].toLowerCase()