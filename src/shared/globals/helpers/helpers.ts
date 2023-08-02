import { capitalize } from 'lodash';
import { randomUUID } from 'crypto';

export class Helpers {
  static firstLetterUppercase(str: string): string {
    return capitalize(str);
  }

  static lowercase(str: string): string {
    return str.toLowerCase();
  }

  static generateUid(): string {
    return randomUUID();
  }
}
