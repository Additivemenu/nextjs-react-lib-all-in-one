"use client";

import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const BasicModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Style object for the modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained">
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            This is a simple Material UI modal. You can put any content here.
          </Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose} variant="contained">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
