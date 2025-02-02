import fs from 'fs';

export enum LogType {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
}

export type LogTypeStrings = keyof typeof LogType;

function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function applyColor(type: LogTypeStrings, message: string) {
  const resetColor = '\x1b[0m';
  const color = {
    SUCCESS: '\x1b[32m',
    INFO: '\x1b[36m',
    ERROR: '\x1b[31m',
    WARN: '\x1b[33m',
    DEBUG: '\x1b[35m',
  }[type];

  return `${color}${message}${resetColor}`;
}

function log(type: LogTypeStrings, message: string, location: string) {
  const numberOfSpaces = 'SUCCESS'.length - type.length;
  const spaces = ' '.repeat(numberOfSpaces);

  const string = `(${getCurrentTime()}) ${applyColor(
    type,
    `[${type}]`,
  )}${spaces} - ${location}: ${applyColor(type, message)}`;
  console.log(string);
}

export const logger = {
  success: (message: string, location: string) =>
    log('SUCCESS', message, location),
  info: (message: string, location: string) => log('INFO', message, location),
  warn: (message: string, location: string) => log('WARN', message, location),
  error: (message: string, location: string) => {
    log('ERROR', message, location);
    if (process.env.NODE_ENV === 'development') createLogFile(message);
  },
  debug: (message: string, location: string) => log('DEBUG', message, location),
};

function createLogFile(message: string) {
  const filePath = './logs/error.log';
  const logMessage = `${getCurrentTime()} - ${message}`;
  fs.appendFileSync(filePath, logMessage + '\n\n');
}
