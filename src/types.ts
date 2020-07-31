import { IssuesGetLabelResponseData } from '@octokit/types';
import { WebhookPayload } from '@actions/github/lib/interfaces';

export type Config = {
  [key: string]: string[];
};

export interface LabelEventWebhookPayload extends WebhookPayload {
  label: IssuesGetLabelResponseData;
}
