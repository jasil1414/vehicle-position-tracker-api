import {getPlaceInteraction} from '../controllers/placeInteraction';

export default [
  {
    method: 'get',
    path: '/place_interactions',
    handler: getPlaceInteraction,
  }
];
