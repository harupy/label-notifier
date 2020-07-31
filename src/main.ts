import * as core from '@actions/core';
import * as github from '@actions/github';

import { LabelContext } from './types';
import { readConfig } from './utils';

async function main(): Promise<void> {
  const token = core.getInput('github-token', { required: true });
  const configPath = core.getInput('config-path', { required: false });

  const octokit = github.getOctokit(token);
  const config = readConfig(configPath);

  console.log(github.context);
  console.log(config);
  console.log(octokit);

  const { action } = github.context.payload;

  if (action !== 'labeled') {
    return;
  }

  const { repo, owner } = github.context.repo;
  const issue_number = github.context.issue.number;

  const { label } = github.context as LabelContext;

  if (label === undefined) {
    return;
  }

  octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body: label.name,
  });
}

main().catch(err => {
  throw err;
});
