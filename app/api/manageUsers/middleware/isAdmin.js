import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]/options";

export default async function isAdmin(req, res) {
  const session = await getServerSession(options);

  if (
    !session ||
    session.user.role !== "admin" ||
    session.user.role == "Admin"
  ) {
    return false;
  }

  return true;
}
