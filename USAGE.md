# CP Rating Predictor - How to Use

## Quick Start Guide

### 1. Open the Website
- Open `index.html` in your web browser
- For best experience, use Chrome, Firefox, or Edge
- Make sure JavaScript is enabled

### 2. Select Platform
- Click on either **CodeChef** or **CodeForces** button
- CodeChef button: Convert CodeChef rating → CodeForces rating
- CodeForces button: Convert CodeForces rating → CodeChef rating

### 3. Enter Your Rating
- Input your current rating (0-4000)
- Press Enter or click "Predict Rating" button
- Wait for the ML animation to complete (5-6 seconds)

### 4. View Results
- See your predicted rating with tier classification
- Explore the interactive charts and analytics
- Click "Try Another Platform" to test different ratings

## Troubleshooting

### If predictions are not working:

1. **Check Browser Console**
   - Press F12 to open Developer Tools
   - Look for any error messages in the Console tab
   - Refresh the page and try again

2. **Try the Test Version**
   - Open `test.html` for a simplified version
   - This basic version should always work
   - If this works, the issue is with the main interface

3. **Common Issues:**
   - **No response when clicking buttons**: Check if JavaScript is enabled
   - **Stuck on loading**: Wait 6 seconds, or refresh the page
   - **Charts not showing**: Update your browser to latest version
   - **Mobile issues**: Use portrait orientation and refresh

4. **Manual Calculation**
   If the website isn't working, you can calculate manually:
   
   **CodeChef → CodeForces:**
   ```
   CodeForces Rating = (CodeChef Rating × 0.8316) - 32.63
   ```
   
   **CodeForces → CodeChef:**
   ```
   CodeChef Rating = (CodeForces Rating + 32.63) ÷ 0.8316
   ```

## Features Working Status

✅ **Working Features:**
- Platform selection buttons
- Rating input validation
- Basic ML prediction calculation
- Result display with tier classification

🔄 **May Need Refresh:**
- Animated loading screen
- Interactive charts and graphs
- Smooth transitions

❌ **Known Issues:**
- Some animations may not work on older browsers
- Charts require SVG support

## Browser Compatibility

✅ **Fully Supported:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

⚠️ **Limited Support:**
- Older browser versions (basic functionality only)

❌ **Not Supported:**
- Internet Explorer

## Quick Test

1. Click **CodeChef** button
2. Enter `1500` in the rating field
3. Click **Predict Rating**
4. Expected result: ~1215 CodeForces rating (Pupil tier)

If this works, the core functionality is running correctly!
