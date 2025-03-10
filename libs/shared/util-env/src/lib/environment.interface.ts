export interface IEnvironment {
    production: boolean;
    port: number;
    dataApiUrl:string;
    storage:string;

    firebase_admin_cred:string;
}