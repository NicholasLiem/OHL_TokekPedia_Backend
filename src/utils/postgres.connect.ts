import { DataSource } from 'typeorm';
import { dataSource } from '../database/data-source';

async function postgresSetup(): Promise<DataSource> {
  try {
    const AppDataSource = dataSource;
    AppDataSource.initialize()
    console.log('Connected to PostgreSQL');
    return AppDataSource;
  } catch (error) {
    console.error(error);
    console.error('Could not connect to PostgreSQL');
    process.exit(1);
  }
}

export default postgresSetup;
