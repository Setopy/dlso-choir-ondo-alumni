// src/app/api/send-newsletter/route.ts

import { NextRequest, NextResponse } from 'next/server'

// Option 1: SendGrid (Recommended)
import sgMail from '@sendgrid/mail'

// Option 2: Nodemailer (Free alternative) 
import nodemailer from 'nodemailer'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface Recipient {
  email: string
  name: string
}

interface NewsletterRequest {
  subject: string
  content: string
  recipients: Recipient[]
  segment: string
}

export async function POST(request: NextRequest) {
  try {
    const { subject, content, recipients, segment }: NewsletterRequest = await request.json()

    // Validate input
    if (!subject || !content || !recipients?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send emails using SendGrid (Option 1 - Recommended)
    if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid(subject, content, recipients)
    } 
    // Send emails using Nodemailer (Option 2 - Free)
    else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await sendWithNodemailer(subject, content, recipients)
    } 
    // No email service configured
    else {
      console.log('📧 DEMO MODE - Newsletter would be sent to:', recipients.length, 'recipients')
      console.log('Subject:', subject)
      console.log('Segment:', segment)
      
      // In demo mode, just return success
      return NextResponse.json({ 
        success: true, 
        message: `Demo: Newsletter would be sent to ${recipients.length} recipients`,
        recipients: recipients.length
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Newsletter sent to ${recipients.length} recipients`,
      recipients: recipients.length
    })

  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}

// SendGrid Implementation (Professional)
async function sendWithSendGrid(subject: string, content: string, recipients: Recipient[]) {
  const htmlContent = generateEmailHTML(subject, content)
  
  // Batch send to avoid rate limits
  const batchSize = 50
  const batches = []
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    batches.push(recipients.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    const msg = {
      to: batch.map(r => ({ email: r.email, name: r.name })),
      from: {
        email: process.env.FROM_EMAIL || 'noreply@dlsondochoiralumni.netlify.app',
        name: 'DLSO Alumni Team'
      },
      subject,
      text: content,
      html: htmlContent,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      },
      mailSettings: {
        bypassListManagement: { enable: false }
      }
    }

    await sgMail.sendMultiple(msg)
    
    // Add delay between batches to respect rate limits
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

// Nodemailer Implementation (Free alternative)
async function sendWithNodemailer(subject: string, content: string, recipients: Recipient[]) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // App password, not regular password
    }
  })

  const htmlContent = generateEmailHTML(subject, content)

  // Send to recipients in batches to avoid spam detection
  const batchSize = 10
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)
    
    const mailOptions = {
      from: {
        name: 'DLSO Alumni Team',
        address: process.env.EMAIL_USER!
      },
      bcc: batch.map(r => r.email), // Use BCC for privacy
      subject,
      text: content,
      html: htmlContent
    }

    await transporter.sendMail(mailOptions)
    
    // Add delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

// Generate professional HTML email template
function generateEmailHTML(subject: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b, #3b82f6); padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✨ DLSO Alumni Newsletter</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ondo Region & Beyond</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; margin-bottom: 20px;">${subject}</h2>
          
          <div style="white-space: pre-line; margin: 25px 0; font-size: 16px; line-height: 1.8;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://dlsondochoiralumni.netlify.app" 
               style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Visit Alumni Platform
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <div style="margin-bottom: 20px;">
            <a href="https://dlsondochoiralumni.netlify.app" style="color: #3b82f6; text-decoration: none; margin: 0 15px;">🏠 Alumni Platform</a>
            <a href="https://dlsondochoiralumni.netlify.app/memories" style="color: #3b82f6; text-decoration: none; margin: 0 15px;">📸 Share Memories</a>
            <a href="https://dlsondochoiralumni.netlify.app/prayers" style="color: #3b82f6; text-decoration: none; margin: 0 15px;">🙏 Prayer Requests</a>
          </div>
          
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            You're receiving this because you're part of our DLSO Alumni community.
          </p>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">
            <a href="#" style="color: #6b7280;">Unsubscribe</a> | 
            <a href="#" style="color: #6b7280;">Update Preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Newsletter API Ready',
    services: {
      sendgrid: !!process.env.SENDGRID_API_KEY,
      nodemailer: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
    }
  })
}