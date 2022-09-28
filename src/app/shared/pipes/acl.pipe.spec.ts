import { AclPipe } from './acl.pipe';

describe('AclPipe', () => {
  it('create an instance', () => {
    const pipe = new AclPipe(null, null);
    expect(pipe).toBeTruthy();
  });
});
