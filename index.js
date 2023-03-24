// import chalk from 'chalk';
// import { spawn } from 'child_process';
// import * as dotenv from 'dotenv';
// import fs from 'fs';
// import cron from 'node-cron';
// import path from 'path';
// import { fileURLToPath } from 'url';

// dotenv.config();

// const DATABASES = process.env.DATABASES.split(',');
// const FILES_LIMIT = parseInt(process.env.FILES_LIMIT) || 20;
// const CRON_SCHEDULE = '0 23 * * *';

// // Fix ES 6 dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const log = console.log;

// // Log colors
// const success = chalk.bold.hex('#22bb33'); // Green color
// const info = chalk.blue;
// const warning = chalk.hex('#FFA500'); // Orange color
// const danger = chalk.bold.red;

// const createFolder = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir);
//   }
// };

// const getDate = () => {
//   const date_time = new Date();

//   const day = ('0' + date_time.getDate()).slice(-2);
//   const month = ('0' + (date_time.getMonth() + 1)).slice(-2);
//   const year = date_time.getFullYear();

//   return `${year}-${month}-${day}-${date_time.getMinutes()}-${date_time.getSeconds()}`;
// };

// const cleanFolder = (dir) => {
//   fs.readdir(dir, (error, files) => {
//     if (files.length >= FILES_LIMIT) {
//       fs.unlink(`${dir}/${files[0]}`, (error) => {
//         if (error) {
//           log(danger(error));
//           return;
//         }
//         log(warning(`${files[0]} deleted !`));
//       });
//     }
//   });
// };

// const backupMongoDB = (db_name, db_path) => {
//   const child = spawn('mongodump', [
//     `--db=${db_name}`,
//     `--archive=${db_path}/${db_name}-${getDate()}.gzip`,
//     '--gzip',
//   ]);

//   child.stdout.on('data', (data) => {
//     log(info('stdout:\n', data));
//   });

//   child.stderr.on('data', (data) => {
//     log(info('stderr:\n', Buffer.from(data).toString()));
//   });

//   child.on('error', (error) => {
//     log(danger('error:\n', error));
//   });

//   child.on('exit', (code, signal) => {
//     if (code) log(danger('Process exit with code:', code));
//     else if (signal) log(warning('Process killed with signal:', signal));
//     else log(success(`Backup --${db_name}-- is successfull ✅`));
//   });
// };

// // Run commands
// const runBackup = () => {
//   DATABASES.map((db) => {
//     log(info(`Start backup for ${db} databased`));
//     const archive_path = path.join(__dirname, `backup/${db}`);
//     createFolder(archive_path);
//     cleanFolder(archive_path);
//     backupMongoDB(db, archive_path);
//   });
// };

// cron.schedule(CRON_SCHEDULE, () => runBackup());
