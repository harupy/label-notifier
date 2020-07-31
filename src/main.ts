import { readConfig } from './utils';

async function main(): Promise<void> {
  const config = readConfig('./.github/.label-notifier.json');
  console.log(config);
}

main();
