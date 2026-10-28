
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Please provide your email address." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        // Return the same response whether or not the account exists.
        // This avoids revealing registered email addresses.
        if (user) {
            await sendEmail({
                email: user.email,
                emailType: "RESET",
                userId: user._id.toString(),
            });
        }

        return NextResponse.json({
            success: true,
            message:
                "If an account exists for that email, you will receive a password reset link.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        return NextResponse.json(
            { error: "Unable to process your request. Please try again later." },
            { status: 500 }
        );
    }
}
