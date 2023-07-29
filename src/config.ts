import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public REDIS_HOST: string | undefined;
  public REDIS_USERNAME: string | undefined;
  public REDIS_PASSWORD: string | undefined;
  public REDIS_PORT: number | undefined;

  private readonly DEFAULT_NODE_ENV = 'development';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.NODE_ENV = process.env.NODE_ENV || this.DEFAULT_NODE_ENV;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    this.REDIS_PORT = Number(process.env.REDIS_PORT);
    this.REDIS_USERNAME = process.env.REDIS_USERNAME;
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (!value) throw new Error(`Configuration ${key} is not present`);
    }
  }
}

export const config: Config = new Config();
