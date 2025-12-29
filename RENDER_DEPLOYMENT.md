# Render Deployment Guide

This guide explains how to deploy the CardanoResolve application (frontend + backend) on Render.

## Architecture

The application consists of two separate services:

1. **Frontend** (React/Vite) - Static site
2. **Backend API** (Express/Node.js) - Web service

## Prerequisites

- Render account (https://render.com)
- GitHub repository connected to Render
- MongoDB Atlas account (or other MongoDB hosting)
- Redis hosting (Render Redis or Upstash)

## Step 1: Deploy Backend API

### 1.1 Create Web Service

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `one815-api` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `1815-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

### 1.2 Set Environment Variables

Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
PORT=3000

# Database - Use MongoDB Atlas or other hosted MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/1815_prod

# Redis - Use Render Redis or Upstash
REDIS_URL=redis://username:password@host:port

# Blockfrost API
BLOCKFROST_API_KEY=your_blockfrost_api_key
BLOCKFROST_BASE_URL=https://cardano-preprod.blockfrost.io/api/v0
BLOCKFROST_NETWORK=preprod

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=CardanoResolve

# JWT & Encryption
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your_32_character_encryption_key
ENCRYPTION_ALGORITHM=aes-256-gcm

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS - Add your frontend URL
CORS_ORIGIN=https://one815.onrender.com

# QR Code Configuration
QR_CODE_BASE_URL=https://yourdomain.com/qr
QR_CODE_SIZE=200
QR_CODE_MARGIN=2

# AWS S3 (Optional - for QR code storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 1.3 Note Your Backend URL

After deployment, your backend will be available at:

```
https://one815-api.onrender.com
```

## Step 2: Deploy Frontend

### 2.1 Create Static Site

1. Go to Render Dashboard → New → Static Site
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `one815` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 2.2 Set Environment Variables

Add these environment variables in Render dashboard:

```bash
# Backend API URL - Use your actual backend URL from Step 1.3
VITE_API_BASE_URL=https://one815-api.onrender.com/api/v1

# Application Configuration
VITE_APP_NAME=CardanoResolve
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# External Services
VITE_CARDANO_NETWORK=preprod

# Application URLs - Use your actual frontend URL
VITE_APP_BASE_URL=https://one815.onrender.com
```

## Step 3: Configure CORS

After both services are deployed, update the backend's CORS configuration:

1. Go to your backend service on Render
2. Update the `CORS_ORIGIN` environment variable to include your frontend URL:
   ```
   CORS_ORIGIN=https://one815.onrender.com
   ```
3. Save and redeploy

## Step 4: Test Deployment

1. Visit your frontend URL: `https://one815.onrender.com`
2. Check browser console for errors
3. Test API endpoints:
   - Health: `https://one815-api.onrender.com/api/v1/health`
   - Features: `https://one815-api.onrender.com/api/v1/features`

## Troubleshooting

### 404 Errors on API Calls

**Problem**: Frontend shows 404 errors when calling API endpoints

**Solution**:

1. Verify `VITE_API_BASE_URL` in frontend environment variables points to correct backend URL
2. Check backend service is running and accessible
3. Verify CORS is configured correctly

### CORS Errors

**Problem**: Browser shows CORS policy errors

**Solution**:

1. Add frontend URL to backend's `CORS_ORIGIN` environment variable
2. Ensure backend service is redeployed after CORS changes

### Build Failures

**Problem**: Build fails on Render

**Solution**:

1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Ensure build commands are correct
4. Check Node.js version compatibility

### Database Connection Issues

**Problem**: Backend can't connect to MongoDB

**Solution**:

1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access (allow Render IPs or 0.0.0.0/0)
3. Verify database user credentials

### Redis Connection Issues

**Problem**: Backend can't connect to Redis

**Solution**:

1. Verify `REDIS_URL` format is correct
2. Check Redis service is running
3. Verify network access and credentials

## Free Tier Limitations

Render's free tier has some limitations:

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime per service

Consider upgrading to paid tier for production use.

## Custom Domain Setup

### Frontend Domain

1. Go to your static site settings
2. Click "Custom Domain"
3. Add your domain (e.g., `cardanoresolve.com`)
4. Update DNS records as instructed by Render
5. Update `VITE_APP_BASE_URL` environment variable

### Backend Domain

1. Go to your web service settings
2. Click "Custom Domain"
3. Add your API subdomain (e.g., `api.cardanoresolve.com`)
4. Update DNS records as instructed by Render
5. Update frontend's `VITE_API_BASE_URL` to use new domain

## Monitoring

### Health Checks

Render automatically monitors your services. Configure health check path:

- Path: `/api/v1/health`
- Expected status: 200

### Logs

View logs in Render dashboard:

1. Go to your service
2. Click "Logs" tab
3. Monitor for errors and issues

## Deployment Workflow

### Automatic Deployments

Render automatically deploys when you push to your configured branch:

1. Push changes to GitHub
2. Render detects changes
3. Builds and deploys automatically

### Manual Deployments

To manually trigger deployment:

1. Go to service in Render dashboard
2. Click "Manual Deploy"
3. Select branch and deploy

## Environment-Specific Configurations

### Development

- Use `.env` file locally
- Vite proxy handles API calls

### Production

- Use Render environment variables
- Frontend calls backend directly via full URL

## Security Best Practices

1. **Never commit sensitive data**

   - Keep `.env` files out of git
   - Use Render's environment variables

2. **Use strong secrets**

   - Generate strong JWT secrets
   - Use unique encryption keys

3. **Configure CORS properly**

   - Only allow your frontend domain
   - Don't use wildcard (\*) in production

4. **Enable HTTPS**
   - Render provides free SSL certificates
   - Ensure all API calls use HTTPS

## Support

For issues:

- Check Render documentation: https://render.com/docs
- Review application logs
- Check GitHub issues
- Contact support

## Quick Reference

### Backend Service

- **URL**: https://one815-api.onrender.com
- **Health Check**: https://one815-api.onrender.com/api/v1/health
- **Root Directory**: `1815-api`
- **Build**: `npm install && npm run build`
- **Start**: `npm start`

### Frontend Service

- **URL**: https://one815.onrender.com
- **Root Directory**: (root)
- **Build**: `npm install && npm run build`
- **Publish**: `dist`

### Key Environment Variables

- Frontend: `VITE_API_BASE_URL`
- Backend: `CORS_ORIGIN`, `MONGODB_URI`, `REDIS_URL`
