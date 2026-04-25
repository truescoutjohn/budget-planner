import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registrationSchema } from "@/schema/zod";

const validateRequest = async (req: NextRequest) => {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid or empty JSON body" },
            { status: 400 },
        );
    }

    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const validatedBody = registrationSchema.safeParse(body);

    if (!validatedBody.success) {
        return NextResponse.json({ error: JSON.parse(validatedBody.error.message)[0].message }, { status: 400 });
    }

    return validatedBody.data;
}

async function POST(req: NextRequest) {
    const response = await validateRequest(req);
    
    if(response instanceof NextResponse) {
        return response;
    }

    const { email, password } = response;

    const userExists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(userExists) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json(user, { status: 201 });
}

export { POST };