import { NextResponse } from "next/server";
import { checkEmailExists } from "../model/user";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  console.log(email);

  try {
    const emailExists = await checkEmailExists(email);
    console.log(emailExists);
    if (emailExists) {
      console.log("inside");
      return NextResponse.json({ emailExists: true });
    }
    return NextResponse.json({ emailExists: false });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong while fetching email",
    });
  }
}
