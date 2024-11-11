const { spawn } = require('child_process');

// Path to your Python script
const pythonScriptPath = 'Lab05a_IoT.py';

// Spawn a new Python process
const pythonProcess = spawn('python', [pythonScriptPath]);

// Capture the output from the Python script (stdout)
pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Python output: ${output}`);
    
    // Parse the JSON output
    try {
        const jsonOutput = JSON.parse(output);
        console.log('Parsed JSON:', jsonOutput);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});

// Capture any errors from the Python script (stderr)
pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data.toString()}`);
});

// Handle when the Python script exits
pythonProcess.on('close', (code) => {
    console.log(`Python script finished with exit code ${code}`);
});

