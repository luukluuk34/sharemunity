import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { environment } from '@sharemunity/shared/util-env';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly logger: Logger = new Logger(FirebaseService.name);

  private readonly storage: admin.storage.Storage;

  constructor(private configService: ConfigService){
    const firebaseCredentials = this.configService.get<string>('FIREBASE_CREDENTIALS');
    if(!firebaseCredentials){
      throw new Error("Firebase Credentials are missing in environment variables!");
    }
    let parsedCredentials: admin.ServiceAccount;
    try{
      this.logger.debug("Decoded string");
      const decoded = Buffer.from(firebaseCredentials,'base64').toString('utf-8');
      parsedCredentials = JSON.parse(decoded) as admin.ServiceAccount;
      this.logger.debug(parsedCredentials);
    }catch(error){
      throw new Error("Invalid FIREBASE_CREDENTIALS JSON FORMAT");
    }
    admin.initializeApp({
      credential:admin.credential.cert(parsedCredentials),
      storageBucket:'firebase-sharemunity.appspot.com'
    })
    this.storage = admin.storage();
  }

  getStorageInstance():admin.storage.Storage {
    return this.storage;
  }

  async uploadImage(file:Express.Multer.File): Promise<string> {
    return new Promise((resolve,reject) => {

      const filename = `${file.originalname}`;
      this.logger.debug('UploadingFileName: ',filename);
      const bucket = this.storage.bucket();
      const fileUpload = bucket.file(filename);
      const uploadStream = fileUpload.createWriteStream({
        metadata: {
          contentType:file.mimetype,
        }
      });
      this.logger.debug("Lets goooooooo");
      uploadStream.on("error", (error) => {
        this.logger.error(`Uploading of: ${filename} failed.`, error)
        reject(error)
      });
      uploadStream.on("finish",async () =>{
        await fileUpload.makePublic();
        this.logger.log(`Uploading of: ${filename} succesful`)
        const storageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        resolve(storageUrl);
      });
      uploadStream.end(file.buffer);
    });
  }

}