import { useState, useEffect, Component } from 'react'
import React from 'react'
import { Button, Box, FormControl, TextField, Grid, RadioGroup, Radio, FormControlLabel, Select, InputLabel, MenuItem, Typography, Alert, AlertTitle } from '@mui/material'
import { createProject, getClients } from '@/utils/queries'

export default function CreateProjectForm({user, openForm}){
    const [userId, setUserId] = useState(user.uid)
    const [street, setStreet] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')
    const [clientName, setClientName] = useState('')
    const [clientId, setClientId] = useState('')
    const [clients, setClients] = useState([])
    const [street2, setStreet2] = useState('')
    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        getClients().then((clients) => {
            setClients(clients);
        });
    }, []);   

    useEffect(() => {
        if (clientId) {
            const selectedClient = clients.find((client) => client.id === clientId);
            setClientName(selectedClient.name);
        }
    }, [clientId, clients]);

    const handleSubmit = async (event) => {
        event.preventDefault()
        // sets the values in the database
        try{
            await createProject(projectName, projectDescription, userId, street, street2, postalCode, city, province, country, clientId, clientName)
            setProjectName('')
            setProjectDescription('')
            setStreet('')
            setStreet2('')
            setPostalCode('')
            setCity('')
            setProvince('')
            setCountry('')
            setErrorMessage('')
            openForm()
        }
        catch(error){
            setErrorMessage(error.message);
        }               
    }

    // List of provinces for Canada
    const canadaProvinces = [
        'Alberta',
        'British Columbia',
        'Manitoba',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Northwest Territories',
        'Nova Scotia',
        'Nunavut',
        'Ontario',
        'Prince Edward Island',
        'Quebec',
        'Saskatchewan',
        'Yukon'
    ];

    // List of states for USA
    const usaStates = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ];

    return <>
        <Typography variant="h4" align="center">
            Create New Project
        </Typography>
        {errorMessage && 
            <Alert severity="error" sx={{marginTop:1}}>
                <AlertTitle>Creation Failed</AlertTitle>
                {errorMessage}
            </Alert>
        }
        <form onSubmit={handleSubmit} >
            <Box sx={{marginTop: 2}}>
                <FormControl fullWidth>
                    <TextField
                        required id='projectName'
                        value={projectName}
                        label='Project Name'
                        onChange={(event) => setProjectName(event.target.value)}
                        sx={{width: '100%'}}
                    />
                </FormControl>
            </Box>
            <Box sx={{marginY: 1}}>
                <FormControl fullWidth>
                    <TextField
                        required id="projectDescription"
                        value={projectDescription}
                        label='Project Description'
                        onChange={(event) => setProjectDescription(event.target.value)}
                        sx={{width: '100%'}}
                    />
                </FormControl>
            </Box>
            <Box sx={{marginY: 1}}>
                <FormControl fullWidth>
                    <TextField
                        required id="street"
                        value={street}
                        label='Street'
                        onChange={(event) => setStreet(event.target.value)}
                        sx={{width: '100%'}}
                    />
                </FormControl>
            </Box>
            <Box sx={{marginY: 1}}>
                <FormControl fullWidth>
                    <TextField
                        id="street2"
                        value={street2}
                        label='Street Line 2 (Optional)'
                        onChange={(event) => setStreet2(event.target.value)}
                        sx={{width: '100%'}}
                    />
                </FormControl>
            </Box>
            <Grid container justifyContent="space-between" columns={2} columnGap={2} sx={{flexWrap: 'nowrap'}} >
                <Grid item sx={{width: '100%'}}>
                    <Box>
                        <FormControl sx={{width: '100%'}}>
                            <TextField
                                required id="postalCode"
                                value={postalCode}
                                label='Postal Code (do not include spaces or hyphens)'
                                onChange={(event) => setPostalCode(event.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item sx={{width: '100%'}}>
                    <Box>
                        <FormControl sx={{width: '100%'}} >
                            <TextField
                                required id="city"
                                value={city}
                                label='City'
                                onChange={(event) => setCity(event.target.value)}                                                
                            />
                        </FormControl>
                    </Box>
                </Grid>
            </Grid>                            
            <Grid container columns={3}>
                <Grid item xs={1}>
                    <Box >
                        <FormControl>
                            <RadioGroup
                                row
                                aria-label="country"
                                name="country"
                                sx={{marginY: 1}}
                                value={country}
                                onChange={(event) => setCountry(event.target.value)}
                            >
                                <FormControlLabel value="Canada" control={<Radio />} label="Canada" />
                                <FormControlLabel value="USA" control={<Radio />} label="USA" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{marginY: 1}}>
                        <FormControl sx={{width: '100%'}}>
                            <InputLabel id="province-label">Province/State (Select Country First)</InputLabel>
                            <Select
                                labelId="province-label"
                                label="Province/State"
                                id="province"
                                value={province}
                                onChange={(event) => setProvince(event.target.value)}
                                required
                                disabled={!country}
                            >
                                {country === 'Canada' && canadaProvinces.map((province) => (
                                    <MenuItem key={province} value={province}>
                                        {province}
                                    </MenuItem>
                                ))}
                                {country === 'USA' && usaStates.map((state) => (
                                    <MenuItem key={state} value={state}>
                                        {state}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="client-label">Client</InputLabel>
                    <Select
                        labelId="client-label"
                        label="Client"
                        id="client"
                        value={clientId}
                        onChange={(event) => setClientId(event.target.value)}
                        required
                    >
                        {clients.map((client) => (
                            <MenuItem key={client.id} value={client.id}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button type='submit' variant='contained' sx={{marginY:1}}>
                    Submit New Project
                </Button>
            </Box>
        </form>
    </>
}