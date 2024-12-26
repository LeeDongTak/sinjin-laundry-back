import mysql from 'mysql2';
import { mysqlConfig } from './setting';
import { createPool, Pool } from 'mysql2/promise';

export const pool: Pool = createPool(mysqlConfig);
