"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const logs_js_1 = require("../utils/logs.js");
const file_js_1 = require("../utils/file.js");
const spawn_js_1 = require("../utils/spawn.js");
dotenv.config();
const DATABASES = process.env.DATABASES.split(',');
const FILES_LIMIT = parseInt(process.env.FILES_LIMIT) || 20;
const MODE = process.env.MODE; // CRON or none
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 23 * * *'; // every day at 11pm
const createFolder = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
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
    fs_1.default.readdir(dir, (error, files) => {
        if (files.length >= FILES_LIMIT) {
            fs_1.default.unlink(`${dir}/${files[0]}`, (error) => {
                if (error) {
                    (0, logs_js_1.log)(logs_js_1.type.danger(error));
                    return;
                }
                (0, logs_js_1.log)(logs_js_1.type.warning(`${files[0]} deleted !`));
            });
        }
    });
};
// Run commands
const runBackup = () => {
    DATABASES.map((db_name) => {
        (0, logs_js_1.log)(logs_js_1.type.info(`Start backup for ${db_name} databased`));
        const archive_path = path_1.default.join(file_js_1.backupDir, db_name);
        createFolder(archive_path);
        cleanFolder(archive_path);
        (0, spawn_js_1.execFunction)('mongodump', db_name, `${db_name}-${getDate()}`);
    });
};
if (MODE === 'cron') {
    node_cron_1.default.schedule(CRON_SCHEDULE, () => runBackup());
}
else {
    runBackup();
}
