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
  "data": JSON.parse("{\"sid_01\": [{\"FR Vehicle Count\": \"10\", \"Reg Vehicle Count\": \"5\", \"Sensor ID\": \"01000\", \"Time\": \"13:01:34\", \"Total Vehicle Count\": \"15\"}], \"sid_02\": [{\"Altitude\": \"2000\", \"Lat\": \"37.76884614\", \"Lon\": \"-105.68466662\", \"Sensor ID\": \"02001\", \"Time\": \"13:01:34\"}, {\"Altitude\": \"2000\", \"Lat\": \"37.76889629\", \"Lon\": \"-105.68476788\", \"Sensor ID\": \"02000\", \"Time\": \"13:01:34\"}, {\"Altitude\": \"2000\", \"Lat\": \"37.76884527\", \"Lon\": \"-105.68444936\", \"Sensor ID\": \"02002\", \"Time\": \"13:01:34\"}, {\"Altitude\": \"2000\", \"Lat\": \"37.76886304\", \"Lon\": \"-105.68475774\", \"Sensor ID\": \"02003\", \"Time\": \"13:01:34\"}, {\"Altitude\": \"2000\", \"Lat\": \"37.76886769\", \"Lon\": \"-105.68472039\", \"Sensor ID\": \"02004\", \"Time\": \"13:01:34\"}, {\"Altitude\": \"2000\", \"Lat\": \"37.76885981\", \"Lon\": \"-105.68458988\", \"Sensor ID\": \"02005\", \"Time\": \"13:01:34\"}], \"sid_03\": [{\"Count\": \"12\", \"Sensor ID\": \"03000\", \"Time\": \"13:01:34\"}], \"sid_04\": [{\"Is HeatStroke\": \"True\", \"Lat\": \"37.7688936\", \"Lon\": \"-105.68465323\", \"Sensor ID\": \"04000\", \"Temperature\": \"90.1\", \"Time\": \"13:01:34\"}], \"sid_05\": [{\"Pulse Oxygen\": \"97\", \"Pulse Rate\": \"99\", \"Sensor ID\": \"05003\", \"Temperature\": \"98.8\", \"Time\": \"13:01:34\"}, {\"Pulse Oxygen\": \"97\", \"Pulse Rate\": \"101\", \"Sensor ID\": \"05002\", \"Temperature\": \"98.6\", \"Time\": \"13:01:34\"}, {\"Pulse Oxygen\": \"97\", \"Pulse Rate\": \"105\", \"Sensor ID\": \"05000\", \"Temperature\": \"98.6\", \"Time\": \"13:01:34\"}, {\"Pulse Oxygen\": \"91\", \"Pulse Rate\": \"167\", \"Sensor ID\": \"05001\", \"Temperature\": \"99.3\", \"Time\": \"13:01:34\"}, {\"Pulse Oxygen\": \"97\", \"Pulse Rate\": \"94\", \"Sensor ID\": \"05005\", \"Temperature\": \"99.1\", \"Time\": \"13:01:34\"}, {\"Pulse Oxygen\": \"97\", \"Pulse Rate\": \"99\", \"Sensor ID\": \"05004\", \"Temperature\": \"98.7\", \"Time\": \"13:01:34\"}], \"sid_06\": [{\"Count\": \"44\", \"Sensor ID\": \"06000\", \"Time\": \"13:01:34\"}], \"sid_07\": [{\"Count\": \"6\", \"Lat\": \"37.7690977\", \"Lon\": \"-105.68492268\", \"Sensor ID\": \"07000\", \"Time\": \"13:01:34\"}], \"sid_08\": [{\"Detected\": \"True\", \"Lat\": \"37.76888246\", \"Lon\": \"-105.68455721\", \"Sensor ID\": \"08000\", \"Time\": \"13:01:34\"}], \"sid_10\": [{\"Detected\": \"False\", \"Lat\": \"37.768883\", \"Lon\": \"-105.684528\", \"Sensor ID\": \"10000\", \"Time\": \"13:01:34\"}, {\"Detected\": \"False\", \"Lat\": \"37.768883\", \"Lon\": \"-105.68451664\", \"Sensor ID\": \"10001\", \"Time\": \"13:01:34\"}, {\"Detected\": \"True\", \"Lat\": \"37.768883\", \"Lon\": \"-105.68449391\", \"Sensor ID\": \"10003\", \"Time\": \"13:01:34\"}, {\"Detected\": \"False\", \"Lat\": \"37.768883\", \"Lon\": \"-105.68450527\", \"Sensor ID\": \"10002\", \"Time\": \"13:01:34\"}, {\"Detected\": \"True\", \"Lat\": \"37.768883\", \"Lon\": \"-105.68448254\", \"Sensor ID\": \"10004\", \"Time\": \"13:01:34\"}], \"sid_12\": [{\"Down\": \"False\", \"Sensor ID\": \"12001\", \"Time\": \"13:01:34\"}, {\"Down\": \"False\", \"Sensor ID\": \"12000\", \"Time\": \"13:01:34\"}, {\"Down\": \"False\", \"Sensor ID\": \"12002\", \"Time\": \"13:01:34\"}, {\"Down\": \"False\", \"Sensor ID\": \"12003\", \"Time\": \"13:01:34\"}, {\"Down\": \"False\", \"Sensor ID\": \"12004\", \"Time\": \"13:01:34\"}, {\"Down\": \"False\", \"Sensor ID\": \"12005\", \"Time\": \"13:01:34\"}], \"sid_13\": [{\"Item Type\": \"CellularDevice\", \"Lat\": \"37.76886769\", \"Lon\": \"-105.68472039\", \"Sensor ID\": \"13004\", \"Time\": \"13:01:34\"}, {\"Item Type\": \"UtilityTool\", \"Lat\": \"37.76885981\", \"Lon\": \"-105.68458988\", \"Sensor ID\": \"13005\", \"Time\": \"13:01:34\"}, {\"Item Type\": \"CellularDevice\", \"Lat\": \"37.76884614\", \"Lon\": \"-105.68466662\", \"Sensor ID\": \"13001\", \"Time\": \"13:01:34\"}, {\"Item Type\": \"MedicalBag\", \"Lat\": \"37.76889629\", \"Lon\": \"-105.68476788\", \"Sensor ID\": \"13000\", \"Time\": \"13:01:34\"}, {\"Item Type\": \"UtilityTool\", \"Lat\": \"37.76884527\", \"Lon\": \"-105.68444936\", \"Sensor ID\": \"13002\", \"Time\": \"13:01:34\"}, {\"Item Type\": \"MedicalBag\", \"Lat\": \"37.76886304\", \"Lon\": \"-105.68475774\", \"Sensor ID\": \"13003\", \"Time\": \"13:01:34\"}]}")
}

export const DEFAULT_GUTTER = { xs: 8, sm: 16, md: 16, lg: 16 }

export const PLAN_DOC = "https://docs.google.com/document/d/1Yw-KOOK7ieXsGpUdyg4auT6kFr1yVgYA/edit?usp=sharing&ouid=112682453649002000345&rtpof=true&sd=true"

export const RTE_CONFIG  = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  };