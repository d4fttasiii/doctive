import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilService {
    generateRandom(length: number): string {
        let text = uuidv4().replace('-', '');
        while (text.length < length) {
            text += this.generateRandomText();
        }

        return text.substring(0, length);
    }

    removeHexPrefix(text: string) {
        return (text.startsWith('0x') ? text.substring(2) : text).trim();
    }

    private generateRandomText(): string {
        return uuidv4().replace('-', '');
    }
}
