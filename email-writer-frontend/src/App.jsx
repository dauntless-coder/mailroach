import { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Box, Container, Typography, TextField } from '@mui/material'
import { Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      if (response.status !== 200) {
        throw new Error('Failed to generate reply');
    }
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      // Optionally handle error here
      setGeneratedReply('Error generating reply.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom
      sx={{
          fontWeight: 'bold',
          letterSpacing: 2,
          color: '#111',
          textShadow: '2px 2px 8px #bdbdbd',
          display: 'flex',
          alignItems: 'center',
        }}
        
      >
      
       mailroach
      </Typography>
      <Box sx={{ mx: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

                  <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id>Tone(Optional)</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tone || ''}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)} 
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
              <MenuItem value="Concise">Concise</MenuItem>

              
            </Select>
          </FormControl>

            
            <Button variant="contained"
            sx={{ mb: 2 }}
            onClick ={handleSubmit}
            disabled = {!emailContent || loading}>
            {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
            </Button>

      </Box>
  

      <Box sx={{ mt: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
       
          value={generatedReply || ''}
          inputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

     <Button
    variant="outlined"
    onClick={() => navigator.clipboard.write(generatedReply)}>
Copy to Clipboard
  </Button>
  </Box>


    </Container>
  )
}

export default App