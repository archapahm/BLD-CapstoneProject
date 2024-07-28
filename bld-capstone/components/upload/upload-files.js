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
import { collection, getDocs, query } from "firebase/firestore";

// User-defined imports
import Upload from "./upload";
import ProgressListPhase from "./progress-list-phase";
import ImagesListPhase from "./images-list-phase";

const filter = createFilterOptions();

export default function UploadFiles({id, phaseId}) {
  const [files, setFiles] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [version, setVersion] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id || !phaseId) return;

    // Fetch the list of versions from Firebase Storage
    const fetchVersionList = async () => {

        const q = query(collection(db, `projectPhase/${id}/phases/${phaseId}/versions`));

        try {
          const snapshot = await getDocs(q);

          const fetchedVersion = snapshot.docs.map((doc, index) => ({
            id: index,
            version: doc.id
          }));

          setVersionList(fetchedVersion);
        } catch (error) {
          console.error("Error fetching project: ", error);
        }
    };

    fetchVersionList();
    setProjectId(id);
  }, []);

  useEffect(() => {
    if (!id) return;

    setProjectId(id);
  },[projectId])

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
      <Container>
        <Stack>
          <Card>
            <CardContent sx={{ display: "flex" }}>

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
            {selectedVersion &&
              <CardContent>
                  <ProgressListPhase
                      files={files}
                      projectId={projectId}
                      phaseId={phaseId}
                      version={version} />
                  <ImagesListPhase
                      projectId={projectId}
                      phaseId={phaseId}
                      version={version} />
              </CardContent>
            }
          </Card>
        </Stack>
      </Container>
      {/* <Dialog
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
      </Dialog> */}
    </>
  );
}
