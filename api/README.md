# Python API Functions for Vercel

This directory contains Python serverless functions that can be deployed to Vercel alongside the main React application.

## Setup

The Python runtime is configured in `vercel.json` with the following settings:

```json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.12"
    }
  }
}
```

## Available Endpoints

### `/api/hello`
- **Method**: GET
- **Description**: Simple hello world endpoint to test Python functionality
- **Response**: JSON with greeting message

### `/api/cards`
- **Method**: GET
- **Description**: Returns card data for the KONIVRER deck database
- **Query Parameters**:
  - `name` (optional): Filter cards by name
- **Response**: JSON with cards array and metadata

## Local Development

To test the Python functions locally:

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the test script:
   ```bash
   python3 test_python.py
   ```

## Deployment

When you deploy to Vercel, the Python functions will be automatically available at:
- `https://your-domain.vercel.app/api/hello`
- `https://your-domain.vercel.app/api/cards`

## Adding New Functions

1. Create a new `.py` file in the `api/` directory
2. Follow the Vercel Python function format with a `handler` class
3. The function will be automatically available at `/api/filename`

## Dependencies

Add any Python packages you need to `requirements.txt`. Common packages for web APIs:

```
flask==2.3.3
fastapi==0.104.1
requests==2.31.0
pymongo==4.6.0
psycopg2-binary==2.9.9
```