import { Pool } from 'pg';
import config from 'config';
import { DataSource } from 'typeorm';
import { Barang } from '../models/barang.model';
import { Perusahaan } from '../models/perusahaan.model';
import { User } from '../models/user.model';

async function postgresSetup(): Promise<DataSource> {
  try {
    const pool = new Pool({
      connectionString: config.get('postgresURI'),
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const client = await pool.connect();
    console.log('Connected to PostgreSQL');

    const dataSource = new DataSource({
      type: 'postgres',
      url: config.get('postgresURI'),
      entities: [Barang, Perusahaan, User],
      ssl: true,
      synchronize: true, // This option creates the schema automatically
      logging: true, // Set to true to see SQL logs
    });

    dataSource.initialize()

    return dataSource;
  } catch (error) {
    console.error(error);
    console.error('Could not connect to PostgreSQL');
    process.exit(1);
  }
}

export default postgresSetup;
