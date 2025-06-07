/**
 * Version API Endpoint
 * Provides version information for skew protection
 */

export default function handler(req, res) {
  // Only allow GET and HEAD requests
  if (!['GET', 'HEAD'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get version from environment or generate one
  const version = process.env.VERCEL_GIT_COMMIT_SHA || 
                 process.env.VITE_APP_VERSION || 
                 process.env.VITE_BUILD_TIME ||
                 Date.now().toString();

  // Set version header for skew detection
  res.setHeader('X-App-Version', version);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // For HEAD requests, just return headers
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  // For GET requests, return version info
  const versionInfo = {
    version,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    region: process.env.VERCEL_REGION || 'unknown',
    deployment: {
      id: process.env.VERCEL_DEPLOYMENT_ID || 'local',
      url: process.env.VERCEL_URL || 'localhost',
    },
  };

  return res.status(200).json(versionInfo);
}
