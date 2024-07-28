import React from 'react';
import Layout from '../layout';
import EmployeeLanding from "@/components/EmployeeLanding";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';

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
                    href="/dashboard/projects"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Projects
                </Link>
            </Breadcrumbs>
            <EmployeeLanding />
        </>
    )
}

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  
  export default Page;