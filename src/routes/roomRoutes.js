const express = require('express');
const router = express.Router();
//const pool = require('../db');
const fs = require('fs').promises;  // Use fs.promises for async/await
const path = require('path');  // To handle file paths in a cross-platform way

router.get('/name/', async (req, res) => {
    try {
        // Define the path to the JSON file
        const filePath = path.join(__dirname, 'sensor_data.json');

        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract only the room names
        const roomNames = jsonData.map(room => room.room_name);

        // Return the array of room names as the response
        res.json(roomNames[0]);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }
});


router.get('/sensors/light', async (req, res) => {
    try {
        // Define the path to the JSON file
        const filePath = path.join(__dirname, 'sensor_data.json');

        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract only the room names
        const roomNames = jsonData.map(room => room.darkness_status);

        // Return the array of room names as the response
        res.json(roomNames[0]);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }
});

router.get('/sensors/pir', async (req, res) => {
    try {
        // Define the path to the JSON file
        const filePath = path.join(__dirname, 'sensor_data.json');

        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract only the room names
        const roomNames = jsonData.map(room => room.room_status);

        // Return the array of room names as the response
        res.json(roomNames[0]);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }
});

router.get('/actuators/secLED', async (req, res) => {
    try {
        // Define the path to the JSON file
        const filePath = path.join(__dirname, 'sensor_data.json');

        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract only the room names
        const roomNames = jsonData.map(room => room.sec_light_status);

        // Return the array of room names as the response
        res.json(roomNames[0]);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }
});

router.get('/actuators/roomLED', async (req, res) => {
    try {
        // Define the path to the JSON file
        const filePath = path.join(__dirname, 'sensor_data.json');

        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract only the room names
        const roomNames = jsonData.map(room => room.room_light_status);

        // Return the array of room names as the response
        res.json(roomNames[0]);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }
});



/*


// 2) Get all rooms: Retrieves a list of all rooms.
router.get('/rooms/', async (req,res) => {
    try {
        const result = await pool.query(`SELECT * FROM rooms`)
        res.json(result.rows)
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }

});


// 3) Get room by ID: Retrieves details of a room by its ID.
router.get('/rooms/:id', async (req, res) =>{
    try {
        const {id} = req.params
        const result = await pool.query(`SELECT * FROM rooms WHERE id = $1`, [id]);
        // const result = await pool.query(`SELECT * FROM rooms WHERE id = $1 $2`, [id, xf]);
        if (result.rows.length === 0) {
            return res.status(404).send('Room not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

})

// 4) Update light status: Updates the light status (on/off) of a room.
router.patch('/rooms/:id/light', async (req, res) =>{
    try {
        const {id} = req.params
        const result = await pool.query(`UPDATE rooms SET light = $1 WHERE id = $2 RETURNING *;`, [id]);
        // const result = await pool.query(`SELECT * FROM rooms WHERE id = $1 $2`, [id, xf]);
        if (result.rows.length === 0) {
            return res.status(404).send('Room not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

})

// 5) Delete a room: Deletes a room by its ID.
router.delete('/rooms/:id', async (req, res) =>{
    try {
        const {id} = req.params
        const result = await pool.query(`DELETE FROM rooms WHERE id = $1`, [id]);
        //const result = await pool.query(`DELETE * FROM rooms WHERE id = $1`, [id]);
        res.status(201).json({ message: 'Room deleted', data: result.rows[0] });
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

// 6) Turn on all lights: Turns on the lights in all rooms.
router.post('/rooms/lights/on', async (req, res) => {
    try {
        const result = await pool.query('UPDATE rooms SET light = TRUE');
        res.status(201).json({ message: 'All lights on', data: result.rows[0] });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
});

// 7) Turn off all lights: Turns on the lights in all rooms.
router.post('/rooms/lights/off', async (req, res) => {
    try {
        const result = await pool.query('UPDATE rooms SET light = FALSE');
        res.status(201).json({ message: 'All lights off', data: result.rows[0] });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/api/rooms/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query('INSERT INTO rooms (name) VALUES ($1) RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message }); // Return the error message in the response
    }
});

*/

module.exports = router;