declare global {
  interface Window {
    AdobeDC?: any;
    __adobeViewSDKReady?: () => void;
  }
}

export {};

