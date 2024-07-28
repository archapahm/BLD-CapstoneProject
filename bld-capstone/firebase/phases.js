import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';

const getPhases = async () => {
    const q = query(collection(db, "phases"), orderBy("sequence"));

    try {
        const querySnapshot = await getDocs(q);
        const phases = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        return phases;
    } catch (error) {
        console.error("Error fetching phases: ", error);
    }
}

export { getPhases };