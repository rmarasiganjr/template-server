const express = require('express');
const router = express.Router();
const dbConn = require('../../../config/db.js');

// INSERT
// @route POST api/data/add
// @desc Insert Data to Database
// @access PRIVATE
router.post('/add', (req, res) => {
  try {
    // Get the input from the user through request (req)
    const { json_data, date_created, date_updated } = req.body;

    // Validate input
    if (!json_data || !date_created || !date_updated) {
      return res.status(400).json({ error: 'Incomplete data provided' });
    }

    // Connect to MySQL database and perform INSERT Query
    const sqlQuery =
      'INSERT INTO sensors_tb (json_data, date_created, date_updated) VALUES (?, ?, ?)';
    const values = [[JSON.stringify(json_data)], date_created, date_updated];

    dbConn.query(sqlQuery, values, (error, results, fields) => {
      if (error) {
        console.error('Error executing INSERT query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res
        .status(200)
        .json({ message: 'Insert successful', insertedId: results.insertId });
    });
  } catch (err) {
    console.error('Error in /add route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SELECT or (VIEW)
// @route GET api/data/view
// @desc View Data from the Database
// @access PUBLIC
router.get('/view', (req, res) => {
  // Connect to MySQL database and perform SELECT Query
  const sqlQuery = 'SELECT * FROM sensors_tb';

  dbConn.query(sqlQuery, (error, results, fields) => {
    if (error) {
      console.error('Error executing SELECT query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json(results);
  });
});

// UPDATE
// @route PUT api/data/update
// @desc Update Data in the Database
// @access PRIVATE
router.put('/update', (req, res) => {
  try {
    // Get the input from the user through request (req)
    const { json_data, data_id, date_updated } = req.body;

    // Validate input
    if (!json_data || !data_id || !date_updated) {
      return res.status(400).json({ error: 'Incomplete data provided' });
    }

    // Connect to MySQL database and perform UPDATE Query
    const sqlQuery =
      'UPDATE sensors_tb SET json_data = ?,date_updated=?  WHERE data_id = ?';
    const values = [json_data, date_updated, data_id];

    dbConn.query(sqlQuery, values, (error, results, fields) => {
      if (error) {
        console.error('Error executing UPDATE query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if any rows were affected by the UPDATE operation
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    });
  } catch (err) {
    console.error('Error in /update route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
