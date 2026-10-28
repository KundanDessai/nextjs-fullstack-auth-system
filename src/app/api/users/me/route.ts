
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        await connect();

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const user = await User.findById(userId).select(
            "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User found successfully.",
            data: user,
        });
    } catch (error: unknown) {
        console.error("Get user details error:", error);

        return NextResponse.json(
            { error: "Unable to retrieve user details." },
            { status: 401 }
        );
    }
}
