const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApprovalEmail = async (email, firstName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Approved",
      html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Approved</title>
            <style>
                @media only screen and (max-width: 480px) {
                    .container {
                        margin: 10px auto !important;
                        border-radius: 8px !important;
                    }
                    .header {
                        padding: 25px 15px !important;
                    }
                    .header h1 {
                        font-size: 24px !important;
                    }
                    .body-content {
                        padding: 25px 20px !important;
                    }
                    .body-content h2 {
                        font-size: 18px !important;
                    }
                    .body-content p {
                        font-size: 15px !important;
                    }
                    .cta-button {
                        width: 100% !important;
                        display: block !important;
                        padding: 12px 0 !important;
                        box-sizing: border-box;
                    }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333; text-align: left; -webkit-font-smoothing: antialiased;">

            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                
                <tr>
                    <td class="header" style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">AltLearn</h1>
                        <p style="margin: 5px 0 0 0; color: #bfdbfe; font-size: 14px;">Your Learning Management Platform</p>
                    </td>
                </tr>

                <tr>
                    <td class="body-content" style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Hello ${firstName},</h2>
                        
                        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.8; color: #475569;">
                            We are pleased to inform you that your registration request has been reviewed and <strong>approved</strong> by the administrator. Your account is now fully active.
                        </p>
                        
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; color: #475569;">
                            You can now access your dashboard, explore your assigned courses, and start learning right away!
                        </p>

                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 30px auto; width: 100%; max-width: 280px;">
                            <tr>
                                <td style="border-radius: 8px; background-color: #2563eb; text-align: center;">
                                    <a href="http://localhost:5173/login" target="_blank" class="cta-button" style="background-color: #2563eb; border: 1px solid #2563eb; border-radius: 8px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; padding: 12px 36px; text-decoration: none; transition: background-color 0.2s ease;">
                                        Log In to Your Account
                                    </a>
                                </td>
                            </tr>
                        </table>
            </table>

        </body>
        </html>
      `,
    });

    console.log("Approval email sent");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

module.exports = {
  sendApprovalEmail,
};