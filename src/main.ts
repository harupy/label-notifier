import * as core from '@actions/core';
import * as github from '@actions/github';

import { LabelEventWebhookPayload } from './types';
import { SIGNATURE } from './constants';
import {
  readConfig,
  extractMentionedUsers,
  removeDuplicates,
  createMarkdownComment,
} from './utils';

async function main(): Promise<void> {
  const token = core.getInput('github-token', { required: true });
  const configPath = core.getInput('config-path', { required: false });

  const octokit = github.getOctokit(token);
  const config = readConfig(configPath);

  const { action } = github.context.payload;

  if (action !== 'labeled') {
    console.log("This is not a 'labeled' event");
    return;
  }

  const { label } = github.context.payload as LabelEventWebhookPayload;

  if (!(label.name in config)) {
    console.log(`Label '${label.name}' doesn't exist in the configuration file`);
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

  const signature = createMarkdownComment(SIGNATURE);
  const [commentByBot] = comments.filter(({ user, body }) => {
    return user.login === 'github-actions[bot]' && body.includes(signature);
  });

  if (commentByBot === undefined) {
    const users = config[label.name];
    users.sort();
    const body = users.map(u => `@${u}`).join(', ') + `\n\n${signature}`;

    octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });
  } else {
    console.log('Found a comment posted by this bot');
    const { body: oldBody } = commentByBot;
    const oldUsers = extractMentionedUsers(oldBody);
    const newUsers = removeDuplicates([...oldUsers, ...config[label.name]]);
    newUsers.sort();
    const newBody = newUsers.map(u => `@${u}`).join(', ') + `\n\n${signature}`;

    if (oldBody === newBody) {
      return;
    }

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
