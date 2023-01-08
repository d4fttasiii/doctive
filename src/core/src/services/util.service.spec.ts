import { UtilService } from './util.service';

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

  it('should hash text', async () => {
    const message = service.generateRandom(42);
    const hashed = await service.argon2Hash(message);

    expect(await service.argon2Verify(hashed, message)).toBeTruthy();
  });
});
