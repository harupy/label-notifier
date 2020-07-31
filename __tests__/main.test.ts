import { sample } from '../src/main';

describe('labels', (): void => {
  it(sample.name, () => {
    expect(sample()).toBe('foo');
  });
});
