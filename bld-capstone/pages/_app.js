import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LinearProgress, Typography } from '@mui/material';
import { AuthContextProvider } from "@/context/AuthContext";
import Head from 'next/head';
import { useEffect, useState } from 'react';

const mainTheme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: 'Anybody'
    }
});

export default function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page);
    const [isDesktopView, setIsDesktopView] = useState(null);

    // Check if the user is on a desktop view
    useEffect(() => {
        const handleResize = () => {
            setIsDesktopView(window.innerWidth >= 1160);
        };
        handleResize();
        // Add event listener to check if the user is on a desktop view
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    if(isDesktopView == null){
        return <>
            <ThemeProvider theme={mainTheme}>
                <CssBaseline />
                    <LinearProgress/> 
            </ThemeProvider>
        </>;
    }
    return (
        <>
            <Head>
                {/* Add any necessary meta tags or other head elements */}
            </Head>
            <ThemeProvider theme={mainTheme}>
                <CssBaseline />
                <AuthContextProvider>
                    {/** Check if the user is on a desktop view*/}
                    {!isDesktopView ? (
                        <Typography variant="h4" align="center" style={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Sorry, this page only supports desktop viewing</Typography>
                        
                    ) : (
                        getLayout(<Component {...pageProps} />)
                    )}
                </AuthContextProvider>
            </ThemeProvider>
        </>
    );
}