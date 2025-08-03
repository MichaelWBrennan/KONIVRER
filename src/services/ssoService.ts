// Simplified SSO service for demo
export default {
  initSSOServices: () => console.log('SSO disabled for demo'),
  loginWithProvider: () => Promise.resolve(null),
  handleOAuthCallback: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
};