import * as core from '@actions/core';
import * as github from '@actions/github';

import { LabelEventWebhookPayload } from './types';
import { readConfig, extractMentionedUsers } from './utils';

async function main(): Promise<void> {
  const token = core.getInput('github-token', { required: true });
  const configPath = core.getInput('config-path', { required: false });

  const octokit = github.getOctokit(token);
  const config = readConfig(configPath);

  console.log(github.context);
  console.log(config);

  const { action } = github.context.payload;

  if (action !== 'labeled') {
    return;
  }

  const { label } = github.context.payload as LabelEventWebhookPayload;

  if (!(label.name in config)) {
    return;
  }

  const { repo, owner } = github.context.repo;
  const issue_number = github.context.issue.number;

  const listCommentsResp = await octokit.issues.listComments({
    owner,
    repo,
    issue_number,
  });

  const comments = listCommentsResp.data;
  console.log(comments);

  const [commentByBot] = comments.filter(c => c.user.login === 'github-actions[bot]');

  if (commentByBot === undefined) {
    octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: label.name,
    });
  } else {
    const { body } = commentByBot;
    const oldUsers = extractMentionedUsers(body);
    const newUsers = [...new Set([...oldUsers, ...config[label.name]])];
    const newBody = newUsers.map(u => `@${u}`).join(', ');
    console.log(newBody);

    octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentByBot.id,
      body: newBody,
    });
  }
}

main().catch(err => {
  throw err;
});
