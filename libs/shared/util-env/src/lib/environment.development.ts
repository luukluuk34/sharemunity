import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,
    port: 3000,
    dataApiUrl: 'http://localhost:3000/api',
    storage: './uploads',
  };