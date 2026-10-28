
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { token, password } = await request.json();

        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/i.test(token) ||
            typeof password !== "string" ||
            password.length < 8 ||
            password.length > 72
        ) {
            return NextResponse.json(
                { error: "Invalid token or password. Use a password of 8–72 characters." },
                { status: 400 }
            );
        }

        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "This reset link is invalid or has expired. Please request a new one." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successfully. You can now log in.",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        return NextResponse.json(
            { error: "Unable to reset your password. Please try again." },
            { status: 500 }
        );
    }
}
