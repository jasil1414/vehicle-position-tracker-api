import  { Pool } from 'pg';
import config from '../src/config';

const {db} = config;

const initPositionTable = `CREATE TABLE positions(
  id SERIAL,
  geog GEOGRAPHY,
  time TIMESTAMPTZ,
  vehicleId integer REFERENCES vehicles (id) 
);`;

const initVehicleTable = `CREATE TABLE vehicles(
  id SERIAL PRIMARY KEY,
  vehicleLicense VARCHAR UNIQUE,
  model VARCHAR,
  engineNumber VARCHAR UNIQUE,
  chasisNumber VARCHAR UNIQUE
);`;

const dropVehicleTable = `DROP TABLE IF EXISTS vehicles;`;
const dropPositionTable = `DROP TABLE IF EXISTS positions;`;

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
});


const run = async () => {
  await query(dropPositionTable);
  await query(dropVehicleTable);
  await query(initVehicleTable);
  await query(initPositionTable);
};

const query = async (query) => {
  try {
    const res = await pool.query(query);
    return {res};
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run()
.then(() => {
  console.log('complete');
  process.exit(0);
})
.catch(error => {
  console.error(error);
  process.exit(1);
})