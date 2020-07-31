import { IssuesGetLabelResponseData } from '@octokit/types';
import { WebhookPayload } from '@actions/github/lib/interfaces';

export type Config = {
  [key: string]: string[];
};

export interface LabelWebhookPayload extends WebhookPayload {
  label: IssuesGetLabelResponseData;
}
