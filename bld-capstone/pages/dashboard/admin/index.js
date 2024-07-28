import React from 'react';
import Layout from '../layout';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';
import AdminPage from '@/components/admin/admin';

const Page = () => {
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
                    href="/dashboard/admin"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Administration Panel
                </Link>
            </Breadcrumbs>
            <AdminPage />
        </>
    )
}

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  
  export default Page;