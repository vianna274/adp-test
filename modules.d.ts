declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      API_URL: string;
      PORT: number;
      ORIGIN: string;
    }
  }
}
export {};
