import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { registrationSchema } from "@/schema/zod";
import userRepository from "@/utils/repository/users";
import { SALT_ROUNDS } from "@/constants/constants";
import { StatusCodes } from "http-status-codes";

const validateRequest = async (req: NextRequest) => {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const validatedBody = registrationSchema.safeParse(body);

  if (!validatedBody.success) {
    return NextResponse.json(
      {
        error:
          JSON.parse(validatedBody.error.message)?.[0]?.message ??
          "Invalid request body",
      },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  return validatedBody.data;
};

async function POST(req: NextRequest) {
  const response = await validateRequest(req);

  if (response instanceof NextResponse) {
    return response;
  }

  const { email, password } = response;

  const userExists = await userRepository.findUser(email);

  if (userExists) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepository.createUser({
    email,
    passwordHash,
  });

  if (!user) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
  return NextResponse.json(user, { status: StatusCodes.CREATED });
}

export { POST };
