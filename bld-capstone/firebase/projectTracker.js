import { Timestamp, addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './config';

const collectionName = "projectTracker";
const subCollectionName = "dates";

const addStartTime = async (projectId, startTime) => {
  // Create a reference to the parent document
  const parentRef = doc(db, collectionName, projectId);

  // Add a document to the subcollection
  const subCollectionData = {
      startTime: startTime,
      stopTime: '',
      totalTime: 0,
      isRunning: true
  }

  // Add a document to the subcollection
  await setDoc(parentRef, {
    projectId: projectId
  }).then(() => {
    const childRef = doc(collection(db, collectionName, projectId, subCollectionName));
    setDoc(childRef, subCollectionData, {merge: true});
  });
}

const addStopTime = async (projectId, subCollectionId, stopTime, totalTime) => {
  const docRef = doc(db, collectionName, projectId, subCollectionName, subCollectionId);
  await setDoc(docRef, {
    stopTime: stopTime,
    totalTime: totalTime,
    isRunning: false
  }, {merge: true});
}

const getRunningTime = async (projectId) => {
  const q = query(collection(db, collectionName, projectId, subCollectionName), where("isRunning", "==", true));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const obj = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    }
    return obj;
  } else {
    return null;
  }
  
};

const getTimeListByProject = async (projectId) => {
  const q = query(collection(db, collectionName, projectId, subCollectionName), where("isRunning", "==", false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
}

export { addStartTime, addStopTime, getRunningTime, getTimeListByProject };