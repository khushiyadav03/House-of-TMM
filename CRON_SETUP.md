# Cron Job Setup for Scheduled Cover Photos

## Overview
This document explains how to set up automatic publishing of scheduled cover photos using cron jobs.

## API Endpoint
The application provides an API endpoint to publish scheduled cover photos:
```
POST /api/scheduled-jobs/publish-cover-photos
```

## Setup Options

### Option 1: Vercel Cron Jobs (Recommended)
If you're using Vercel for deployment, you can use Vercel's built-in cron job feature.

1. **Add to vercel.json**:
```json
{
  "crons": [
    {
      "path": "/api/scheduled-jobs/publish-cover-photos",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

2. **Deploy to Vercel** - The cron job will automatically start running every 5 minutes.

### Option 2: External Cron Service
Use services like:
- **Cron-job.org** (Free)
- **EasyCron** (Free tier available)
- **SetCronJob** (Free tier available)

#### Setup with cron-job.org:
1. Go to https://cron-job.org
2. Create an account
3. Add a new cron job:
   - **URL**: `https://your-domain.vercel.app/api/scheduled-jobs/publish-cover-photos`
   - **Schedule**: Every 5 minutes
   - **Method**: POST

### Option 3: Server Cron (If you have server access)
Add to your server's crontab:
```bash
# Run every 5 minutes
*/5 * * * * curl -X POST https://your-domain.vercel.app/api/scheduled-jobs/publish-cover-photos
```

## Testing the Setup

### Manual Testing
You can test the scheduled job manually by calling:
```bash
curl -X POST https://your-domain.vercel.app/api/scheduled-jobs/publish-cover-photos
```

### Check Scheduled Photos
To see what photos are scheduled:
```bash
curl https://your-domain.vercel.app/api/scheduled-jobs/publish-cover-photos
```

## Monitoring

### Logs
Check your Vercel function logs to monitor the cron job execution:
1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to "Functions" tab
4. Look for `/api/scheduled-jobs/publish-cover-photos` function logs

### Database Monitoring
You can monitor scheduled photos in your Supabase dashboard:
```sql
-- Check all scheduled photos
SELECT * FROM cover_photos WHERE status = 'scheduled' ORDER BY scheduled_date;

-- Check photos ready to publish
SELECT * FROM cover_photos 
WHERE status = 'scheduled' 
AND scheduled_date <= NOW()
ORDER BY scheduled_date;
```

## Troubleshooting

### Common Issues

1. **Cron job not running**:
   - Check if the URL is accessible
   - Verify the API endpoint returns 200 status
   - Check Vercel function logs

2. **Photos not publishing**:
   - Verify the database migration was run
   - Check if scheduled_date is in the correct format
   - Ensure the API has proper permissions

3. **Timezone issues**:
   - The system uses UTC timestamps
   - Make sure your scheduled dates are in UTC

### Debug Steps

1. **Test the API manually**:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/scheduled-jobs/publish-cover-photos
   ```

2. **Check scheduled photos**:
   ```bash
   curl https://your-domain.vercel.app/api/scheduled-jobs/publish-cover-photos
   ```

3. **Verify database schema**:
   ```sql
   -- Check if the new columns exist
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'cover_photos' 
   AND column_name IN ('status', 'scheduled_date', 'updated_at');
   ```

## Security Considerations

1. **API Protection**: Consider adding authentication to the cron job endpoint
2. **Rate Limiting**: The endpoint is designed to be called frequently
3. **Error Handling**: The endpoint includes comprehensive error handling

## Performance

- The cron job runs every 5 minutes by default
- It only processes photos that are due to be published
- The operation is lightweight and shouldn't impact performance
- Consider adjusting the frequency based on your needs (1-15 minutes recommended) 