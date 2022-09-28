import { PageTypePipe } from './page-type.pipe';

describe('PageTypePipe', () => {
  it('create an instance', () => {
    const pipe = new PageTypePipe(null);
    expect(pipe).toBeTruthy();
  });
});
