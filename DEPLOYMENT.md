# Deployment Guide

This guide will help you deploy your 3D Birthday App to GitHub and Firebase Hosting.

## 1. GitHub (Source Control)

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit - 3D Birthday App"
    ```

2.  **Push to GitHub**:
    -   Create a new repository on GitHub (e.g., `birthday-3d-dimension`).
    -   Run the commands shown by GitHub, typically:
    ```bash
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/birthday-3d-dimension.git
    git push -u origin main
    ```

## 2. Firebase Hosting (Live Website)

You mentioned you want to host on Firebase.

1.  **Install Firebase Tools** (if not installed):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login**:
    ```bash
    firebase login
    ```

3.  **Initialize Project**:
    ```bash
    firebase init hosting
    ```
    -   **Select project**: Create a new one or use an existing one.
    -   **"What do you want to use as your public directory?"**: Type `dist` (This is crucial! Vite builds to `dist`).
    -   **"Configure as a single-page app?"**: Type `y` (Yes).
    -   **"Set up automatic builds and deploys with GitHub?"**: Optional (Type `N` for now to keep it simple).
    -   **"File dist/index.html already exists. Overwrite?"**: Type `N` (No, do not overwrite our built file).

4.  **Deploy**:
    ```bash
    npm run build
    firebase deploy
    ```

5.  **Done!** Firebase will give you a URL (e.g., `https://your-project.web.app`) to share.

## 3. Troubleshooting

-   **Build Failures**: If `npm run build` fails, check the error log.
-   **Blank Page**: If the deployed site is blank, ensuring you selected `dist` as the public directory is the most common fix.
-   **Routing 404s**: If refreshing on a sub-page (like `/globe`) gives a 404, ensure you answered **Yes** to "Configure as a single-page app" during `firebase init`.
