/*import 'dotenv/config'
import pg from 'pg'

export async function connPG() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  const conn = await pool.connect()
  return conn
}*/

import mssql from "mssql"

const sqlConfig = {
  user: 'sa',
  password: 'hash597684',
  server: 'DESKTOP-GUILHER\\SQLEXPRESS',
  database: 'GameWired',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

export async function connect() {
  try {
    const conn = await mssql.connect(sqlConfig)
    console.log("Conectado ao SQL Server!")
    return conn
  } catch (err) {
    console.error("Erro na conexão com SQL:", err)
    throw err
  }
}

connect()

export default connect