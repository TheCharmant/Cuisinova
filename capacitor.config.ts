import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.cuisinova.app",
  appName: "Cuisinova",
  webDir: "out",
  server: {
    url: "https://cuisinova.cloud",
    cleartext: false
  }
};

export default config;
