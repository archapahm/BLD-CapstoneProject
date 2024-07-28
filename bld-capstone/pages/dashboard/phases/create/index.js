import { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Layout from "../../layout";
import Link from "next/link";
import { 
    Box, 
    Button, 
    Container, 
    Paper, 
    Stack, 
    SvgIcon,
    TextField, 
    Typography
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';


import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';

// Firebase
import { db } from '@/firebase/config';
import { Timestamp, addDoc, collection } from 'firebase/firestore';

let idCounter = 0;
const createRandomRow = () => {
    idCounter += 1;
    return { id: idCounter, subphase: `Test ${idCounter}` };
};

const initialRows = [
    createRandomRow(),
    createRandomRow()
];

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = idCounter += 1;
        setRows((oldRows) => [...oldRows, { id, subphase: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'subphase' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}


const Page = () => {
    const router = useRouter();
    const [sequence, setSequence] = useState('');
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
 
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'subphase', 
            headerName: "Subphase",
            width: 500,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      
              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{
                      color: 'primary.main',
                    }}
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              }
      
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
    ];

    const handleAdd = async (e) => {
        e.preventDefault();
        
        if(!sequence || !code || !title || !description) {
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: "All fields are required.",
                showConfirmButton: true,
            });
        }

        const newPhases = {
            sequence,
            code,
            title,
            description,
            created: Timestamp.fromDate(new Date(Date.now())),
            updated: ""
        }

        try {
            await addDoc(collection(db, 'phases'), {
                ...newPhases
            });
        } catch (error) {
            console.log(error);
        }

        router.push('/dashboard/phases');

        Swal.fire({
            icon: "success",
            title: "Added!",
            text: `${title} phase has been added.`,
            showConfirmButton: false,
            timer: 1500,
        })
    }

    return (
        <>
            <Breadcrumbs 
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
            >
                <Link 
                    underline="hover" 
                    color="inherit" 
                    href="/dashboard"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/dashboard/phases"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Phases
                </Link>
                <Typography>
                    Create Phase
                </Typography>
            </Breadcrumbs>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Create Phase
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack spacing={2}
                        sx={{mt: 3}}
                    >
                        <TextField 
                            required
                            label="Sequence"
                            value={sequence}
                            onChange={e => setSequence(e.target.value)}
                            autoFocus
                        />
                        <TextField 
                            required
                            label="Code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                        />
                        <TextField 
                            required
                            label="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <TextField 
                            label="Description"
                            multiline
                            maxRows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        {/* <Box
                            sx={{
                                height: 500,
                                width: '100%',
                                '& .actions': {
                                color: 'text.secondary',
                                },
                                '& .textPrimary': {
                                color: 'text.primary',
                                },
                            }}
                            >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                editMode='row'
                                rowModesModel={rowModesModel}
                                onRowModesModelChange={handleRowModesModelChange}
                                onRowEditStop={handleRowEditStop}
                                processRowUpdate={processRowUpdate}
                                slots={{
                                    toolbar: EditToolbar,
                                }}
                                slotProps={{
                                    toolbar: { setRows, setRowModesModel },
                                }}
                                initialState={{
                                    // ...data.initialState,
                                    pagination: {paginationModel: { pageSize: 5 }},
                                }}
                                pageSizeOptions={[5,10,15]}
                            />
                        </Box> */}

                        <div>
                            <Button
                                variant="contained"
                                onClick={handleAdd}
                            >
                                Create
                            </Button>
                            <Button
                                sx={{ml: 1}}
                                variant="contained"
                                onClick={() => router.push('/dashboard/phases')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  
  export default Page;