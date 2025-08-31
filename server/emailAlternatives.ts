import nodemailer from 'nodemailer';

export interface VinSearchEmailParams {
  vin: string;
  userEmail: string;
  userIp?: string;
  userAgent?: string;
  searchedAt: Date;
}

// Option 1: SMTP Email (works with Gmail, Outlook, any email provider)
export async function sendViaSMTP(params: VinSearchEmailParams): Promise<boolean> {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log("SMTP credentials not configured. Skipping email notification.");
    return false;
  }

  try {
    // Create transporter for Gmail (can be configured for other providers)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'outlook', 'yahoo', etc.
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD // App password for Gmail
      }
    });

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
    console.error('Failed to send SMTP email:', error);
    return false;
  }
}

// Option 2: Console notification with detailed logging
export async function sendViaWebhook(params: VinSearchEmailParams): Promise<boolean> {
  try {
    // Create detailed console notification for admin monitoring
    const adminNotification = {
      type: 'vin_search_alert',
      timestamp: params.searchedAt.toISOString(),
      priority: 'high',
      message: `New VIN Search: ${params.vin} by ${params.userEmail}`,
      data: {
        vin: params.vin,
        userEmail: params.userEmail,
        userIp: params.userIp,
        userAgent: params.userAgent,
        searchedAt: params.searchedAt.toISOString()
      }
    };

    console.log('📧 VIN SEARCH ALERT:', JSON.stringify(adminNotification, null, 2));
    console.log(`🚗 User ${params.userEmail} searched VIN: ${params.vin} at ${params.searchedAt.toLocaleString()}`);
    
    // If webhook URL is configured, try to send external notification
    if (process.env.WEBHOOK_URL) {
      const response = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.WEBHOOK_SECRET && { 'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}` })
        },
        body: JSON.stringify(adminNotification)
      });

      if (response.ok) {
        console.log(`VIN search webhook sent for ${params.vin}`);
      } else {
        console.error('Webhook failed:', response.status, response.statusText);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

// Option 3: Log to file (simple fallback)
export async function logToFile(params: VinSearchEmailParams): Promise<boolean> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const logEntry = {
      timestamp: params.searchedAt.toISOString(),
      vin: params.vin,
      userEmail: params.userEmail,
      userIp: params.userIp,
      userAgent: params.userAgent
    };

    const logFile = path.join(process.cwd(), 'vin-searches.log');
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine);
    console.log(`VIN search logged to file for ${params.vin}`);
    return true;
  } catch (error) {
    console.error('Failed to log to file:', error);
    return false;
  }
}

// Main notification function with multiple fallbacks
export async function sendVinSearchNotification(params: VinSearchEmailParams): Promise<boolean> {
  // Try SMTP first
  const smtpSuccess = await sendViaSMTP(params);
  if (smtpSuccess) return true;

  // Try webhook as backup
  const webhookSuccess = await sendViaWebhook(params);
  if (webhookSuccess) return true;

  // Log to file as final fallback
  return await logToFile(params);
}