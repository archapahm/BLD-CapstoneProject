import { generateFirestoreId } from "@/utils/generate-firestore-id";
import { Timestamp } from "firebase/firestore";

export const PHASES_DATA = [
    {
        id: generateFirestoreId(),
        sequence: 1,
        code: "01",
        title: "Concept Development",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 2,
        code: "02",
        title: "Site Analysis & Planning",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 3,
        code: "03",
        title: "Floor Plans",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 4,
        code: "04",
        title: "Interior Design",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 5,
        code: "05",
        title: "Construction & 3D Documents",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 6,
        code: "06",
        title: "Furnishing & Decor",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 7,
        code: "07",
        title: "Construction Administration",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    },
    {
        id: generateFirestoreId(),
        sequence: 8,
        code: "08",
        title: "Construction Management",
        description: "",
        subphases: [],
        created: Timestamp.fromDate(new Date(Date.now())),
        updated: ""
    }
];
