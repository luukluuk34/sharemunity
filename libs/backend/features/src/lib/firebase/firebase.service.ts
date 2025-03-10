import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { environment } from '@sharemunity/shared/util-env';

const serviceAccount = require('./firebase-sharemunity-firebase-adminsdk-u42tx-46782ded0a.json');

@Injectable()
export class FirebaseService {
  private readonly logger: Logger = new Logger(FirebaseService.name);

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

  async uploadImage(file:Express.Multer.File): Promise<string> {
    return new Promise((resolve,reject) => {

      const filename = `${file.filename}`;
      const bucket = this.storage.bucket();
      const fileUpload = bucket.file(filename);
      const uploadStream = fileUpload.createWriteStream({
        metadata: {
          contentType:file.mimetype,
        }
      });
      uploadStream.on("error", (error) => {
        this.logger.error(`Uploading of: ${filename} failed.`, error)
        reject(error)
      });
      uploadStream.on("finish",async () =>{
        this.logger.log(`Uploading of: ${filename} succesful`)
        const storageUrl = `${environment.storage}/${bucket.name}/${filename}`;
        resolve(storageUrl);
      });
      uploadStream.end(file.buffer);
    });
  }

}