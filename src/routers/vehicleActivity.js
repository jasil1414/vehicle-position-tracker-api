import {getVehicleActivity} from '../controllers/vehicleActivity';

export default [
  {
    method: 'get',
    path: '/vehicle_activity',
    handler: getVehicleActivity,
  }
];
