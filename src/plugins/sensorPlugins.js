// src/plugins/sensorPlugin.js

const pool = require('../db');

// Function to log temperature every 5 seconds
const logTemperature = async (roomId) => {
  try {
    const temperature = Math.floor(Math.random() * (26 - 18 + 1)) + 18; // Random temperature between 18 and 26
    const timestamp = new Date();

    await pool.query(
      'INSERT INTO temperature_logs (room_id, temperature, timestamp) VALUES ($1, $2, $3)',
      [roomId, temperature, timestamp]
    );

    console.log(`Logged temperature for room ${roomId} temp ${temperature}`);

  } catch (err) {
    console.error('Error logging temperature:', err);
  }
};

// Start logging temperature every 5 seconds
const startLogging = () => {
  setInterval(async () => {
    const res = await pool.query('SELECT id FROM rooms');
    //console.log(res);
    for (const row of res.rows) {
        // Console.log(row.id)

      logTemperature(row.id);
    }
  }, 2000); // Every 10 seconds
};

module.exports = { startLogging };