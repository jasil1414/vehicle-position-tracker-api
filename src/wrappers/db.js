import pool from '../services/psql';

const query = async(text, params) =>  {
  try {
   const {rows} = await pool.query(text, params);
   return {items: rows};
  } catch (err) {
    return {err};
  }
};

export default {query};