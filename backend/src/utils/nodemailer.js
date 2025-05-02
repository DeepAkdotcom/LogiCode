import nodemailer from "nodemailer";

const sendVerificationMail = async (token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOSTNAME,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const mailOption = {
        from: process.env.MAILTRAP_SENDERMAIL, // sender address
        to: "dummmy@gmail.com", // list of receivers
        subject: "Verify your email ✔", // Subject line
        html: `
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center;">Verify your email address</h2>
                <p style="text-align: center;">Please click on the following link to verify your email address:</p>
                <a href="${process.env.BASE_URL}/api/v1/users/verify/${token}" style="text-align: center; display: block; padding: 10px; background-color: #4CAF50; color: #fff; border-radius: 5px; text-decoration: none;">Verify Email</a>
            </div>
        `,
    };

    await transporter.sendMail(mailOption);
};

const sendResetPasswordMail = async (resetToken) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOSTNAME,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const mailOption = {
        from: process.env.MAILTRAP_SENDERMAIL, // sender address
        to: "dummmy@gmail.com", // list of receivers
        subject: "Reset your password ✔", // Subject line
        html: `
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center;">Reset your password</h2>
                <p style="text-align: center;">Please click on the following link to reset your password:</p>
                <a href="${process.env.BASE_URL}/api/v1/users/reset/${resetToken}" style="text-align: center; display: block; padding: 10px; background-color: #4CAF50; color: #fff; border-radius: 5px; text-decoration: none;">Reset Password</a>
            </div>
        `,
    };

    await transporter.sendMail(mailOption);
};

export { sendVerificationMail, sendResetPasswordMail };