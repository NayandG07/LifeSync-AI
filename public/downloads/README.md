# APK File Placement Instructions

## Where to Place Your APK File

To make the download functionality work, you need to place your APK file in the following location:

```
public/downloads/lifesync-ai.apk
```

## Directory Structure

Your project structure should look like this:

```
LifeSync Website/
├── public/
│   └── downloads/
│       └── lifesync-ai.apk  ← Place your APK file here
├── src/
├── package.json
└── ...other files
```

## Important Notes

1. **File Name**: The APK file must be named exactly `lifesync-ai.apk` to match the download links
2. **File Path**: Must be placed in `public/downloads/` directory
3. **Next.js Static Files**: Files in the `public` directory are served statically by Next.js
4. **Download URL**: The file will be accessible at `/downloads/lifesync-ai.apk`

## What Was Fixed

The download buttons in the following locations have been updated:

1. **Download Page** (`/download`):
   - Main download button now links to `/downloads/lifesync-ai.apk`
   - Free plan download button now works correctly

2. **Download Attributes**:
   - Added `download="lifesync-ai.apk"` attribute to force download instead of navigation

## Testing the Download

After placing your APK file in the correct location:

1. Build and run your Next.js application
2. Navigate to the download page (`/download`)
3. Click the "Download for Android" button
4. The APK file should download automatically

## File Size Considerations

- APK files can be large (typically 10-100MB+)
- Consider your hosting platform's file size limits
- You may want to host large files on a CDN for better performance