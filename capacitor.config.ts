import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ClinicAI',
  webDir: 'www',
  bundledWebRuntime: false,
  // Adding this server attribute allowed HTTP requests to go through on mobile
  // devices
  server: {
    cleartext: true,
  }
};

export default config;
