import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

// Firebase
import { db } from '@/firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import Swal from 'sweetalert2';

import { useRouter } from "next/router";

const DeleteRowModal = ({ isOpen, onClose, onDelete }) => {
  const handleConfirmDelete = () => {
    // Call the onDelete function to delete the row
    onDelete();
    // Close the modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Row</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this row?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const PhasesTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    setItems
  } = props;

  const router = useRouter();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState("");

  const handleEditClick = (id) => {
    router.push(`/dashboard/phases/${id}/edit`)
  }

  const handleDeleteClick = (id) => {
    console.log(`HandleDeleteClick: ${id}`)
    // Set the modal to open when the user clicks delete
    setDeleteModalOpen(true);
    setToDeleteId(id)
  };

  const handleDelete = () => {
    // Perform the delete operation here
    deletePhase(toDeleteId);
    // Close the modal after deletion
    setDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    // Close the modal if the user cancels
    setDeleteModalOpen(false);
  };

  const deletePhase = async(id) => {
    console.log(id);
    await deleteDoc(doc(db, "phases", id));

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: `Phase has been deleted.`,
      showConfirmButton: false,
      timer: 1500,
    });

    const itemsCopy = items.filter(item => item.id !== id);
    setItems(itemsCopy);
  }

  return (
    <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Sequence
                </TableCell>
                <TableCell>
                  Code
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((phase) => {
                return (
                  <TableRow
                    hover
                    key={phase.id}
                  >
                    <TableCell>
                      {phase.sequence}
                    </TableCell>
                    <TableCell>
                      {phase.code}
                    </TableCell>
                    <TableCell>
                      {phase.title}
                    </TableCell>
                    <TableCell>
                      {phase.description}
                    </TableCell>
                    <TableCell>
                        <Box sx={{display: 'flex'}}>
                          <IconButton
                            onClick={() => handleEditClick(phase.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(phase.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <DeleteRowModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDelete} />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 30]}
      />
    </Card>
  );
};

PhasesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  setItems: PropTypes.func
};
