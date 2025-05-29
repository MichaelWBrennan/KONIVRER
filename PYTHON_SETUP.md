# Python Setup for Vercel Deployment

This document explains the Python configuration for the KONIVRER Deck Database project on Vercel.

## Overview

The project is configured to use Python 3.12 for serverless functions on Vercel, while the main application is built with Vite/React.

## Python Configuration Files

### 1. `runtime.txt`

Specifies the Python version for Vercel:

```
python-3.12
```

### 2. `requirements.txt`

Lists Python dependencies for the serverless functions:

```
requests==2.31.0
urllib3==2.1.0
```

### 3. `vercel.json`

Configures Python runtime for API functions:

```json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.12"
    }
  }
}
```

## API Endpoints

The following Python API endpoints are available:

### `/api/hello`

- **Method**: GET
- **Description**: Simple hello world endpoint
- **Response**: JSON with greeting message

### `/api/cards`

- **Method**: GET
- **Description**: Returns card data with optional filtering
- **Query Parameters**:
  - `name` (optional): Filter cards by name
- **Response**: JSON with card array and metadata

### `/api/health`

- **Method**: GET
- **Description**: Health check endpoint with system information
- **Response**: JSON with system status and Python version info

## Local Development

To test Python functions locally:

1. Ensure Python 3.12 is installed
2. Install dependencies: `pip install -r requirements.txt`
3. Test individual functions: `python3 api/hello.py`

## Deployment

The Python functions are automatically deployed to Vercel when you push to the repository. The functions will be available at:

- `https://your-domain.vercel.app/api/hello`
- `https://your-domain.vercel.app/api/cards`
- `https://your-domain.vercel.app/api/health`

## Adding New Python Functions

1. Create a new `.py` file in the `/api` directory
2. Use the `BaseHTTPRequestHandler` pattern (see existing examples)
3. Handle CORS headers for browser requests
4. Add any new dependencies to `requirements.txt`

## Troubleshooting

- Ensure `runtime.txt` specifies `python-3.12`
- Check that `vercel.json` includes the Python runtime configuration
- Verify all dependencies are listed in `requirements.txt`
- Test functions locally before deploying
