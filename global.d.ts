import { test as _test, expect as _expect } from '@playwright/test';

declare global {
  const test: typeof _test;
  const expect: typeof _expect;
}

export {}; 