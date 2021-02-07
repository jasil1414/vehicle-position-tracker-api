import db from '../wrappers/db';
import config from '../config/'

const getPlaceInteraction = async (req, res) => {

  const {query:{start_tis, end_tis, limit=10, offset=0}={}} = req;
  if (!start_tis || !end_tis)
    return res.json({success:0, error: 'Start and End time not specified'});
  
  const startDate = new Date(start_tis);
  const endDate = new Date(end_tis);
  
  if (startDate.getTime() > endDate.getTime()) 
    return res.json({success:0, error: 'Start time is greater than end time'});

  const queryString = `
    select vehicles.model, vehicles.chasisnumber, vehicles.vehiclelicense,  vehicles.enginenumber, position.time, position.vehicleId, ST_X(position.geog::geometry) as longitude, ST_Y(position.geog::geometry) as latitude from positions as position
      inner join (select distinct(vehicleId),  max(time) as posTime from positions p2
          where time >= '${startDate.toISOString()}' and time <= '${endDate.toISOString()}' and ST_Intersects(geog::geography, ST_GeogFromText('${config.punePolygon}'))
          group by vehicleId) as distinctVehicles
      on distinctVehicles.vehicleId = position.vehicleId and distinctVehicles.posTime = position.time
      inner join (select * from vehicles) as vehicles
      on vehicles.id = position.vehicleId
      offset ${parseInt(offset)}
      limit ${parseInt(limit)}
  `;

  const {items=[], err} = await db.query(queryString);
  if (err)
    return res.json({success:0, error: err});

  return res.json({success:1, data:{items}});
};

export {
  getPlaceInteraction,
};