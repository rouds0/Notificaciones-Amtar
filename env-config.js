import dotenv from 'dotenv';

const env = dotenv.config({
  path: '.env.production',
}).parsed;

export default env;