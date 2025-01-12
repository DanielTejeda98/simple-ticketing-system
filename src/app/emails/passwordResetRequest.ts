export default function PasswordResetEmailTemplate (token: string, userName: string): string {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #ffffff!important;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password for your Simple Ticketing System account. If you made this request, please click the button below to reset your password:</p>
        <a href="${process.env.DOMAIN}/account/forgot-password/${token}" class="button">Reset Password</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="${process.env.DOMAIN}/account/forgot-password/${token}">${process.env.DOMAIN}/account/forgot-password/${token}</a></p>
        <p>If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        <p>This link will expire in <strong>1 hour</strong>.</p>
        <p>If you need any help, contact us at <a href="mailto:daviddan1998@gmail.com">daviddan1998@gmail.com</a>.</p>
        <div class="footer">
            <p>Thank you,<br>The Simple Ticketing System Team</p>
            <p><a href="www.danieltejeda.dev">www.danieltejeda.dev</a> | <a href="mailto:daviddan1998@gmail.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>

    `
}