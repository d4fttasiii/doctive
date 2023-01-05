import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    service = new EncryptionService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt text input', () => {
    const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const key = 's3cr3t';

    const encrypted = service.encryptString(input, key);
    const decrypted = service.decryptString(encrypted, key);

    expect(encrypted).not.toBe(input);
    expect(decrypted).toBe(input);
  });

  it('should encrypt and decrypt file input', () => {
    const input = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
    const key = 's3cr3t';

    const encrypted = service.encrypt(input, key);
    const decrypted = service.decrypt(encrypted, key);

    expect(Buffer.compare(encrypted, input)).not.toBe(0);
    expect(Buffer.compare(decrypted, input)).toBe(0);
  });
});
