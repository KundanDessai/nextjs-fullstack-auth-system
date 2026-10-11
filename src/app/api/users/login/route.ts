import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        console.log(reqBody);

        //check if user exists
        const user = await User.findOne({email}) // const user stores data stored in the db
        if(!user){
            return NextResponse.json({error: "User does not exists"}, {status: 400})
        }

        //check if password is correct
        const validPassword = await bcrypt.compare(password, user.password) //user.password is coming up from the database

        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        
        // create a token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })

        const response = NextResponse.json({
            message: "Login Successfull",
            success: true,
        })

        response.cookies.set("token", token, {httpOnly:true})

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
