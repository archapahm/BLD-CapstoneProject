// Import React hooks and components
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Typography, Paper, Box, TextField, Button, Collapse } from "@mui/material";
import { ConnectWithoutContact } from "@mui/icons-material";
import { useAuthContext } from "@/hooks/useAuthContext";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


// Define component
export default function BLDContact() {
    const [open, setOpen] = useState(false); // State to control button disabled state
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

    const theme = useTheme();

    // Getting user and authIsReady from the authentication context
    const { user, authIsReady } = useAuthContext();

    useEffect(() => {
        if (isFormVisible) {
            document.getElementById("contact-form").scrollIntoView({ behavior: "smooth" });
        }
    }, [isFormVisible]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Generate timestamp for form submission
            const timestamp = new Date();

            // Replace "collection(db, "contactFormResponses")" with the reference to your existing collection
            const existingCollectionRef = collection(db, "users", user.uid, "contactFormResponses");

            const docRef = await addDoc(existingCollectionRef, {
                subject,
                message,
                timestamp,
                read: false,
            });
            console.log("Document written with ID: ", docRef.id);

            setSubject("");
            setMessage("");
            setIsFormVisible(false); // Hide the form after submission
            setIsButtonDisabled(true); // Disable the button after submission
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    return (
        <>
            {/* Contact Page */}
            <Box sx={{ display: 'flex' }}>
                <Button
                    onClick={() => setOpen(!open)}
                    sx={{ p: 1 }}
                >
                    <ConnectWithoutContact sx={{ mr: 2 }} />
                    <Typography sx={{ color: theme.palette.text.secondary, alignSelf: 'flex-end' }}>Contact Us</Typography>
                    {open ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />}
                </Button>
            </Box>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Paper sx={{ padding: 2, display: "flex" }}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Phone: (555) 555-5555</Typography>
                        <Typography variant="subtitle2">Email: contact@blacklabeldesigns.net</Typography>

                        {/* Add a collapse component to hide the form */}
                        <form onSubmit={handleSubmit} id='contact-form'>
                            <TextField
                                label="Subject"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                            <TextField
                                label="Message"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Paper>
            </Collapse>
        </>
    );
}