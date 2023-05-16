const db = require('../db');

exports.createCharacter = async (req, res) => {
  const { name, ship, rank } = req.body;
  const data = await db.query("INSERT INTO Characters(name, ship, rank) VALUES ($1, $2, $3) RETURNING *",
  [name, ship, rank]);
  res.status(201).json(data.rows[0]);
};