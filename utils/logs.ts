import chalk from 'chalk';

export const log = console.log;

// Log colors
export const type = {
  success: chalk.bold.hex('#22bb33'), // Green color
  info: chalk.blue,
  warning: chalk.hex('#FFA500'), // Orange color
  danger: chalk.bold.red,
};
