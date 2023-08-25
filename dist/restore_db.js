"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const select_prompt_1 = __importDefault(require("select-prompt"));
const logs_js_1 = require("../utils/logs.js");
const file_js_1 = require("../utils/file.js");
const spawn_js_1 = require("../utils/spawn.js");
const folders = [];
const backup_files = [];
const getDir = () => {
    const files = fs_1.default.readdirSync(file_js_1.backupDir);
    files.map((file) => {
        const isDir = fs_1.default.lstatSync(`${file_js_1.backupDir}/${file}`).isDirectory();
        if (isDir) {
            folders.push({ title: file, value: file });
        }
    });
};
const getFiles = (folder) => {
    const files = fs_1.default.readdirSync(`${file_js_1.backupDir}/${folder}`);
    files.map((file) => {
        const isFile = fs_1.default.lstatSync(`${file_js_1.backupDir}/${folder}/${file}`).isFile();
        if (isFile) {
            backup_files.push({ title: file, value: file });
        }
    });
};
const chooseFolder = () => {
    getDir();
    (0, select_prompt_1.default)('Choose the database you want to restore ...', folders)
        .on('abort', (folder) => (0, logs_js_1.log)(logs_js_1.type.warning('Aborted with', folder)))
        .on('submit', (folder) => {
        chooseBackup(folder);
    });
};
const chooseBackup = (folder) => {
    getFiles(folder);
    (0, select_prompt_1.default)('Choose the backup file ...', backup_files)
        .on('abort', (file) => (0, logs_js_1.log)(logs_js_1.type.warning('Aborted with', file)))
        .on('submit', (file) => {
        (0, spawn_js_1.execFunction)('mongorestore', folder, file);
    });
};
chooseFolder();
