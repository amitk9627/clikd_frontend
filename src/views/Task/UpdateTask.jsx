import React, { useState } from 'react';

import { Box, TextField, Button } from '@mui/material';
import { BackendUrl } from 'utils/config';
import axios from 'axios';
const UpdateTask = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleUpdate = () => {
    if (!formData.title) {
      alert('title is missing');
      return;
    }
    if (!formData.date) {
      alert('date is missing');
      return;
    }
    if (!formData.description) {
      alert('desciption is missing');
      return;
    }

    axios
      .put(`${BackendUrl}/tasks`, { title: formData.title, description: formData.description, dueDate: String(formData.date) })
      .then((res) => {
        console.log(res.data);
        onClose();
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <Box>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          margin: '0 auto'
        }}
      >
        <TextField label="Title" variant="outlined" name="title" value={formData.title} onChange={handleChange} fullWidth />

        <TextField
          label="Date"
          variant="outlined"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
        />

        <TextField
          label="Description"
          variant="outlined"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateTask;
