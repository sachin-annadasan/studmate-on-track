import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ce1af9fc7753456b9b91e7523cf87eb7',
  appName: 'Student Attendance System',
  webDir: 'dist',
  server: {
    url: 'https://ce1af9fc-7753-456b-9b91-e7523cf87eb7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false
    }
  }
};

export default config;