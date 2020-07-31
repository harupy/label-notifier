import * as core from '@actions/core';
import * as github from '@actions/github';

import { readConfig } from './utils';

async function main(): Promise<void> {
  const token = core.getInput('github-token', { required: true });
  const configPath = core.getInput('config-path', { required: false });

  const octokit = github.getOctokit(token);
  const config = readConfig(configPath);

  console.log(github.context);
  console.log(config);
  console.log(octokit);
}

main().catch(err => {
  throw err;
});
