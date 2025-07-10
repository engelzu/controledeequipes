const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: {
      rejectUnauthorized: false } }); exports.handler = async (event, context) => { const headers = {
      'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }; if (event.httpMethod === 'OPTIONS') { return { statusCode:
      200, headers, body: '' }; } try { const client = await pool.connect(); if (event.httpMethod === 'GET') { const
      result = await client.query('SELECT * FROM companies ORDER BY name'); client.release(); return { statusCode: 200,
      headers, body: JSON.stringify(result.rows) }; } if (event.httpMethod === 'POST') { const companies =
      JSON.parse(event.body); await client.query('DELETE FROM companies'); for (const company of companies) { await
      client.query( 'INSERT INTO companies (id, name) VALUES ($1, $2)', [company.id, company.name] ); }
      client.release(); return { statusCode: 200, headers, body: JSON.stringify({ message: 'Empresas salvas com sucesso'
      }) }; } } catch (error) { console.error('Erro na função companies:', error); return { statusCode: 500, headers,
      body: JSON.stringify({ error: error.message }) }; } };