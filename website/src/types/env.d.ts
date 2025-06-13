// Environment variables type definitions
declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    MONGODB_URI: string;
    FASTAPI_URL: string;
    WHATSAPP_TOKEN: string;
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: string;
    MESSENGER_ACCESS_TOKEN: string;
    MESSENGER_VERIFY_TOKEN: string;
    FACEBOOK_APP_SECRET: string;
    JWT_SECRET: string;
  }
}
