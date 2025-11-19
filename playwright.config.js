import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  globalSetup: path.resolve('./tests/global-setup.js'),
  globalTeardown: path.resolve('./tests/global-teardown.js'),
  use: {
    baseURL: 'http://localhost:8000/BCC/',
  },
});
