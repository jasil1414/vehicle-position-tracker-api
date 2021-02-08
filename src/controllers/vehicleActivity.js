import db from '../wrappers/db';

const getVehicleActivity = async (req, res) => {
  const {query:{start_tis, end_tis, license}={}} = req;

  if (!start_tis || !end_tis)
  return res.json({success:0, error: 'Start and End time not specified'});

  const startDate = new Date(start_tis);
  const endDate = new Date(end_tis);
  
  if (startDate.getTime() > endDate.getTime())
    return res.json({success:0, error: 'Start time is greater than end time'});

  if (!license)
    return res.json({success:0, error: 'License not specified'});


  const queryString = `
    select vehicle.vehiclelicense, position.time, ST_X(position.geog::geometry) as longitude, ST_Y(position.geog::geometry) as latitude from positions as position
      inner join (
        select * from vehicles 
        where vehiclelicense = '${license}'
      ) as vehicle
      on position.vehicleId = vehicle.id
    where time >= '${startDate.toISOString()}' and time <= '${endDate.toISOString()}'
    sort by time
  `;
  
  const {items=[], err} = await db.query(queryString);
  if (err)
    return res.json({success:0, error: err});

  return res.json({success:1, data:{items}});

};

export {
  getVehicleActivity,
};