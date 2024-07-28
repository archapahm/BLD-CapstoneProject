import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './config';

const addMoodBoard = (collectionName, projectId, version, documentObj, id) => {
  const docRef = doc(collection(db, collectionName, projectId, version), id);
  return setDoc(docRef, { 
    ...documentObj,
    timestamp: serverTimestamp(),
  }, { merge: true });
};

export default addMoodBoard;
