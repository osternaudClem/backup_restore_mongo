import { spawn } from 'child_process';
import fs from 'fs';
import selectPrompt from 'select-prompt';
import path from 'path';

import { log, type } from '../utils/logs.js';
import { backupDir } from '../utils/file.js';
import { execFunction } from '../utils/spawn.js';

const folders = [];
const backup_files = [];

const getDir = () => {
  const files = fs.readdirSync(backupDir);
  files.map((file) => {
    const isDir = fs.lstatSync(`${backupDir}/${file}`).isDirectory();
    if (isDir) {
      folders.push({ title: file, value: file });
    }
  });
};

const getFiles = (folder) => {
  const files = fs.readdirSync(`${backupDir}/${folder}`);
  files.map((file) => {
    const isFile = fs.lstatSync(`${backupDir}/${folder}/${file}`).isFile();
    if (isFile) {
      backup_files.push({ title: file, value: file });
    }
  });
};

const chooseFolder = () => {
  getDir();

  selectPrompt('Choose the database you want to restore ...', folders)
    .on('abort', (folder) => log(type.warning('Aborted with', folder)))
    .on('submit', (folder) => {
      chooseBackup(folder);
    });
};

const chooseBackup = (folder) => {
  getFiles(folder);

  selectPrompt('Choose the backup file ...', backup_files)
    .on('abort', (file) => log(type.warning('Aborted with', file)))
    .on('submit', (file) => {
      execFunction('mongorestore', folder, file);
    });
};

chooseFolder();
