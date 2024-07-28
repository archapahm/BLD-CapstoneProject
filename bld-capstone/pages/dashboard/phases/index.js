import React, { useEffect } from 'react';
import { useCallback, useState } from 'react';
import Layout from '../layout';

import { useRouter } from "next/router";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { PhasesTable } from '@/sections/phases/phases-table';

// Firebase
import { db } from '@/firebase/config';
import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';

// Mock data
import { PHASES_DATA } from '@/_mock';

// Seed phases document
function seedPhaseData() {
  PHASES_DATA.forEach(async event => {
    const {id, ...rest} = event;
    await setDoc(doc(db, 'phases', id), {
      ...rest
    })
  })
}

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },[]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },[]
  );

  useEffect(() => {
    const fetchPhases = async() => {
      const q = query(collection(db, "phases"), orderBy("sequence"));

      try {
        const snapshot = await getDocs(q);
        const fetchedPhases = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setData(fetchedPhases);
      } catch (error) {
        console.error("Error fetching phases: ", error);
      }
    }

    fetchPhases();
  },[]);

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
              <Typography>
                Phases
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
                      Phases
                    </Typography>
                  </Stack>
                  <div>
                    <Button
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <PlusIcon />
                        </SvgIcon>
                      )}
                      variant="contained"
                      onClick={() => router.push('/dashboard/phases/create')}
                    >
                      Create Phase
                    </Button>

                    {/* <Button
                      sx={{ml: 2}}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <PlusIcon />
                        </SvgIcon>
                      )}
                      variant="contained"
                      onClick={seedPhaseData}
                    >
                      Seed Phase
                    </Button> */}
                  </div>
                </Stack>
            {/* <CustomersSearch /> */}
            <PhasesTable
              count={data.length}
              items={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              setItems={setData}
            />
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