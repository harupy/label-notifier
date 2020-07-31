import { IssuesGetLabelResponseData } from '@octokit/types';
import { Context } from '@actions/github/lib/context';

export type Config = {
  [key: string]: string[];
};

export interface LabelContext extends Context {
  label?: IssuesGetLabelResponseData;
}
