export default function PasswordResetSuccessfulEmailTemplate (userName: string): string {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
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
        <h2>Password Successfully Reset</h2>
        <p>Hi ${userName},</p>
        <p>Your password for your Simple Ticketing System account has been successfully reset.</p>
        <p>If this was you, no further action is needed.</p>
        <p>If you did not reset your password, please contact our support team immediately.</p>
        <a href="mailto:daviddan1998@gmail.com"" class="button">Contact Support</a>
        <div class="footer">
            <p>Thank you,<br>The Simple Ticketing System Team</p>
            <p><a href="www.danieltejeda.dev">www.danieltejeda.dev</a> | <a href="mailto:daviddan1998@gmail.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>

    `
}