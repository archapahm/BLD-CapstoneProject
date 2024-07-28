import React, { useState, useEffect } from 'react';
import { disableUser, enableUser, getUsers, updateUserRole } from '@/utils/queries';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { TableContainer, Typography, Table, TableHead, TableRow, Button, Checkbox, TableCell, LinearProgress, Alert, TableBody, Paper, Grid, TextField, FormControl, Select, MenuItem, FormHelperText, Tab, TablePagination } from '@mui/material';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showDisablePopup, setShowDisablePopup] = useState(false);
    const [userToDisable, setUserToDisable] = useState(null);
    const [changedUserIds, setChangedUserIds] = useState([]);

    // handles search input
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // handles sort order category (name, internal)
    const handleOrderBy = (event) => {
        setOrderBy(event.target.value);
    };

    // handles sort order type (asc, desc)
    const handleOrder = (event) => {
        setOrder(event.target.value);
    };

    // dismisses error message
    const handleDismissError = () => {
        setError(null);
    };

    // gets users from database
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, []);

    // updates the state of the users role when a checkbox is clicked
    const handleCheckboxChange = (userId, field) => {
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
                if (user.id === userId) {
                    return { ...user, [field]: !user[field] };
                }
                return user;
            });
            setHasChanges(true);
            if (!changedUserIds.includes(userId)) {
                setChangedUserIds(prevIds => [...prevIds, userId]);
            }
            return updatedUsers;
        });
    };

    

    // pushes user role changes to the database
    const handleConfirmChanges = async (userId) => {        
        try {
            await updateUserRole(userId, users.find(user => user.id === userId).admin, users.find(user => user.id === userId).internal);
            setSuccessMessage('User updated successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
            setChangedUserIds(prevIds => prevIds.filter(id => id !== userId));
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // toggles if a user is enabled or disabled 
    const handleDisableUser = async (userId) => {
        setUserToDisable(users.find(user => user.id === userId).name);
        if (users.find(user => user.id === userId).admin) {
            setError('Cannot disable an admin');
        } else if (users.find(user => user.id === userId).internal) {
            setError('Cannot disable an internal user');
        } else {
            setShowDisablePopup(true);
        }
    };

    // enables a user
    const handleEnableUser = async (userId) => {
        try {
            await enableUser(userId);
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => {
                    if (user.id === userId) {
                        return { ...user, enabled: true };
                    }
                    return user;
                });
                return updatedUsers;
            });
            setSuccessMessage('User enabled successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setError('Error enabling user:', error);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleConfirmDisable = async () => {
        const userId = users.find(user => user.name === userToDisable).id;
        setUserToDisable(users.find(user => user.id === userId).name);
        try {
            await disableUser(userId);
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => {
                    if (user.id === userId) {
                        return { ...user, enabled: false };
                    }
                    return user;
                });
                return updatedUsers;
            });
            setSuccessMessage('User disabled successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setError('Error disabling user:', error);
            setTimeout(() => setError(null), 3000);
        }
        setShowDisablePopup(false);
    };

    const filteredUsers = users.filter(user => {
        return user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // sorts users by name or internal
    const sortedUsers = filteredUsers.sort((a, b) => {
        let result = 0;
        if (orderBy === 'name') {
            result = a.name.localeCompare(b.name);
        } else if (orderBy === 'internal') {
            if (a.internal && !b.internal) {
                result = -1;
            } else if (!a.internal && b.internal) {
                result = 1;
            } else {
                result = a.name.localeCompare(b.name);
            }
        } 
        return order === 'asc' ? result : -result;
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedUsers.length - page * rowsPerPage);

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            <Typography variant="h4" marginBottom={2} style={{ marginTop: '2rem' }}>Administration</Typography>
            <Typography variant="h6" marginBottom={2} style={{ marginTop: '2rem', marginBottom: "6px"}}>User Moderation</Typography>
            {error && (
            <Alert severity="error" onClose={handleDismissError}>
                {error}
            </Alert>
            )}
            {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                </Alert>
            )}

            <Grid container spacing={2} style={{marginBottom:0}} >
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        fullWidth
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <Select
                            value={orderBy}
                            onChange={handleOrderBy}
                            size='small'
                        >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="internal">Internal</MenuItem>
                        </Select>
                        <FormHelperText>Sort By</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <Select
                            value={order}
                            onChange={handleOrder}
                            size='small'
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                        <FormHelperText>Sort Order</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>

            <TableContainer component={Paper} style={{ marginTop: '6px' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#454545' }}>
                            <TableCell>Name</TableCell>
                            <TableCell>Internal</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : sortedUsers
                        ).map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={user.internal}
                                        onChange={() => handleCheckboxChange(user.id, 'internal')}
                                        disabled={!user.enabled}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={user.admin}
                                        onChange={() => handleCheckboxChange(user.id, 'admin')}
                                        disabled={!user.internal || !user.enabled}
                                    />
                                </TableCell>
                                <TableCell style={{ width: '25%' }}>
                                    {user.enabled ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                startIcon={<CheckIcon />}
                                                onClick={() => handleConfirmChanges(user.id)}
                                                style={{ marginRight: '8px' }}
                                                disabled={!changedUserIds.includes(user.id)}
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<ClearIcon />}
                                                color="error"
                                                onClick={() => handleDisableUser(user.id)}
                                            >
                                                Disable
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            startIcon={<CheckIcon />}
                                            color='success'
                                            onClick={() => handleEnableUser(user.id)}
                                        >
                                            Enable
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={4} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {showDisablePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <Typography variant='h6' gutterBottom>
                            Are you sure you want to disable {userToDisable}? (All access will be revoked)
                        </Typography>
                        <div className="popup-buttons">
                            <Button
                                variant="contained"
                                onClick={() => setShowDisablePopup(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirmDisable}
                            >
                                Disable
                            </Button>                        
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                }

                .popup-content {
                    background-color: #353535;
                    padding: 20px;
                    border-radius: 5px;
                    color: white; 
                    max-width: 400px; 
                    word-wrap: break-word;
                }

                .popup-buttons {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 10px;
                }
                .popup-buttons > Button {
                    width: 100px;
                }
            `}</style>
        </>
    );
}


