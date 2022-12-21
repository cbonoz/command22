export const APP_NAME = 'CloudResponder';
export const APP_DESC = 'A data-driven incident response and visualization platform for first-responders';

const hostname = window.location.hostname
export const IS_LOCAL = hostname.indexOf("localhost") !== -1

export const CONTEST_LINK = 'https://www.nist.gov/ctl/pscr/open-innovation-prize-challenges/current-and-upcoming-prize-challenges/2022-commanding-tech'

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

export const LARGE_FILE_MB = 25;

export const EXAMPLE_SENSOR_DATA = {
    "13:00:00": [
        {
            "Count": "50",
            "Sensor ID": "06000",
            "Time": "13:00:00"
        },
        {
            "Down": "False",
            "Sensor ID": "12001",
            "Time": "13:00:00"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "99",
            "Sensor ID": "05003",
            "Temperature": "98.7",
            "Time": "13:00:00"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "94",
            "Sensor ID": "05002",
            "Temperature": "99",
            "Time": "13:00:00"
        },
        {
            "Down": "False",
            "Sensor ID": "12000",
            "Time": "13:00:00"
        },
        {
            "Down": "False",
            "Sensor ID": "12002",
            "Time": "13:00:00"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "103",
            "Sensor ID": "05000",
            "Temperature": "97.8",
            "Time": "13:00:00"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "102",
            "Sensor ID": "05001",
            "Temperature": "98",
            "Time": "13:00:00"
        },
        {
            "Down": "False",
            "Sensor ID": "12003",
            "Time": "13:00:00"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "100",
            "Sensor ID": "05005",
            "Temperature": "98.7",
            "Time": "13:00:00"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "105",
            "Sensor ID": "05004",
            "Temperature": "98.7",
            "Time": "13:00:00"
        },
        {
            "Down": "False",
            "Sensor ID": "12004",
            "Time": "13:00:00"
        },
        {
            "Detected": "False",
            "Lat": "37.646383",
            "Lon": "-105.331728012207",
            "Sensor ID": "08000",
            "Time": "13:00:00"
        },
        {
            "Down": "False",
            "Sensor ID": "12005",
            "Time": "13:00:00"
        },
        {
            "Detected": "False",
            "Lat": "37.768883",
            "Lon": "-105.684528",
            "Sensor ID": "10000",
            "Time": "13:00:00"
        },
        {
            "Altitude": "2000",
            "Lat": "38.245336018188",
            "Lon": "-105.6661489948063",
            "Sensor ID": "02001",
            "Time": "13:00:00"
        },
        {
            "Altitude": "2000",
            "Lat": "38.304793720825",
            "Lon": "-105.7269758387833",
            "Sensor ID": "02000",
            "Time": "13:00:00"
        },
        {
            "Detected": "False",
            "Lat": "37.77888300000001",
            "Lon": "-105.674528",
            "Sensor ID": "10001",
            "Time": "13:00:00"
        },
        {
            "Detected": "True",
            "Lat": "37.798883000000004",
            "Lon": "-105.65452800000001",
            "Sensor ID": "10003",
            "Time": "13:00:00"
        },
        {
            "Altitude": "2000",
            "Lat": "38.281732197387996",
            "Lon": "-105.7424563189774",
            "Sensor ID": "02002",
            "Time": "13:00:00"
        },
        {
            "Altitude": "2000",
            "Lat": "38.249103031738",
            "Lon": "-105.81399139607241",
            "Sensor ID": "02003",
            "Time": "13:00:00"
        },
        {
            "Is HeatStroke": "True",
            "Lat": "37.61918299733",
            "Lon": "-105.5241279908447",
            "Sensor ID": "04000",
            "Temperature": "90.1",
            "Time": "13:00:00"
        },
        {
            "Detected": "False",
            "Lat": "37.788883",
            "Lon": "-105.664528",
            "Sensor ID": "10002",
            "Time": "13:00:00"
        },
        {
            "Count": "34",
            "Sensor ID": "03000",
            "Time": "13:00:00"
        },
        {
            "Altitude": "2000",
            "Lat": "38.27679155407701",
            "Lon": "-105.8382016774445",
            "Sensor ID": "02004",
            "Time": "13:00:00"
        },
        {
            "FR Vehicle Count": "10",
            "Reg Vehicle Count": "5",
            "Sensor ID": "01000",
            "Time": "13:00:00",
            "Total Vehicle Count": "15"
        },
        {
            "Altitude": "2000",
            "Lat": "38.312440434082006",
            "Lon": "-105.77846928799441",
            "Sensor ID": "02005",
            "Time": "13:00:00"
        },
        {
            "Detected": "True",
            "Lat": "37.80888300000001",
            "Lon": "-105.644528",
            "Sensor ID": "10004",
            "Time": "13:00:00"
        },
        {
            "Count": "10",
            "Lat": "37.68388300000001",
            "Lon": "-105.734528",
            "Sensor ID": "07000",
            "Time": "13:00:00"
        }
    ],
    "13:00:01": [
        {
            "Count": "50",
            "Sensor ID": "06000",
            "Time": "13:00:01"
        },
        {
            "Down": "False",
            "Sensor ID": "12001",
            "Time": "13:00:01"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "110",
            "Sensor ID": "05003",
            "Temperature": "99",
            "Time": "13:00:01"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "95",
            "Sensor ID": "05002",
            "Temperature": "98.5",
            "Time": "13:00:01"
        },
        {
            "Down": "False",
            "Sensor ID": "12000",
            "Time": "13:00:01"
        },
        {
            "Down": "False",
            "Sensor ID": "12002",
            "Time": "13:00:01"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "106",
            "Sensor ID": "05000",
            "Temperature": "98.6",
            "Time": "13:00:01"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "96",
            "Sensor ID": "05001",
            "Temperature": "99.2",
            "Time": "13:00:01"
        },
        {
            "Down": "False",
            "Sensor ID": "12003",
            "Time": "13:00:01"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "101",
            "Sensor ID": "05005",
            "Temperature": "98.4",
            "Time": "13:00:01"
        },
        {
            "Pulse Oxygen": "97",
            "Pulse Rate": "97",
            "Sensor ID": "05004",
            "Temperature": "99.6",
            "Time": "13:00:01"
        },
        {
            "Down": "False",
            "Sensor ID": "12004",
            "Time": "13:00:01"
        },
        {
            "Detected": "False",
            "Lat": "37.646383",
            "Lon": "-105.331728012207",
            "Sensor ID": "08000",
            "Time": "13:00:01"
        },
        {
            "Down": "False",
            "Sensor ID": "12005",
            "Time": "13:00:01"
        },
        {
            "Detected": "False",
            "Lat": "37.768883",
            "Lon": "-105.684528",
            "Sensor ID": "10000",
            "Time": "13:00:01"
        },
        {
            "Altitude": "2000",
            "Lat": "38.245336018188",
            "Lon": "-105.6661489948063",
            "Sensor ID": "02001",
            "Time": "13:00:01"
        },
        {
            "Altitude": "2000",
            "Lat": "38.304793720825",
            "Lon": "-105.7269758387833",
            "Sensor ID": "02000",
            "Time": "13:00:01"
        },
        {
            "Detected": "False",
            "Lat": "37.77888300000001",
            "Lon": "-105.674528",
            "Sensor ID": "10001",
            "Time": "13:00:01"
        },
        {
            "Detected": "True",
            "Lat": "37.798883000000004",
            "Lon": "-105.65452800000001",
            "Sensor ID": "10003",
            "Time": "13:00:01"
        },
        {
            "Altitude": "2000",
            "Lat": "38.281732197387996",
            "Lon": "-105.7424563189774",
            "Sensor ID": "02002",
            "Time": "13:00:01"
        },
        {
            "Altitude": "2000",
            "Lat": "38.249103031738",
            "Lon": "-105.81399139607241",
            "Sensor ID": "02003",
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
        {
            "Detected": "False",
            "Lat": "37.788883",
            "Lon": "-105.664528",
            "Sensor ID": "10002",
            "Time": "13:00:01"
        },
        {
            "Count": "34",
            "Sensor ID": "03000",
            "Time": "13:00:01"
        },
        {
            "Altitude": "2000",
            "Lat": "38.27679155407701",
            "Lon": "-105.8382016774445",
            "Sensor ID": "02004",
            "Time": "13:00:01"
        },
        {
            "FR Vehicle Count": "10",
            "Reg Vehicle Count": "5",
            "Sensor ID": "01000",
            "Time": "13:00:01",
            "Total Vehicle Count": "15"
        },
        {
            "Altitude": "2000",
            "Lat": "38.312440434082006",
            "Lon": "-105.77846928799441",
            "Sensor ID": "02005",
            "Time": "13:00:01"
        },
        {
            "Detected": "True",
            "Lat": "37.80888300000001",
            "Lon": "-105.644528",
            "Sensor ID": "10004",
            "Time": "13:00:01"
        },
        {
            "Count": "10",
            "Lat": "37.68388300000001",
            "Lon": "-105.734528",
            "Sensor ID": "07000",
            "Time": "13:00:01"
        }
    ],
}
