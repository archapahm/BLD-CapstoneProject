import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './config';

const addProjectPhases = (collectionName, projectId, phaseId, version, documentObj, id) => {
  // const docRef = doc(collection(db, collectionName, projectId, 'phases', phaseId, 'versions', version, 'files'), id);

  return setDoc(doc(db, collectionName, projectId), {
    projectId: projectId
  }).then(() => {
    setDoc(doc(db, collectionName, projectId, 'phases', phaseId), {
      phaseId: phaseId
    }).then(() => {
      setDoc(doc(db, collectionName, projectId, 'phases', phaseId, 'versions', version), {
        version: version
      }).then(() => {
        setDoc(doc(db, collectionName, projectId, 'phases', phaseId, 'versions', version, 'files', id), {
          ...documentObj,
          timestamp: serverTimestamp(),
        }, {merge: true})
      })
    })
  })
};

export default addProjectPhases;
