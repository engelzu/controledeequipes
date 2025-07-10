const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: {
      rejectUnauthorized: false } }); exports.handler = async (event, context) => { const headers = {
      'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }; if (event.httpMethod === 'OPTIONS') { return { statusCode:
      200, headers, body: '' }; } try { const client = await pool.connect(); if (event.httpMethod === 'GET') { const
      result = await client.query('SELECT * FROM team ORDER BY name'); client.release(); return { statusCode: 200,
      headers, body: JSON.stringify(result.rows) }; } if (event.httpMethod === 'POST') { const team =
      JSON.parse(event.body); await client.query('DELETE FROM team'); for (const member of team) { await client.query(
      'INSERT INTO team (id, name) VALUES ($1, $2)', [member.id, member.name] ); } client.release(); return {
      statusCode: 200, headers, body: JSON.stringify({ message: 'Equipe salva com sucesso' }) }; } } catch (error) {
      console.error('Erro na função team:', error); return { statusCode: 500, headers, body: JSON.stringify({ error:
      error.message }) }; } };