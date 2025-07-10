const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: {
      rejectUnauthorized: false } }); exports.handler = async (event, context) => { const headers = {
      'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }; if (event.httpMethod === 'OPTIONS') { return { statusCode:
      200, headers, body: '' }; } try { const client = await pool.connect(); if (event.httpMethod === 'GET') { const
      result = await client.query('SELECT * FROM areas ORDER BY name'); client.release(); return { statusCode: 200,
      headers, body: JSON.stringify(result.rows) }; } if (event.httpMethod === 'POST') { const areas =
      JSON.parse(event.body); await client.query('DELETE FROM areas'); for (const area of areas) { await client.query(
      'INSERT INTO areas (id, name) VALUES ($1, $2)', [area.id, area.name] ); } client.release(); return { statusCode:
      200, headers, body: JSON.stringify({ message: 'Áreas salvas com sucesso' }) }; } } catch (error) {
      console.error('Erro na função areas:', error); return { statusCode: 500, headers, body: JSON.stringify({ error:
      error.message }) }; } };