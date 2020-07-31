import { Config } from './types';
import fs from 'fs';

export function readFile(path: string): string {
  return fs.readFileSync(path, 'utf8');
}

export function readConfig(path: string): Config {
  const configStr = readFile(path);
  const config = JSON.parse(configStr) as Config;
  return config;
}
