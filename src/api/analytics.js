
// TODO: This list should be fetched from the server
export const ANALYTICS = [
    {
        "id": 1,
        "name": "Object Detection",
        "endpoint": "objectdetection",
        "fps": 2
    },
    {
        "id": 2,
        "name": "Crowd Counting",
        "endpoint": "crowdcounting",
        "fps": 2
    },
    {
        "id": 3,
        "name": "Person Attribute Recognition",
        "endpoint": "personattribute",
        "fps": 2
    },
    {
        "id": 4,
        "name": "Ingress/Egress Counter",
        "endpoint": "ingressegress",
        "fps": 5
    },
    {
        "id": 5,
        "name": "Object Counter",
        "endpoint": "objectcounter",
        "fps": 2
    },
    {
        "id": 6,
        "name": "Bag Attributes",
        "endpoint": "bagattributes",
        "fps": 2
    }
]

const ANALYTIC_MAP = {}

ANALYTICS.forEach(x => {
    ANALYTIC_MAP[x.name] = x
})

export const getAnalyticEndpoint = name => ANALYTIC_MAP[name]?.endpoint
