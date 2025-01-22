export default function WelcomeEmailTemplate (userName: string): string {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to [Company/Product Name]</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
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
            text-align: center;
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
        <h1>Welcome to Simple Ticketing System!</h1>
        <p>Hi ${userName},</p>
        <p>We're excited to have you on board! Get ready to explore and enjoy all the features we have to offer.</p>
        <p>Click below to get started:</p>
        <a href="${process.env.DOMAIN}" class="button">Get Started</a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <div class="footer">
            <p>Thank you for joining us,<br>The Simple Ticketing System Team</p>
            <p><a href="www.danieltejeda.dev">www.danieltejeda.dev</a> | <a href="mailto:daviddan1998@gmail.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>`
}