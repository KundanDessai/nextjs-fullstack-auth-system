
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";

type EmailType = "VERIFY" | "RESET";

interface SendEmailParams {
    email: string;
    emailType: EmailType;
    userId: string;
}

export const sendEmail = async ({
    email,
    emailType,
    userId,
}: SendEmailParams) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        let token: string;
        let tokenExpiry: Date;
        let resetLink: string;

        if (emailType === "VERIFY") {
            // Preserve the existing verification-token approach.
            token = await bcrypt.hash(userId.toString(), 10);
            tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

            await User.findByIdAndUpdate(userId, {
                verifyToken: token,
                verifyTokenExpiry: tokenExpiry,
            });

            resetLink =
                `${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(token)}`;
        } else {
            // Generate an unpredictable, single-use reset token.
            token = randomBytes(32).toString("hex");

            const hashedToken = createHash("sha256")
                .update(token)
                .digest("hex");

            tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: tokenExpiry,
            });

            resetLink =
                `${process.env.DOMAIN}/reset-password?token=${token}`;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 2525),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const subject =
            emailType === "VERIFY"
                ? "Verify your email"
                : "Reset your password";

        const actionText =
            emailType === "VERIFY"
                ? "verify your email"
                : "reset your password";

        const mailResponse = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            text: `Click this link to ${actionText}: ${resetLink}`,
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.6">
                    <h2>${subject}</h2>
                    <p>Click the button below to ${actionText}.</p>
                    <p>
                        <a href="${resetLink}"
                           style="display:inline-block;padding:12px 20px;
                           background:#4f46e5;color:#ffffff;
                           text-decoration:none;border-radius:8px">
                           ${subject}
                        </a>
                    </p>
                    <p>If you did not request this, you can ignore this email.</p>
                    ${
                        emailType === "RESET"
                            ? "<p>This link expires in 15 minutes and can only be used once.</p>"
                            : ""
                    }
                </div>
            `,
        });

        return mailResponse;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Unable to send email. Please try again later.");
    }
};
