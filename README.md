# IELTS Lead Generation Quiz - Netlify Deployment

A high-converting IELTS coaching lead generation quiz with personalized PDF delivery, built with Erik Kennedy's design principles and optimized for paid traffic.

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy from GitHub (Recommended)

1. **Fork this repository** to your GitHub account
2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select this repository
   - Deploy!

### Option 2: Deploy from ZIP

1. **Download the files** as a ZIP
2. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the ZIP file
   - Your site will be deployed instantly!

## ⚙️ Configuration

### 1. Environment Variables

Set these in your Netlify dashboard under Site Settings > Environment Variables:

```bash
# AWS SES Configuration (for email sending)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Analytics (optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=1234567890
```

### 2. Update Contact Information

Edit these files to add your contact details:

- **index.html**: Update consultation and masterclass links
- **netlify/functions/submit-quiz.js**: Update email templates with your information
- **pdf-template.html**: Add your branding and contact information

### 3. Customize Quiz Questions

Modify the quiz questions in `index.html` to match your specific audience and coaching approach.

## 📧 Email Setup

### AWS SES Setup

1. **Create AWS Account** and set up SES
2. **Verify your domain** in SES console
3. **Create IAM user** with SES permissions
4. **Add credentials** to Netlify environment variables

### Alternative: Use Netlify Forms

If you prefer not to use AWS SES, you can use Netlify Forms:

1. **Add `netlify` attribute** to your form in `index.html`
2. **Remove the custom function** and use Netlify's built-in form handling
3. **Set up email notifications** in Netlify dashboard

## 📊 Analytics Setup

### Google Analytics 4

1. **Create GA4 property** in Google Analytics
2. **Get your Measurement ID**
3. **Replace `GA_MEASUREMENT_ID`** in `index.html`
4. **Set up conversion goals** for quiz completion and lead capture

### Facebook Pixel

1. **Create Facebook Pixel** in Facebook Business Manager
2. **Get your Pixel ID**
3. **Replace `YOUR_PIXEL_ID`** in `index.html`
4. **Set up conversion events** in Facebook Ads Manager

## 🎯 Testing

### Before Launch

1. **Test quiz functionality** on mobile and desktop
2. **Test email delivery** with a test submission
3. **Verify analytics tracking** is working
4. **Check PDF generation** (if implemented)

### A/B Testing Ideas

- Quiz length (5 vs 7 questions)
- Lead capture timing (before vs after results)
- CTA button copy and positioning
- Email subject lines

## 📈 Optimization

### Performance

- **Page Speed**: Optimize images and minimize JavaScript
- **Mobile Experience**: Ensure perfect mobile functionality
- **Loading Times**: Test on slow connections

### Conversion

- **Trust Signals**: Add testimonials and security badges
- **Urgency**: Add countdown timers or limited-time offers
- **Social Proof**: Include success stories and statistics

## 🛠 Customization

### Branding

- **Colors**: Update CSS variables in `index.html`
- **Fonts**: Change Google Fonts import
- **Logo**: Add your logo to the hero section
- **Contact Info**: Update all contact information

### Content

- **Quiz Questions**: Modify questions for your audience
- **PDF Template**: Customize the study plan content
- **Email Sequences**: Adapt email content to your voice
- **CTAs**: Update call-to-action buttons and links

## 📞 Support

### Common Issues

1. **Quiz not working**: Check browser console for JavaScript errors
2. **Emails not sending**: Verify AWS SES configuration
3. **Analytics not tracking**: Check if tracking codes are properly installed
4. **Mobile issues**: Test on actual devices, not just browser dev tools

### Getting Help

- Check the browser console for error messages
- Test with different browsers and devices
- Verify all environment variables are set correctly
- Check Netlify function logs in the dashboard

## 🚀 Launch Checklist

- [ ] Environment variables configured
- [ ] Contact information updated
- [ ] Analytics tracking verified
- [ ] Email delivery tested
- [ ] Mobile experience optimized
- [ ] Quiz functionality tested
- [ ] PDF generation working (if implemented)
- [ ] A/B testing framework ready
- [ ] Backup systems in place

## 📊 Success Metrics

Track these key performance indicators:

- **Quiz Completion Rate**: Target 65-85%
- **Email Capture Rate**: Target 80-90%
- **Cost Per Lead**: Track and optimize
- **Conversion to Customers**: Monitor long-term success

## 🔄 Updates and Maintenance

### Regular Tasks

- Monitor conversion rates weekly
- Update content monthly
- Test functionality quarterly
- Review and optimize based on data

### Scaling

- Start with small traffic volumes
- Optimize based on performance data
- Scale up successful campaigns
- A/B test continuously

---

**Ready to launch?** Deploy to Netlify and start capturing high-quality IELTS coaching leads!

For questions or support, check the implementation guide or reach out to the development team.