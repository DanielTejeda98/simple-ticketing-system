import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

export type mailOptions = {
    to: string,
    subject: string,
    html: string
}

export const sendMail = (options: mailOptions) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        ...options
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error)
        } else {
            console.log("Email sent: ", info.response)
        }
    })
}