import { PrettifyJsonPipe } from './prettify-json.pipe';

describe('PrettifyJsonPipe', () => {
  it('create an instance', () => {
    const pipe = new PrettifyJsonPipe();
    expect(pipe).toBeTruthy();
  });
});
