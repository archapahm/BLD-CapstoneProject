import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './config';

const collectionName = "users";

const UserType = {
  UNKNOWN: "unknown",
  INTERNAL: "internal",
  CLIENT: "client"
};

const addUser = async (userUID, displayName) => {
  const docRef = doc(collection(db, collectionName), userUID);
  await setDoc(docRef, {
    admin: false,
    enabled: false,
    internal: false,
    name: displayName,
    created: serverTimestamp(),
    updated: ""
  });
};

const getUserByUID = async (userUID) => {
  const docRef = doc(db, collectionName, userUID);

  try {
    const doc = await getDoc(docRef);
    return doc.data();
  } catch (error) {
    console.error("Fail to get user by UID: " + error);
  }
}

const userIsEnabled = async (userUID) => {
  const docRef = doc(db, collectionName, userUID);

  try {
    const doc = await getDoc(docRef);
    return doc.data().enabled;
  } catch (error) {
    console.error(error);
  }
}

export { UserType, addUser, getUserByUID, userIsEnabled };