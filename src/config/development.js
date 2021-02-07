const config = {
  env: 'development',
  port: process.env.PORT||3000,
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'vehiclepositions',
    password: process.env.DB_PASSWORD || '',
  }
}

export default config;