import '@testing-library/jest-dom/extend-expect';
import { vi } from 'vitest';

global.vi = vi;
global.confirm = vi.fn(() => true);
