export const APP_NAME = 'CloudResponder';
export const APP_DESC = 'Data-driven incident response and visualization platform for first-responders';

const hostname = window.location.hostname
export const IS_LOCAL = hostname.indexOf("localhost") !== -1

export const TEST_INTEREST_POINTS = [
    {
        "Detected": "False",
        "Altitude": "2000",
        "Lat": "38.245336018188",
        "Lon": "-105.6661489948063",
        "Sensor ID": "02001",
        "Time": "13:00:00"
    },
    {
        "Detected": "True",
        "Altitude": "1000",
        "Lat": "38.304793720825",
        "Lon": "-105.7269758387833",
        "Sensor ID": "02000",
        "Time": "13:00:01"
    },
    {
        "Is HeatStroke": "True",
        "Lat": "37.61918299733",
        "Lon": "-105.5241279908447",
        "Sensor ID": "04000",
        "Temperature": "90.1",
        "Time": "13:00:01"
    },
]
