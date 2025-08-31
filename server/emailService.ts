import nodemailer from 'nodemailer';

export interface VinSearchEmailParams {
  vin: string;
  userEmail: string;
  userIp?: string;
  userAgent?: string;
  searchedAt: Date;
}

export interface ContactFormParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  userIp?: string;
  userAgent?: string;
  submittedAt?: Date;
}

// Input sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim()
    .substring(0, 1000); // Limit length to prevent abuse
}

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Create email transporter using SMTP
function createEmailTransporter() {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log("SMTP credentials not configured. Email notifications will be logged only.");
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // Can be changed to 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD // App password for Gmail
    }
  });
}

// VIN Search email notification
export async function sendVinSearchNotification(params: VinSearchEmailParams): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      // Log the VIN search when email is not configured
      console.log("VIN search logged (email not configured):", {
        vin: params.vin,
        email: params.userEmail,
        timestamp: params.searchedAt,
        ip: params.userIp
      });
      return false;
    }

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-weight: bold;">VIN Search Notification</h1>
        <p style="margin: 5px 0 0 0;">New VIN search on carsclub.ae</p>
      </div>
      
      <div style="padding: 30px; background: #f8fafc; border-left: 4px solid #1e40af;">
        <h2 style="color: #1e40af; margin-top: 0;">Search Details</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">VIN Number:</td>
            <td style="padding: 12px; font-family: monospace; border: 1px solid #cbd5e1;">${params.vin}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">User Email:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${params.userEmail}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Search Time:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${params.searchedAt.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">User IP:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${params.userIp || 'Unknown'}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">User Agent:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1; word-break: break-all;">${params.userAgent || 'Unknown'}</td>
          </tr>
        </table>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Note:</strong> This is an automated notification from the VIN Checker service. 
            Please check the database for complete vehicle information.
          </p>
        </div>
      </div>
      
      <div style="background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">Powered by carsclub.ae VIN Checker Service</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: 'info@carshistorycheck.com',
      subject: `🚗 New VIN Search: ${params.vin} - ${params.userEmail}`,
      html: emailContent
    });

    console.log(`VIN search notification sent via SMTP for ${params.vin}`);
    return true;
  } catch (error) {
    console.error("Error sending VIN search notification via SMTP:", error);
    // Log search data for manual processing
    console.log("VIN search data logged due to email failure:", {
      vin: params.vin,
      from: params.userEmail,
      timestamp: params.searchedAt
    });
    return false;
  }
}

// Contact form email notification
export async function sendContactFormNotification(formData: ContactFormParams): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const timestamp = formData.submittedAt || new Date();
    
    if (!transporter) {
      // Log the contact form when email is not configured
      console.log("Contact form logged (email not configured):", {
        from: formData.email,
        name: formData.name,
        subject: formData.subject,
        timestamp: timestamp
      });
      return false;
    }

    // Sanitize all input data
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message)
    };

    // Validate email
    if (!isValidEmail(sanitizedData.email)) {
      console.error("Invalid email provided to contact form:", sanitizedData.email);
      return false;
    }

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-weight: bold;">Contact Form Submission</h1>
        <p style="margin: 5px 0 0 0;">New message from Cars History Check</p>
      </div>
      
      <div style="padding: 30px; background: #f8fafc; border-left: 4px solid #1e40af;">
        <h2 style="color: #1e40af; margin-top: 0;">Contact Details</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Name:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${sanitizedData.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Email:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${sanitizedData.email}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Subject:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${sanitizedData.subject}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Submitted:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${timestamp.toLocaleString()}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">IP Address:</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1;">${formData.userIp || 'Unknown'}</td>
          </tr>
        </table>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">Message:</h3>
          <p style="margin: 0; color: #451a03; white-space: pre-wrap;">${sanitizedData.message}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Reply to:</strong> ${sanitizedData.email}
          </p>
        </div>
      </div>
      
      <div style="background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">Cars History Check Contact Form System</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: 'info@carshistorycheck.com',
      subject: `Contact Form: ${sanitizedData.subject}`,
      html: emailContent,
      replyTo: sanitizedData.email
    });

    console.log(`Contact form notification sent via SMTP from ${sanitizedData.email}`);
    return true;
  } catch (error) {
    console.error("Error sending contact form notification via SMTP:", error);
    // Log contact form data for manual processing
    console.log("Contact form data logged due to email failure:", {
      from: formData.email,
      name: formData.name,
      subject: formData.subject,
      timestamp: formData.submittedAt || new Date()
    });
    return false;
  }
}