import { readFile, readConfig, extractMentionedUsers } from '../src/utils';

import fs from 'fs';
import tmp from 'tmp';

describe('utils', (): void => {
  it(
    readFile.name,
    async (done): Promise<void> => {
      tmp.file({}, (err, name, fd, cb) => {
        if (err) throw err;
        const src = 'src';
        fs.writeFileSync(name, src);
        expect(readFile(name)).toBe(src);
        done();
      });
    },
  );

  it(
    readConfig.name,
    async (done): Promise<void> => {
      tmp.file({}, (err, name, fd, cb) => {
        if (err) throw err;
        const src = `
{
  "foo": ["bar"]
}
`;
        fs.writeFileSync(name, src);
        expect(readConfig(name)).toEqual({ foo: ['bar'] });
        done();
      });
    },
  );

  it(extractMentionedUsers.name, () => {
    expect(extractMentionedUsers('@foo')).toEqual(['foo']);
    expect(extractMentionedUsers('@foo, @bar')).toEqual(['foo', 'bar']);
    expect(extractMentionedUsers('foo')).toEqual([]);
  });
});
