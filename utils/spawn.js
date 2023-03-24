import { spawn } from 'child_process';
import * as dotenv from 'dotenv';

import { log, type } from './logs.js';
import { backupDir } from './file.js';

dotenv.config();

const PROCESS_AUTHORIZED = ['mongodump', 'mongorestore'];
const USERNAME = process.env.MONGO_USERNAME || null;
const PASSWORD = process.env.MONGO_PASSWORD || null;

export const execFunction = (process, db_name, db_backup) => {
  if (!PROCESS_AUTHORIZED.includes(process)) {
    return;
  }

  const args = ['--gzip'];
  let successIntro = '';

  switch (process) {
    case 'mongodump':
      args.push(`--archive=${backupDir}/${db_name}/${db_backup}.gzip`);
      args.push(`--db=${db_name}`);
      successIntro = 'Backup';
      break;
    case 'mongorestore':
      args.push(`--archive=${backupDir}/${db_name}/${db_backup}`);
      args.push('--drop');
      successIntro = 'Restore';
      break;
    default:
      return;
  }

  if (USERNAME) {
    args.push(`--username=${USERNAME}`);
  }

  if (PASSWORD) {
    args.push(`--password=${PASSWORD}`);
  }

  const child = spawn(process, args);

  child.stdout.on('data', (data) => {
    log(type.info('stdout:\n', data));
  });

  child.stderr.on('data', (data) => {
    log(type.info('stderr:\n', Buffer.from(data).toString()));
  });

  child.on('error', (error) => {
    log(type.danger('error:\n', error));
  });

  child.on('exit', (code, signal) => {
    if (code) log(type.danger('Process exit with code:', code));
    else if (signal) log(type.warning('Process killed with signal:', signal));
    else log(type.success(`${successIntro} --${db_name}-- is successfull ✅`));
  });
};
