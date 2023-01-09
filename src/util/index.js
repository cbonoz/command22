import React from "react";
import { LARGE_FILE_MB } from "./constants";

import MapIcon_AutomaticVehiclesLocation from "../assets/Icon_Standard_AutomaticVehiclesLocation.png"
import MapIcon_FirstResponderLocation from "../assets/Icon_Standard_FirstResponderLocation.png"
import MapIcon_EventSpaceOccupancy from "../assets/Icon_Standard_EventSpaceOccupancy.png"
import MapIcon_EventSpaceAmbientTemperature from "../assets/Icon_Standard_EventSpaceTemperature.png"
import MapIcon_FirstResponderVitals from "../assets/Icon_Standard_FirstResponderVitals.png"
import MapIcon_BuildingOccupancy from "../assets/Icon_Standard_BuildingOccupancy.png"
import MapIcon_ExternalProtestMonitoring from "../assets/Icon_Standard_ExternalProtestMonitoring.png"
import MapIcon_HazardIdentification from "../assets/Icon_Standard_HazardIdentification.png"
import MapIcon_VictimVitals from "../assets/Icon_Standard_VictimVitals.png"
import MapIcon_StructuralHazardDetection from "../assets/Icon_Standard_StructuralHazardDetection.png"
import MapIcon_VideoFeedObjectTracking from "../assets/Icon_Standard_VideoFeedObjectTracking.png"
import MapIcon_FirstResponderStatusDetection from "../assets/Icon_Standard_FirstResponderStatus.png"
import MapIcon_FirstResponderAsset from "../assets/Icon_Standard_FirstResponderAsset.png"
import MapIcon_Generic from "../assets/Icon_Standard_Generic.png"
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
    const id = Number(marker["Sensor ID"]);
    const sensorId = id < 20000 ? id * 10 : id;
    if (sensorId < 20000) {
        return MapIcon_AutomaticVehiclesLocation;
    } else if (sensorId < 30000) {
        return MapIcon_FirstResponderLocation;
    } else if (sensorId < 40000) {
        return MapIcon_EventSpaceOccupancy;
    } else if (sensorId < 50000) {
        return MapIcon_EventSpaceAmbientTemperature;
    } else if (sensorId < 60000) {
        return MapIcon_FirstResponderVitals;
    } else if (sensorId < 70000) {
        return MapIcon_BuildingOccupancy;
    } else if (sensorId < 80000) {
        return MapIcon_ExternalProtestMonitoring;
    } else if (sensorId < 90000) {
        return MapIcon_HazardIdentification;
    } else if (sensorId < 100000) {
        return MapIcon_VictimVitals;
    } else if (sensorId < 110000) {
        return MapIcon_StructuralHazardDetection;
    } else if (sensorId < 120000) {
        return MapIcon_VideoFeedObjectTracking;
    } else if (sensorId < 130000) {
        return MapIcon_FirstResponderStatusDetection;
    } else if (sensorId < 140000) {
        return MapIcon_FirstResponderAsset;
    }
    return MapIcon_Generic;
}

export const getMarkerTitle = marker => {
    const id = Number(marker["Sensor ID"]);
    const sensorId = id < 20000 ? id * 10 : id;
    if (sensorId < 20000) {
        return "Staging Automatic Vehicle Location (AVL)";
    } else if (sensorId < 30000) {
        return "First Responder Location";
    } else if (sensorId < 40000) {
        return "Event Space Occupancy";
    } else if (sensorId < 50000) {
        return "Event Space Ambient Temperature";
    } else if (sensorId < 60000) {
        return "First Responder Vitals";
    } else if (sensorId < 70000) {
        return "Building Occupancy";
    } else if (sensorId < 80000) {
        return "External Protest Monitoring";
    } else if (sensorId < 90000) {
        return "Hazard Identification";
    } else if (sensorId < 100000) {
        return "Victim Vitals";
    } else if (sensorId < 110000) {
        return "Structural Hazard Detection";
    } else if (sensorId < 120000) {
        return "Video Feed Object Tracking";
    } else if (sensorId < 130000) {
        return "First Responder Status Detection";
    } else if (sensorId < 140000) {
        return "First Responder Asset";
    }
    return "Untitled Sensor";
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
        const id = Number(dataReading["Sensor ID"]);
        const sensorId = id < 20000 ? id * 10 : id;
        if (sensorId < 20000) {
            return createCardItem(
                index,
                "Staging Automatic Vehicle Location (AVL)",
                [
                    "FR Vehicle Count: " + dataReading["FR Vehicle Count"],
                    "Reg Vehicle Count: " + dataReading["Reg Vehicle Count"]
                ],
                'risk-card'
            );
        } else if (sensorId < 30000) {
            return createCardItem(
                index,
                "First Responder Location",
                [
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"],
                    "Altitude: " + dataReading["Altitude"]
                ]
            );
        } else if (sensorId < 40000) {
            return createCardItem(
                index,
                "Event Space Occupancy",
                ["Occupancy of bystanders in event space: " + dataReading["Count"]]
            );
        } else if (sensorId < 50000) {
            return createCardItem(
                index,
                "Event Space Ambient Temperature",
                [
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"],
                    "Heatstroke Risk: " + dataReading["Is Heatstroke"],

                ]
            );
        } else if (sensorId < 60000) {
            return createCardItem(
                index,
                "First Responder Vitals",
                [
                    "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
                    "Pulse Rate: " + dataReading["Pulse Rate"],
                    "Temperature: " + dataReading["Temperature"]
                ]
            );
        } else if (sensorId < 70000) {
            return createCardItem(
                index,
                "Building Occupancy",
                ["Occupancy of bystanders in building: " + dataReading["Count"]]
            );
        } else if (sensorId < 80000) {
            return createCardItem(
                index,
                "External Protest Monitoring",
                [
                    "Count: " + dataReading["Count"],
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"]
                ]
            );
        } else if (sensorId < 90000) {
            return createCardItem(
                index,
                "Hazard Identification",
                [
                    "Smoke detected: " + dataReading["Detected"],
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"]
                ]
            );
        } else if (sensorId < 100000) {
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
        } else if (sensorId < 110000) {
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
        } else if (sensorId < 120000) {
            return createCardItem(
                index,
                "Video Feed Object Tracking",
                []
            );
        } else if (sensorId < 130000) {
            return createCardItem(
                index,
                "First Responder Status Detection",
                ["First Responder is incapacitated: " + dataReading["Down"]]
            );
        } else if (sensorId < 140000) {
            return createCardItem(
                index,
                "Item Detected",
                [
                    "Item Type: " + dataReading["Item Type"],
                    "Latitude: " + dataReading["Lat"],
                    "Longitude: " + dataReading["Lon"]

                ]
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