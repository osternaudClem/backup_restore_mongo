import fs from 'fs';
import https from 'https';

import * as dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.DROPBOX_ACCESS_TOKEN || null;

export const exportToDropbox = (base: string, name: string) => {
  fs.readFile(`./backup/${base}/${name}`, 'utf8', function (err, data) {
    const req = https.request(
      'https://content.dropboxapi.com/2/files/upload',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Dropbox-API-Arg': JSON.stringify({
            path: `${base}/${name}`,
            mode: 'overwrite',
            autorename: true,
            mute: false,
            strict_conflict: false,
          }),
          'Content-Type': 'application/octet-stream',
        },
      },
      (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', function (d) {
          process.stdout.write(d);
        });
      }
    );

    req.write(data);
    req.end();
  });
};
