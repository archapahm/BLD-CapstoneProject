import { db } from "@/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";

export async function fetchPhaseById(id) {
    try {
        const docRef = doc(db, "phases", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (error) {
        console.error("Error in fetchPhaseById: ", error);
    }
}