import { UtilService } from './util.service';
import { getPublicKey } from 'ethereum-cryptography/secp256k1';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(async () => {
    service = new UtilService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate random text with the length of 10', () => {
    const text = service.generateRandom(10);
    expect(text.length).toBe(10);
  });

  it('should generate random text with the length of 100', () => {
    const text = service.generateRandom(100);
    expect(text.length).toBe(100);
  });

  // it('should verify signature', async () => {
  //   const message = service.generateRandom(42);
  //   const privateKey = '0x8919b187be9eed52460368f2d609fb76703cbc414d2895c1c440793a94da3efd';
  //   const publicKey = '0x03f2935bccacaae4833b76cf6548a660afb73d0700c99a8c36b2fca763f4339d31';

  //   const signature = await service.signMessage(message, privateKey);
  //   const result = service.verifySignature(message, signature, publicKey);

  //   expect(result).toBeTruthy();
  // });

  // it('should verify signature 2', async () => {
  //   const message = 'a7ce751c-9dc6-4e77-bd98-35b52c0f38ea';
  //   const privateKey = '0x8919b187be9eed52460368f2d609fb76703cbc414d2895c1c440793a94da3efd';
  //   const publicKey = '0x03f2935bccacaae4833b76cf6548a660afb73d0700c99a8c36b2fca763f4339d31';

  //   const signature = await service.signMessage(message, privateKey);
  //   const result = service.verifySignature(message, signature, publicKey);

  //   expect(result).toBeTruthy();
  // });
});
