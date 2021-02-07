const config = {
  env: 'production',
  port: process.env.PORT||3000,
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'vehicle-postions',
    password: process.env.DB_PASSWORD || '',
  }
}

export default config;