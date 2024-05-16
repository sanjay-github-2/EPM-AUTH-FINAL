import {
  checkEmailExists,
  createssoUser,
  getUserByEmail,
  updateLastLoggedIn,
} from "../../model/user";

import GitHubProvider from "next-auth/providers/github";

const githubProvider = GitHubProvider({
  async profile(profile) {
    try {
      const userExists = await checkEmailExists(profile.email);

      if (!userExists) {
        const newUser = await createssoUser(profile);
        await updateLastLoggedIn(newUser.email);
        return newUser;
      }

      await updateLastLoggedIn(profile.email);
      return await getUserByEmail(profile.email);
    } catch (err) {
      return null;
    }
  },
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
});

export default githubProvider;
