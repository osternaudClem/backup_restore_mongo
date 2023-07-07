import * as dotenv from 'dotenv';
import fs from 'fs';
import cron from 'node-cron';
import path from 'path';

import { log, type } from '../utils/logs.js';
import { backupDir } from '../utils/file.js';
import { execFunction } from '../utils/spawn.js';

dotenv.config();

const DATABASES = process.env.DATABASES.split(',');
const FILES_LIMIT = parseInt(process.env.FILES_LIMIT) || 20;
const MODE = process.env.MODE; // CRON or none
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 23 * * *'; // every day at 11pm

const createFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const getDate = () => {
  const date_time = new Date();

  const day = ('0' + date_time.getDate()).slice(-2);
  const month = ('0' + (date_time.getMonth() + 1)).slice(-2);
  const year = date_time.getFullYear();

  return `${year}-${month}-${day}`;
};

const cleanFolder = (dir) => {
  fs.readdir(dir, (error, files) => {
    if (files.length >= FILES_LIMIT) {
      fs.unlink(`${dir}/${files[0]}`, (error) => {
        if (error) {
          type.log(danger(error));
          return;
        }
        log(type.warning(`${files[0]} deleted !`));
      });
    }
  });
};

// Run commands
const runBackup = () => {
  DATABASES.map((db_name) => {
    log(type.info(`Start backup for ${db_name} databased`));
    const archive_path = path.join(backupDir, db_name);
    createFolder(archive_path);
    cleanFolder(archive_path);
    execFunction('mongodump', db_name, `${db_name}-${getDate()}`);
  });
};

if (MODE === 'cron') {
  cron.schedule(CRON_SCHEDULE, () => runBackup());
} else {
  runBackup();
}
