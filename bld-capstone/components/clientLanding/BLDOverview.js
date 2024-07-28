import { useEffect, useState } from "react";
import { Typography, Paper, Collapse, Button } from "@mui/material";
import PushPinIcon from '@mui/icons-material/PushPin';
import { useTheme } from "@mui/material";
import React from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';

export default function BLDOverview(overviewText) {
    const [open, setOpen] = React.useState(false);
    const [fullText, setFullText] = React.useState("");
    const theme = useTheme();

    useEffect(() => {
        if (overviewText) {
            console.log(overviewText);
            setFullText(overviewText.overviewText);
        }
    }, [overviewText]);

    return (
        <div>
            {/* Overview */}
            <Box sx={{ display: 'flex' }}>
                <Button
                    onClick={() => setOpen(!open)}
                    sx={{ p: 1 }}
                >
                    <PushPinIcon sx={{ mr: 2 }} />
                    <Typography sx={{ color: theme.palette.text.secondary, alignSelf: 'flex-end' }}>Overview</Typography>
                    {open ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />}
                </Button>
            </Box>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Paper sx={{ padding: 2, display: "flex" }}>
                    <Typography>
                        {fullText}
                    </Typography>
                </Paper>
            </Collapse>
        </div>
    )
}
