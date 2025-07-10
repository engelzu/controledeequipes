const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: {
      rejectUnauthorized: false } }); exports.handler = async (event, context) => { const headers = {
      'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' }; if (event.httpMethod === 'OPTIONS') { return
      { statusCode: 200, headers, body: '' }; } try { const client = await pool.connect(); if (event.httpMethod ===
      'GET') { const result = await client.query('SELECT * FROM activities ORDER BY checkin_time DESC');
      client.release(); return { statusCode: 200, headers, body: JSON.stringify(result.rows) }; } if (event.httpMethod
      === 'POST') { const activities = JSON.parse(event.body); await client.query('DELETE FROM activities'); for (const
      activity of activities) { await client.query( `INSERT INTO activities ( id, company, factory, area, participants,
      description, observation, activity_photo_url, authorization_photo_url, activity_photo_data_url,
      authorization_photo_data_url, location, checkin_time, checkout_time, registered_by, is_offline, liberacao_pt_time,
      liberacao_pt_prevencionista_time, liberacao_ts_time, liberacao_supervisor_time, inicio_atividade_time ) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`, [ activity.id,
      activity.company, activity.factory, activity.area, activity.participants, activity.description,
      activity.observation, activity.activityPhotoUrl, activity.authorizationPhotoUrl, activity.activityPhotoDataUrl,
      activity.authorizationPhotoDataUrl, activity.location, activity.checkinTime, activity.checkoutTime,
      activity.registeredBy, activity.isOffline, activity.liberacaoPtTime, activity.liberacaoPtPrevencionistaTime,
      activity.liberacaoTsTime, activity.liberacaoSupervisorTime, activity.inicioAtividadeTime ] ); } client.release();
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Atividades salvas com sucesso' }) }; } } catch
      (error) { console.error('Erro na função activities:', error); return { statusCode: 500, headers, body:
      JSON.stringify({ error: error.message }) }; } };