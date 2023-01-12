import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';

@Injectable()
export class UtilService {
    generateRandom(length: number): string {
        let text = uuidv4().replace('-', '');
        while (text.length < length) {
            text += this.generateRandomText();
        }

        return text.substring(0, length);
    }

    removeHexPrefix(text: string): string {
        return (text.startsWith('0x') ? text.substring(2) : text).trim();
    }

    async argon2Hash(data: string): Promise<string> {
        return await argon2.hash(data);
    }

    async argon2Verify(hash: string, data: string): Promise<boolean> {
        return await argon2.verify(hash, data);
    }

    private generateRandomText(): string {
        return uuidv4().replace('-', '');
    }
}
