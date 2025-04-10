import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,
    port: 8080,
    dataApiUrl: 'https://sharemunity-api.azurewebsites.net/api',
    storage: 'https://storage.googleapis.com/',
};