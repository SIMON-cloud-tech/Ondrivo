const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Use Resend's default testing domain (works for emails to yourself)
const FROM_EMAIL = 'onboarding@resend.dev';
const FROM_NAME = 'Energen Solar';

const sendOTPEmail = async (email, otp, purpose = 'password reset') => {
  console.log(`📧 Sending OTP to ${email}: ${otp}`);

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,  // You can ONLY send to YOUR OWN email (simonmbithi143@gmail.com)
      subject: `Energen - ${purpose.charAt(0).toUpperCase() + purpose.slice(1)} OTP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a2a6c;">☀️ Energen Solar</h2>
          <p>Your OTP code for <strong>${purpose}</strong> is:</p>
          <h1 style="letter-spacing: 8px; background: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px;">
            ${otp}
          </h1>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, ignore this email.</p>
          <hr />
          <p style="color: #888; font-size: 12px;">Energen Systems &amp; General Supplies Ltd.</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Email sent:', data);
    return data;
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    throw err;
  }
};

module.exports = { sendOTPEmail };