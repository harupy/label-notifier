import * as core from '@actions/core';

import { readConfig } from './utils';

async function main(): Promise<void> {
  const configPath = core.getInput('config-path', { required: false });
  const config = readConfig(configPath);
  console.log(config);
}

main();
