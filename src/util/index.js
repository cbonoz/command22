import React from "react";
import { LARGE_FILE_MB } from "./constants";

import MapIcon_Altitude from "../assets/MapIcon_Altitude.png"
import MapIcon_Count from "../assets/MapIcon_Count.png"
import MapIcon_Detected from "../assets/MapIcon_Detected.png"
import MapIcon_Down from "../assets/MapIcon_Down.png"
import MapIcon_Heatstroke from "../assets/MapIcon_Heatstroke.png"
import MapIcon_Pulse from "../assets/MapIcon_Pulse.png"
import MapIcon_Vehicles from "../assets/MapIcon_Vehicles.png"
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Card } from "antd";

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
    return value ? (Array.isArray(value) ? value : [value]) : []
}

export const getReadableError = (e) => {
    let msg
    if (e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message
    } else {
        msg = e.toString()
    }

    if (msg.indexOf('503') !== 0) {
        // Server outage / issue (should retry)
        msg = 'Server temporarily unavailable. Please try again.'
    }

    return msg
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

    if (!Array.isArray(analyticsBoxes) || analyticsBoxes.length === 0) {
        return []
    }

    let boxes;
    if (analyticsBoxes[0].detection) {
        boxes = analyticsBoxes.map(x => x.detection)
    } else {
        boxes = analyticsBoxes
    }

    // Returns [[x, y, width, height], ...] where x,y is top left corner.
    const locations = boxes.map(x => x[2])
    let results = [];
    try {
        results = locations.map((box, index) => {
            const diffY = box[1][1] - box[0][1]
            const diffX = box[1][0] - box[0][0]
            const coord = [box[0][0] * width, box[0][1] * height, diffX * width, diffY * height]
            const res = { ...analyticsBoxes[index], coord, index }
            return res;
        })
    } catch (e) {
        console.error(e)
    }
    return results;
}

export const isLargeData = (dataBytes) => {
    return dataBytes.length > LARGE_FILE_MB * Math.pow(10, 6);
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

export const tab = (label) => {
    return {
        key: label.toLowerCase(),
        tab: label,
    }
}


export const getMarkerIcon = marker => {
    const sensorId = Number(marker["Sensor ID"]);
    if (sensorId < 2000) {
        return MapIcon_Vehicles;
    } else if (sensorId < 3000) {
        return MapIcon_Altitude;
    } else if (sensorId < 4000) {
        return MapIcon_Count;
    } else if (sensorId < 5000) {
        return MapIcon_Heatstroke;
    } else if (sensorId < 6000) {
        return MapIcon_Pulse;
    } else if (sensorId < 7000) {
        return MapIcon_Count;
    } else if (sensorId < 8000) {
        return MapIcon_Count;
    } else if (sensorId < 9000) {
        return MapIcon_Detected;
    } else if (sensorId < 10000) {
        return MapIcon_Pulse;
    } else if (sensorId < 11000) {
        return MapIcon_Detected;
    } else if (sensorId < 12000) {
        return MapIcon_Altitude;
    } else if (sensorId < 13000) {
        return MapIcon_Down;
    }
    return MapIcon_Altitude;
}

export const getMarkerTitle = marker => {
    const sensorId = Number(marker["Sensor ID"]);
    if (sensorId < 2000) {
        return "Staging Automatic Vehicle Location (AVL)";
    } else if (sensorId < 3000) {
        return "First Responder Location";
    } else if (sensorId < 4000) {
        return "Event Space Occupancy";
    } else if (sensorId < 5000) {
        return "Event Space Ambient Temperature";
    } else if (sensorId < 6000) {
        return "First Responder Vitals";
    } else if (sensorId < 7000) {
        return "Building Occupancy";
    } else if (sensorId < 8000) {
        return "External Protest Monitoring";
    } else if (sensorId < 9000) {
        return "Hazard Identification";
    } else if (sensorId < 10000) {
        return "Victim Vitals";
    } else if (sensorId < 11000) {
        return "Structural Hazard Detection";
    } else if (sensorId < 12000) {
        return "Video Feed Object Tracking";
    } else if (sensorId < 13000) {
        return "First Responder Status Detection";
    }
    return "";
}

export const createCardItem = (index, title, lines, classes, onClick) => {
    return (
        <Card className={`${classes || ''} card-item`} key={index + 1} title={title}
        onClick={onClick}
        >
            <ul>{lines.map(text => <li><h3>{text}</h3></li>)}</ul>
        </Card>
    );
};

export const getSensorDataList = interval => {
    return interval.map(function (dataReading, index) {
        const sensorId = Number(dataReading["Sensor ID"]);
        if (sensorId < 2000) {
            return createCardItem(
                index,
                "Staging Automatic Vehicle Location (AVL)",
                ["FR Vehicle Count: " + dataReading["FR Vehicle Count"]],
                'risk-card'
            );
        } else if (sensorId < 3000) {
            return createCardItem(
                index,
                "First Responder Location",
                [
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"],
                    "Altitude: " + dataReading["Altitude"]
                ]
            );
        } else if (sensorId < 4000) {
            return createCardItem(
                index,
                "Event Space Occupancy",
                ["Occupancy of bystanders in event space: " + dataReading["Count"]]
            );
        } else if (sensorId < 5000) {
            return createCardItem(
                index,
                "Event Space Ambient Temperature",
                [
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"],
                    "Heatstroke Risk: " + dataReading["Is Heatstroke"],

                ]
            );
        } else if (sensorId < 6000) {
            return createCardItem(
                index,
                "First Responder Vitals",
                [
                    "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
                    "Pulse Rate: " + dataReading["Pulse Rate"],
                    "Temperature: " + dataReading["Temperature"]
                ]
            );
        } else if (sensorId < 7000) {
            return createCardItem(
                index,
                "Building Occupancy",
                ["Occupancy of bystanders in building: " + dataReading["Count"]]
            );
        } else if (sensorId < 8000) {
            return createCardItem(
                index,
                "External Protest Monitoring",
                [
                    "Count: " + dataReading["Count"],
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"]
                ]
            );
        } else if (sensorId < 9000) {
            return createCardItem(
                index,
                "Hazard Identification",
                [
                    "Smoke detected: " + dataReading["Detected"],
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"]
                ]
            );
        } else if (sensorId < 10000) {
            return createCardItem(
                index,
                "Victim Vitals",
                [
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"],
                    "Altitude: " + dataReading["Altitude"],
                    "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
                    "Pulse Rate: " + dataReading["Pulse Rate"],
                    "Temperature: " + dataReading["Temperature"]
                ]
            );
        } else if (sensorId < 11000) {
            return createCardItem(
                index,
                "Structural Hazard Detection",
                [
                    "Structural damage detected: " + dataReading["Detected"],
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"]
                ],
                'risk-card'
            );
        } else if (sensorId < 12000) {
            return createCardItem(
                index,
                "Video Feed Object Tracking",
                []
            );
        } else if (sensorId < 13000) {
            return createCardItem(
                index,
                "First Responder Status Detection",
                ["First Responder is incapacitated: " + dataReading["Down"]]
            );
        }
        return <li key={index + 201}>{JSON.stringify(dataReading)}</li>;
    });
}


export const markerList = markers => {
    return markers.map(function (marker, index) {
        if (marker && marker.Lat && marker.Lon) {
            return (
                <Marker
                    position={[marker.Lat, marker.Lon]}
                    icon={new Icon({
                        iconUrl: getMarkerIcon(marker),
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                    })}
                >
                    <Popup>
                        {createCardItem(
                            index,
                            getMarkerTitle(marker),
                            Object.keys(marker).map((k) => `${k}: ${marker[k]}`),
                        )}
                    </Popup>
                </Marker>
            );
        }
    })
};