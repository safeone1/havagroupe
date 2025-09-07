import { toast } from "sonner";
import { authClient } from "./auth-client";
import { LoginSchemaType } from "./Schema";

export const CredsSignIn = async ({ email, password }: LoginSchemaType) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/admin",
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success(
      `Login successful! Welcome ${data.user.email}. Redirecting to admin...`
    );
  }

  return data;
};
