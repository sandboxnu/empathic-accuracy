declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: string;
    ACCESS_KEY_ID?: string;
    SECRET_KEY?: string;
    ROLLBAR_TOKEN?: string;
    ADMIN_KEY: string;
    ADMIN_PASS_HASH: string;
    DYNAMO_TABLE: string;
  }
}
