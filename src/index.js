const express = require('express');
const pool = require('./db');
// Import the roomRouts.js and assign it to app
const roomRoutes = require('./routes/roomRoutes.js')
const {startLogging} = require('./plugins/sensorPlugins.js')

const  app = express();
app.use(express.json());
app.use("/api",roomRoutes)
// DROP TABLE IF EXISTS temperature_logs;
// DROP TABLE IF EXISTS rooms;
const dbInit = `

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  light BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS temperature_logs (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  temperature INTEGER CHECK (temperature >= -50 AND temperature <= 50),
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;



pool.query(dbInit, (err, res) => {
  if (err) {
    console.error('Error creating tables:', err);
  } else {
    console.log('Tables created successfully');
    startLogging()
  }
});



const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});