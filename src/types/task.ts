import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { IgApiClient } from 'instagram-private-api';
import { IDPSession } from '.';

export interface ITask<IDPSession> {
  generate: (session: IDPSession) => Promise<void>;
  interval: number;
}

export class IgCycleProfilePictureTask implements ITask<IDPSession<IgApiClient>> {
  public generate: (session: IDPSession<IgApiClient>) => Promise<void>;
  public interval: number;

  private index: number = -1;

  public constructor(dir: string, generate?: (session: IDPSession<IgApiClient>) => Promise<void>, interval = 30000) {
    this.generate =
      generate ||
      ((session: IDPSession<IgApiClient>): Promise<void> => {
        const images = readdirSync(dir);
        return new Promise<void>((resolve, reject) => {
          if (images.length < 1) reject(new Error(`No images were found in ${dir}`));
          let n = Math.floor(Math.random() * images.length);
          while (n === this.index) n = Math.floor(Math.random() * images.length);
          this.index = n;
          const imgPath = join(dir, images[this.index]);
          console.log(`attempting to upload file ${images[this.index]}`);
          const buffer = readFileSync(imgPath);
          session.client.account
            .changeProfilePicture(buffer)
            .then(() => {
              resolve();
            })
            .catch((error: Error) => reject(error));
        });
      });
    this.interval = interval;
  }
}
