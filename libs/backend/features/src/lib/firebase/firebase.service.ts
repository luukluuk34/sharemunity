import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount = require('./firebase-sharemunity-firebase-adminsdk-u42tx-46782ded0a.json');

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor(){
    admin.initializeApp({
      credential:admin.credential.cert(serviceAccount),
      storageBucket:'firebase-sharemunity.appspot.com'
    })
    this.storage = admin.storage();
  }

  getStorageInstance():admin.storage.Storage {
    return this.storage;
  }

}