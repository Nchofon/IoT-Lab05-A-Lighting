const express = require('express');
const { spawn } = require('child_process');

const pythonScriptPath = 'src/Lab05a_IoT.py'; // Path to your Python script
const roomRoutes = require('./routes/roomRoutes.js');
const pythonProcess = spawn('python', [pythonScriptPath]); // Spawn a new Python process
//const pool = require('./db')
//const {startLogging} = require('./plugins/sensorPlugins.js');


// Capture any errors from the Python script (stderr)
pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data.toString()}`);
});

// Handle when the Python script exits
pythonProcess.on('close', (code) => {
    console.log(`Python script finished with exit code ${code}`);
});


const app = express();
app.use(express.json());

// Default landing page route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Home Automation API</h1><p>Use <b>/path-to-resource</b> to interact with room sensors and actuators.</p>');
});

// API routes for rooms
app.use("/room", roomRoutes);


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
