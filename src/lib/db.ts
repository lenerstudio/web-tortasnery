import mysql from 'mysql2/promise';

// Create a connection pool or a single connection
// For Serverless environments (like Vercel), connection pooling is recommended but handled carefully.
// TiDB is fully MySQL compatible.

const pool = mysql.createPool({
    host: process.env.TIDB_HOST,   // Your TiDB Host (e.g., gateway01.us-west-2.prod.aws.tidbcloud.com)
    port: Number(process.env.TIDB_PORT) || 4000, // Default TiDB port
    user: process.env.TIDB_USER,   // Your TiDB Username
    password: process.env.TIDB_PASSWORD, // Your TiDB Password
    database: process.env.TIDB_DATABASE, // Your Database Name
    ssl: {
        rejectUnauthorized: true, // TiDB Cloud requires SSL
        minVersion: 'TLSv1.2'
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
    const [results] = await pool.execute(sql, params);
    return results as T;
}

export default pool;
