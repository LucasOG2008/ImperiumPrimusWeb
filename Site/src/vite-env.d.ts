/// <reference types="vite/client" />

// requestIdleCallback nem sempre está tipado no lib.dom — declaração mínima.
interface Window {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
}
