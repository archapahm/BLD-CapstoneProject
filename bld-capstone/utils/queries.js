import { db, storage } from "@/firebase/config";
import { doc, getDoc, collection, setDoc, runTransaction, getFirestore, getDocs, query, where } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from "firebase/app";

export async function userIsInternal(user) {
    // queries the database with the users uid to see if they are internal
    const docRef = doc(db, "users", user.uid)
    const res = await getDoc(docRef)
    //return true if internal, false if not (maybe there is a way to shorten this path)
    if (res.exists()) {
        return res._document.data.value.mapValue.fields.internal.booleanValue
    }
    else {
        return false
    }
}

export async function getClients() {
    const clientsRef = collection(db, "users");
    const q = query(clientsRef, where("internal", "==", false));
    const querySnapshot = await getDocs(q);
    const clients = [];
    querySnapshot.forEach((doc) => {
        clients.push({ id: doc.id, ...doc.data() });
    });
    return clients;
}

export async function getProjects() {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(projectsRef);
    const projects = [];
    querySnapshot.forEach(doc => {
        projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
}

export async function createProject(projectName, projectDescription, userId, street, street2, postalCode, city, province, country, clientId, clientName) {
    const projectsRef = collection(db, "projects");

    // Check if a project with the same name or address already exists
    const querySnapshot = await getDocs(projectsRef);
    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.projectName.toLowerCase() === projectName.toLowerCase()) {
            throw new Error("A project with the same name already exists.");
        }
    });

    if (country.toLowerCase() === "canada" && !/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(postalCode.replace(/[-\s]/g, ''))) {
        throw new Error("Incorrect postal code format for Canada.");
    } else if (country.toLowerCase() === "usa" && !/^\d{5}(?:[-\s]\d{4})?$/.test(postalCode)) {
        throw new Error("Incorrect postal code format for USA.");
    }


    // Create the new project
    await setDoc(doc(projectsRef), {
        createdBy: userId,
        projectDescription: projectDescription,
        projectName: projectName,
        client: clientName,
        clientId: clientId,
        phases: [
            { id: 1, name: "Concept Development", enabled: true },
            { id: 2, name: "Site Analysis and Planning", enabled: true },
            { id: 3, name: "Floor Plans", enabled: true },
            { id: 4, name: "Interior Design", enabled: true },
            { id: 5, name: "Construction and 3D Documents", enabled: true },
            { id: 6, name: "Furnishing and Decor", enabled: true },
            { id: 7, name: "Construction Administration", enabled: true },
            { id: 8, name: "Construction Management", enabled: true }
        ],
        currentPhase: 1,
        address: {
            street: street,
            ...(street2 && { street2: street2 }),
            postalCode: postalCode,
            city: city,
            province: province,
            country: country
        }
    });
}

export async function togglePhase(projectId, phaseId) {
    const projectsRef = collection(db, "projects");
    const projectDocRef = doc(projectsRef, projectId);

    const projectSnapshot = await getDoc(projectDocRef);
    const phases = projectSnapshot.data().phases;

    const updatedPhases = phases.map(phase => {
        if (phase.id === phaseId) {
            return {
                ...phase,
                enabled: !phase.enabled
            };
        }
        return phase;
    });
    await setDoc(projectDocRef, { phases: updatedPhases }, { merge: true });
}


export async function addFeedback(selectedProject, selectedProjectPhase, selectedProjectVersion, selectedProjectImage, email, feedback) {
    const projectRef = collection(db, "projectPhase");
    const projectDocRef = doc(
        projectRef,
        selectedProject,
        "phases",
        selectedProjectPhase,
        "versions",
        selectedProjectVersion,
        "files",
        selectedProjectImage
    );

    try {
        await setDoc(projectDocRef, {
            email: email,
            comment: feedback,
        }, { merge: true });

        return 'Feedback added successfully';
    } catch (error) {
        return `Error adding feedback to the image: ${error.message}`;
    }
}

export async function getFeedback(selectedProject, selectedProjectPhase, selectedProjectVersion, selectedProjectImage) {
    const projectRef = collection(db, "projectPhase");
    const projectDocRef = doc(
        projectRef,
        selectedProject,
        "phases",
        selectedProjectPhase,
        "versions",
        selectedProjectVersion,
        "files",
        selectedProjectImage
    );

    try {
        const feedbackDoc = await getDoc(projectDocRef);

        if (feedbackDoc.exists()) {
            const { email, comment } = feedbackDoc.data();
            return { email, comment };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        throw new Error(`Error retrieving feedback: ${error.message}`);
    }
}


export async function updateProjectDescription(projectId, newDescription) {
    const projectsRef = collection(db, "projects");
    const projectDocRef = doc(projectsRef, projectId);

    if (newDescription.trim() === "") {
        throw new Error("Description cannot be blank.");
    }

    const projectSnapshot = await getDoc(projectDocRef);
    const existingDescription = projectSnapshot.data().projectDescription;

    if (newDescription === existingDescription) {
        throw new Error("New description is the same as the existing description.");
    }

    await setDoc(projectDocRef, { projectDescription: newDescription }, { merge: true });

    return "Project description updated successfully";
}

export async function updateProjectPhase(projectId, newPhase) {
    const projectsRef = collection(db, "projects");
    const projectDocRef = doc(projectsRef, projectId);

    const projectSnapshot = await getDoc(projectDocRef);
    const currentPhase = projectSnapshot.data().currentPhase;

    if (currentPhase === newPhase) {
        throw new Error("New phase is the same as the current phase.");
    }

    await setDoc(projectDocRef, { currentPhase: newPhase }, { merge: true });

    return "Project phase updated successfully";
}

export async function getMoodBoards(projectId) {
    let moodboards = [];

    // Look for the specified project in the database
    const initList = await listAll(ref(storage, `projectPhase/${projectId}`));

    // loop through the phases of the project
    for (const version of initList.prefixes) {
        const versionList = await listAll(ref(storage, `projectPhase/${projectId}/${version.name}`));
        console.log('[FETCH] version => ', version);
        let documents = [];

        // loop through the versions of the phase
        for (const document of versionList.prefixes) {
            const fileList = await listAll(ref(storage, `projectPhase/${projectId}/${version.name}/${document.name}`));

            // loop through the files of the version
            let filePromises = fileList.items.map(async (file) => {
                let imageProperties = await (await getDoc(doc(db, `projectPhase/${projectId}/phases/${version.name}/versions/${document.name}/files/`, file.name))).data();
                return { id: file.name, downloadURL: imageProperties.imageURL, imageAcceptState: imageProperties.imageAcceptState };
            });

            let files = await Promise.all(filePromises);
            documents.push({ version: document.name, files });
        }
        const phaseLibrary = await getAllPhases();
        const phaseName = phaseLibrary.filter(phase => phase.id === version.name)[0].title;
        moodboards.push({ projectId: projectId, phaseName: phaseName, phaseId: version.name, versions: documents });
    }

    return moodboards;
}


export async function getProjectsByID(userID) {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(projectsRef);
    const projects = [];
    querySnapshot.forEach(doc => {
        projects.push({ id: doc.id, ...doc.data() });
    });
    return projects.filter(project => project.clientId === userID);
}

export async function getProjectByProjectID(projectID) {
    if (!projectID) {
        throw new Error('Invalid projectID provided');
    }
    const projectRef = doc(db, "projects", projectID);
    const projectSnapshot = await getDoc(projectRef);
    if (projectSnapshot.exists() === false) {
        throw new Error("Project does not exist.");
    }

    return { id: projectSnapshot.id, ...projectSnapshot.data() };
}

export async function getProjectPhases(projectID) {
    const phaseList = [];
    if (typeof projectID !== 'string') {
        console.error('[ERROR] projectID must be a string');
        return phaseList;
    }
    const querySnapshot = await getDocs(collection(db, "projectPhase", projectID, "phases"));

    querySnapshot.forEach((doc) => {
        phaseList.push({ id: doc.id, ...doc.data() });
    });
    return phaseList;
}

export async function getAllPhases() {
    const phaseList = [];
    await getDocs(collection(db, "phases"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                phaseList.push({ id: doc.id, ...doc.data() });
            });
        });
    return phaseList;
}


export async function getTimes() {
    const timesRef = collection(db, 'projectTracker')
    const querySnapshot = await getDoc(timesRef)
    const times = []
    querySnapshot.forEach(doc => {
        times.push({ id: doc.id, ...doc.data(), collections: {} })
    })
    return times
}

export async function getUsers() {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
    });
    return users;
}

export async function updateUserRole(userId, newAdmin, newInternal) {
    const usersRef = collection(db, "users");
    const userDocRef = doc(usersRef, userId);

    const userSnapshot = await getDoc(userDocRef);
    const currentAdmin = userSnapshot.data().admin;
    const currentInternal = userSnapshot.data().internal;

    if (currentAdmin === newAdmin && currentInternal === newInternal) {
        throw new Error("No role changes were made.");
    }

    if (newAdmin && !newInternal) {
        throw new Error("User must be internal to be made an admin.");
    }

    await setDoc(userDocRef, { internal: newInternal, admin: newAdmin }, { merge: true });

    return "User role updated successfully";
}

export async function enableUser(userId) {
    const usersRef = collection(db, "users");
    const userDocRef = doc(usersRef, userId);

    await setDoc(userDocRef, { enabled: true }, { merge: true });
}

export async function disableUser(userId) {
    const usersRef = collection(db, "users");
    const userDocRef = doc(usersRef, userId);

    await setDoc(userDocRef, { enabled: false }, { merge: true });
}
