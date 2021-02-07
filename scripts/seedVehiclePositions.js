import  { Pool } from 'pg';
import fs from 'fs';
import config from '../src/config';

const {db} = config;

if (!process.argv[3] || !fs.existsSync(`./data/${process.argv[3]}`)) {
  console.error('Data file not specified or does not exist');
  process.exit(1);
}

const file = fs.readFileSync(`./data/${process.argv[3]}`, {encoding: 'utf-8'});

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
});




const seedData = async () => {
  const rows = file.trim().split('\n').slice(1).map((row) => row.split(',')).map(({[0]: latitude, [1]: longitude, [2]:time, [3]:vehicleLicense, [4]:model, [5]:engineNumber, [6]:chasisNumber}) => {
    return {
      latitude,
      longitude,
      time,
      vehicleLicense,
      model,
      engineNumber,
      chasisNumber,
    }
  });
  
  await rows.reduce(async (previousPromise, row) => {
    await previousPromise;
    const {obj: {id:vehicleId}={}, err: vehicleErr} = await getOrCreateVehicle(row);
    if (vehicleErr || !vehicleId)
      return Promise.reject({err: vehicleErr || {message: 'Unable to create or get vehicle'}});
    
    const {err} = await insertPosition({vehicleId, ...row});
    if (err)
      return Promise.reject({err});
    return Promise.resolve();
  },{});
}

const insertPosition = async ({latitude=null, longitude=null, time, vehicleId}) => {
  try {
    const res = await pool.query(`INSERT INTO positions(geog, time, vehicleId) VALUES (ST_MakePoint($1,$2), $3, $4)`,
    [parseFloat(longitude), parseFloat(latitude), time, vehicleId]
    );
    return {res}
  } catch(err) {
    return {err}
  }
}

const getOrCreateVehicle = async ({vehicleLicense, model, engineNumber, chasisNumber}) => {
  const {obj: vehicle,} = await getVehicle(vehicleLicense);
  if (vehicle)
    return {obj: vehicle};
  const {err} = await createVehicle({vehicleLicense, model, engineNumber, chasisNumber});
  if (err)
    return {err};
  const {obj} = await getVehicle(vehicleLicense);
  return {obj};
}

const getVehicle = async (vehicleLicense) => {
  try {
    const {rows:{[0]:obj}={}} = await pool.query(`SELECT * from vehicles where vehicleLicense = '${vehicleLicense}'`);
    return {obj};
  } catch (err) {
    return {err};
  }
}

const createVehicle = async ({vehicleLicense, model, engineNumber, chasisNumber}) => {
  try {
    const row = await pool.query(`INSERT INTO vehicles(vehicleLicense, model, engineNumber, chasisNumber) VALUES ($1, $2, $3, $4)`,
    [vehicleLicense.trim(), model.trim(), engineNumber.trim(), chasisNumber.trim()]
    );
    return {obj: row};
  } catch (err) {
    return {err};
  }
}

seedData()
.then(() => {
  console.log('completed');
  process.exit(0);
})
.catch((error) => {
  console.error(error);
  process.exit(1);
})