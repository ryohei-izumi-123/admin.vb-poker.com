import { RolePipe } from './role.pipe';

describe('RolePipe', () => {
  it('create an instance', () => {
    const pipe = new RolePipe(null);
    expect(pipe).toBeTruthy();
  });
});
