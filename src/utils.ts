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

export function extractMentionedUsers(body: string): string[] {
  function helper(regex: RegExp, mentions: string[] = []): string[] {
    const res = regex.exec(body);

    if (res) {
      const user = res[1].trim();
      return helper(regex, [...mentions, user]);
    }
    return mentions;
  }
  return helper(new RegExp('@([\\w-]+)', 'g'));
}
