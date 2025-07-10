const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: {
      rejectUnauthorized: false } }); exports.handler = async (event, context) => { const headers = {
      'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }; if (event.httpMethod === 'OPTIONS') { return { statusCode:
      200, headers, body: '' }; } try { const client = await pool.connect(); if (event.httpMethod === 'GET') { const
      result = await client.query('SELECT * FROM users ORDER BY username'); client.release(); return { statusCode: 200,
      headers, body: JSON.stringify(result.rows) }; } if (event.httpMethod === 'POST') { const users =
      JSON.parse(event.body); await client.query('DELETE FROM users'); for (const user of users) { await client.query(
      'INSERT INTO users (id, username, password) VALUES ($1, $2, $3)', [user.id, user.username, user.password] ); }
      client.release(); return { statusCode: 200, headers, body: JSON.stringify({ message: 'Usuários salvos com sucesso'
      }) }; } } catch (error) { console.error('Erro na função users:', error); return { statusCode: 500, headers, body:
      JSON.stringify({ error: error.message }) }; } };