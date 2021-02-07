import development from './development';
import staging from './staging';
import production from './production';
import base from './base';
const config = {
  development,
  staging,
  production,
};

export default {...base, ...config[process.env.ENV||'development']};