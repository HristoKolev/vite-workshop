import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import fetchPolyfill from 'node-fetch';

expect.extend(matchers);

window.fetch = fetchPolyfill;
