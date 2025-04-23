import React, { useState } from 'react';

import { Box, TextField, Button } from '@mui/material';
import { BackendUrl } from 'utils/config';
import axios from 'axios';
const AddTask = ({ onClose, setRefreshPage, toast }) => {
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
  const handleSubmit = () => {
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
      .post(`${BackendUrl}/tasks`, { title: formData.title, description: formData.description, dueDate: String(formData.date) })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        setRefreshPage(true);
        onClose();
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message);
      });
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
          onClick={(e)=>e.target.showPicker()}
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
        <Button variant="contained" onClick={handleSubmit} className="bg-blue-500 text-white px-3 rounded-xl">
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

export default AddTask;
