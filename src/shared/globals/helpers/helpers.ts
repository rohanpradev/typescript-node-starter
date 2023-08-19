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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseJson(prop: string): any {
    try {
      JSON.parse(prop);
    } catch (error) {
      return prop;
    }
    return JSON.parse(prop);
  }
}
