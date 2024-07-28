import React, { use, useEffect } from "react";
import { useState, useCallback } from "react";

// MUI imports
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Firebase imports
import { db } from "@/firebase/config";
import { collection, doc, getDoc, getDocs, query, docs } from "firebase/firestore";
import { storage } from "@/firebase/config";
import { getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage";

// User-defined imports
import Upload from "./upload";
import ProgressList from "./progress-list";
import ImagesList from "./images-list";

const filter = createFilterOptions();

export default function UploadMoodboards() {
  const [files, setFiles] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [version, setVersion] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch the project documents from Firestore
    const fetchProjectList = async () => {
      const projectRef = collection(db, "projects");

      try {
        const snapshot = await getDocs(projectRef);
        const fetchedProject = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            project: doc.data().projectName,
          }))
          .sort((a, b) => (a.project > b.project ? 1 : -1));
        setProjectList(fetchedProject);
      } catch (error) {
        console.error("Error fetching project: ", error);
      }
    };

    fetchProjectList();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    // Fetch the list of versions from Firebase Storage
    const fetchVersionList = async () => {
        const listRef = ref(storage, `moodboards/${selectedProject.id}`);

        listAll(listRef)
            .then((res) => {
                const fetchedVersion = res.prefixes.map((folderRef, index) => ({
                    id: index,
                    version: folderRef._location.path_.split('/')[2],
                }));
                setVersionList(fetchedVersion);
            }).catch((error) => {
                console.error(error);
            });
    };

    fetchVersionList();
    setProjectId(selectedProject.id);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedVersion) return;

    setVersion(selectedVersion.version);
  },[selectedVersion]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {

      // console.log(projectId, version);
      // if (!projectId || !version) {
      //     handleClickOpen();
      //     return;
      // }

      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

    return (
    <>
      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <Card>
            {/* <CardHeader
              title="Upload Moodboards"
            /> */}
            <CardContent sx={{ display: "flex" }}>
              <Autocomplete
                required
                disablePortal
                id="project-combo-box"
                options={projectList}
                getOptionLabel={(option) =>
                  option.project ? option.project : ""
                }
                value={selectedProject}
                onChange={(e, value) => {
                  if (value !== null) {
                    setSelectedProject(value);
                  }
                }}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => (
                  <TextField {...params} label="Project" />
                )}
              />
              {/* <TextField
                required
                id="outlined-required"
                label="Version"
                sx={{ width: 300 }}
                onChange={(e) => setVersion(e.target.value)} /> */}

              <Autocomplete
                  value={selectedVersion}
                  onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                          setSelectedVersion({
                              version: newValue,
                          });
                      } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          setSelectedVersion({
                              version: newValue.inputValue,
                          });
                      } else {
                          setSelectedVersion(newValue);
                      }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.version);
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            inputValue,
                            version: `Add "${inputValue}"`,
                        });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="version"
                  options={versionList}
                  getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                          return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                          return option.inputValue;
                      }
                      // Regular option
                      return option.version;
                  }}
                  renderOption={(props, option) => <li {...props}>{option.version}</li>}
                  sx={{ width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                      <TextField {...params} label="Version" />
                  )} />

            </CardContent>
            <CardContent>
              <Upload
                multiple
                files={files}
                onDrop={handleDropMultiFile}
              />
            </CardContent>
            {/* {(!selectedProject.id && !selectedVersion.version) && */}
                <CardContent>
                    <ProgressList
                        files={files}
                        projectId={projectId}
                        version={version} />
                    <ImagesList 
                        projectId={projectId}
                        version={version} />
                </CardContent>
            {/* } */}
          </Card>
        </Stack>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Upload Moodboards"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select a project and version.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
