import { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Layout from "../../../layout";
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

import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { fetchPhaseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const Page = () => {
    const router = useRouter();
    const phaseId = router.query.id;
    const [phase, setPhase] = useState({});
    const [sequence, setSequence] = useState('');
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleEdit = async (e) => {
        e.preventDefault();
        
        if(!sequence || !code || !title || !description) {
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: "All fields are required.",
                showConfirmButton: true,
            });
        }

        const editPhase = {
            sequence,
            code,
            title,
            description,
            updated: Timestamp.fromDate(new Date(Date.now()))
        }

        try {
            const phaseRef = doc(db, 'phases', phaseId);
            await updateDoc(phaseRef, {
                ...editPhase
            });
        } catch (error) {
            console.log(error);
        }

        router.push('/dashboard/phases');

        Swal.fire({
            icon: "success",
            title: "Updated!",
            text: `${title} phase has been updated.`,
            showConfirmButton: false,
            timer: 1500,
        })
    }

    useEffect(() => {
        Promise.resolve(fetchPhaseById(phaseId)).then((value) => {
            setPhase(value);
        });
    },[])

    useEffect(() => {
        setSequence(phase.sequence);
        setCode(phase.code);
        setTitle(phase.title);
        setDescription(phase.description);
    },[phase])

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
                    Edit Phase
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
                                    Edit Phase
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack spacing={2}
                        sx={{mt: 3}}
                    >
                        <TextField 
                            label="Sequence"
                            value={sequence}
                            onChange={e => setSequence(e.target.value)}
                            autoFocus
                            InputLabelProps={{ shrink: true}}
                        />
                        <TextField 
                            label="Code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            InputLabelProps={{ shrink: true}}
                        />
                        <TextField 
                            label="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            InputLabelProps={{ shrink: true}}
                        />
                        <TextField 
                            label="Description"
                            multiline
                            maxRows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            InputLabelProps={{ shrink: true}}
                        />

                        <div>
                            <Button
                                variant="contained"
                                onClick={handleEdit}
                            >
                                Edit Phase
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