const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { firstName, email, answers } = data;

    // Validate required fields
    if (!firstName || !email || !answers) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Store lead data (you can integrate with your CRM here)
    const leadData = {
      firstName,
      email,
      targetBand: answers[1],
      timeline: answers[2],
      weakSection: answers[3],
      experience: answers[4],
      studyTime: answers[5],
      challenge: answers[6],
      timestamp: new Date().toISOString(),
    };

    // Log the lead data (in production, save to database)
    console.log('New lead captured:', leadData);

    // Generate personalized PDF content
    const pdfContent = generatePDFContent(leadData);

    // Send confirmation email with PDF
    await sendConfirmationEmail(email, firstName, pdfContent, leadData);

    // Send notification to admin
    await sendAdminNotification(leadData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Lead captured successfully',
        leadId: generateLeadId()
      }),
    };

  } catch (error) {
    console.error('Error processing quiz submission:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process quiz submission'
      }),
    };
  }
};

function generatePDFContent(leadData) {
  // This would generate the actual PDF content
  // For now, return a placeholder
  return {
    targetBand: leadData.targetBand,
    timeline: getTimelineText(leadData.timeline),
    weakSection: leadData.weakSection,
    studyTime: getStudyTimeText(leadData.studyTime),
    challenge: leadData.challenge,
  };
}

function getTimelineText(timeline) {
  switch(timeline) {
    case 'urgent': return '2-4 Week Intensive';
    case 'moderate': return '6-8 Week Standard';
    case 'relaxed': return '12+ Week Comprehensive';
    default: return '6-Week Standard';
  }
}

function getStudyTimeText(studyTime) {
  switch(studyTime) {
    case 'minimal': return '30-60 minutes daily';
    case 'moderate': return '1-2 hours daily';
    case 'intensive': return '2+ hours daily';
    default: return '1-2 hours daily';
  }
}

async function sendConfirmationEmail(email, firstName, pdfContent, leadData) {
  const emailParams = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: generateEmailHTML(firstName, pdfContent, leadData),
        },
        Text: {
          Charset: 'UTF-8',
          Data: generateEmailText(firstName, pdfContent, leadData),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Your Personalized IELTS Study Plan is Ready, ${firstName}! 📚`,
      },
    },
    Source: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
  };

  try {
    await sesClient.send(new SendEmailCommand(emailParams));
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

async function sendAdminNotification(leadData) {
  const emailParams = {
    Destination: {
      ToAddresses: [process.env.ADMIN_EMAIL || 'admin@yourdomain.com'],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `New IELTS Quiz Lead:
Name: ${leadData.firstName}
Email: ${leadData.email}
Target Band: ${leadData.targetBand}
Timeline: ${leadData.timeline}
Weak Section: ${leadData.weakSection}
Challenge: ${leadData.challenge}
Timestamp: ${leadData.timestamp}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New IELTS Quiz Lead - ' + leadData.firstName,
      },
    },
    Source: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
  };

  try {
    await sesClient.send(new SendEmailCommand(emailParams));
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

function generateEmailHTML(firstName, pdfContent, leadData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your IELTS Study Plan</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .cta-button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Personalized IELTS Study Plan is Ready! 🎉</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>Congratulations on taking the first step toward your IELTS success!</p>
          
          <div class="highlight">
            <h3>📊 Your Assessment Results:</h3>
            <ul>
              <li><strong>Target Band:</strong> ${leadData.targetBand}</li>
              <li><strong>Timeline:</strong> ${pdfContent.timeline}</li>
              <li><strong>Weak Section:</strong> ${pdfContent.weakSection}</li>
              <li><strong>Study Time:</strong> ${pdfContent.studyTime}</li>
              <li><strong>Biggest Challenge:</strong> ${pdfContent.challenge}</li>
            </ul>
          </div>
          
          <p>I've created a personalized study plan specifically for your situation. This isn't just another generic guide—it's tailored to help you reach Band ${leadData.targetBand} efficiently.</p>
          
          <p><strong>What you'll find in your study plan:</strong></p>
          <ul>
            <li>Week-by-week roadmap for your ${pdfContent.timeline.toLowerCase()} timeline</li>
            <li>Focus on improving your ${pdfContent.weakSection} section</li>
            <li>Daily study schedule that fits your ${pdfContent.studyTime.toLowerCase()} availability</li>
            <li>Common mistakes to avoid (especially relevant to your situation)</li>
            <li>Bonus prep checklist to get started immediately</li>
          </ul>
          
          <p><strong>Quick Win for This Week:</strong></p>
          <p>Since you mentioned ${pdfContent.challenge} as your biggest obstacle, here's your first action step: Focus on building a strong foundation in ${pdfContent.weakSection} with 30 minutes of daily practice. This single change will make a noticeable difference in your practice tests within 7 days.</p>
          
          <p><strong>Ready to take the next step?</strong></p>
          <p>I'm offering a free 15-minute consultation to help you get started with your study plan. We'll discuss your specific challenges and create an action plan for the next few weeks.</p>
          
          <a href="https://calendly.com/your-consultation" class="cta-button">Book Your Free Consultation</a>
          
          <p>Questions about your study plan? Just reply to this email—I read every response personally.</p>
          
          <p>To your IELTS success,<br>
          [Your Name]<br>
          IELTS Success Coach</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(firstName, pdfContent, leadData) {
  return `
Hi ${firstName},

Your Personalized IELTS Study Plan is Ready! 🎉

Congratulations on taking the first step toward your IELTS success!

Your Assessment Results:
- Target Band: ${leadData.targetBand}
- Timeline: ${pdfContent.timeline}
- Weak Section: ${pdfContent.weakSection}
- Study Time: ${pdfContent.studyTime}
- Biggest Challenge: ${pdfContent.challenge}

I've created a personalized study plan specifically for your situation. This isn't just another generic guide—it's tailored to help you reach Band ${leadData.targetBand} efficiently.

What you'll find in your study plan:
- Week-by-week roadmap for your ${pdfContent.timeline.toLowerCase()} timeline
- Focus on improving your ${pdfContent.weakSection} section
- Daily study schedule that fits your ${pdfContent.studyTime.toLowerCase()} availability
- Common mistakes to avoid (especially relevant to your situation)
- Bonus prep checklist to get started immediately

Quick Win for This Week:
Since you mentioned ${pdfContent.challenge} as your biggest obstacle, here's your first action step: Focus on building a strong foundation in ${pdfContent.weakSection} with 30 minutes of daily practice. This single change will make a noticeable difference in your practice tests within 7 days.

Ready to take the next step?
I'm offering a free 15-minute consultation to help you get started with your study plan. We'll discuss your specific challenges and create an action plan for the next few weeks.

Book your consultation: https://calendly.com/your-consultation

Questions about your study plan? Just reply to this email—I read every response personally.

To your IELTS success,
[Your Name]
IELTS Success Coach
  `;
}

function generateLeadId() {
  return 'IELTS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}