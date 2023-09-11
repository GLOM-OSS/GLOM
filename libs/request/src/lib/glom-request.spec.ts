import { glomRequest } from './glom-request';

describe('glomRequest', () => {
  it('should work', () => {
    expect(glomRequest()).toEqual('glom-request');
  });
});
