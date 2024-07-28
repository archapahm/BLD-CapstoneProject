import Link from "next/link";
import Typography from "@mui/material/Typography";

export default function MenuAppBar() {
    function Copyright(props) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ marginTop: 8 }} {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://blacklabeldesigns.net/">
                    BLD
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    return (
        <>
            <Copyright />
        </>
    );
}