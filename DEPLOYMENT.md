# Deployment Guide

This guide explains how to deploy the Bitespeed Chatbot Builder to various platforms.

## Prerequisites
- The project must be in a GitHub repository.
- Ensure all dependencies are in `package.json`.

## 1. Deploy to Vercel (Recommended)
Vercel has excellent support for Vite-based React apps.
1. Create a [Vercel account](https://vercel.com).
2. Click "Add New" > "Project".
3. Import your GitHub repository.
4. Vercel will automatically detect Vite. Click "Deploy".
5. Your app will be live on a `vercel.app` domain.

## 2. Deploy to Netlify
1. Create a [Netlify account](https://netlify.com).
2. Click "Add new site" > "Import from existing project".
3. Choose "GitHub" and select your repository.
4. Set the Build Command to `npm run build` and Publish directory to `dist`.
5. Click "Deploy site".

## 3. Deploy to GitHub Pages
1. Install the `gh-pages` package: `npm install gh-pages --save-dev`.
2. Add the following to your `package.json`:
   ```json
   "homepage": "https://username.github.io/repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Update `vite.config.ts` to include the base path:
   ```typescript
   export default defineConfig({
     base: '/repo-name/',
     plugins: [react()],
   })
   ```
4. Run `npm run deploy`.

## 4. Local Build and Preview
To test the production build locally:
1. Run `npm run build`.
2. Run `npm run preview`.
