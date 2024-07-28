import { collection, onSnapshot, orderBy, query, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './config';

const getProjectPhases = (collectionName = 'projectPhases', projectId, phaseId, version) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, data: doc.data() });
        });
        setDocuments(docs);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { documents };
};

export default getProjectPhases;
