import { toast } from "sonner";
import { authClient } from "./auth-client";
import { LoginSchemaType } from "./Schema";
import { set } from "better-auth";

export const CredsSignIn = async ({ email, password }: LoginSchemaType) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/admin",
  });

  if (error) {
    toast.error(error.message);
  }

  return data;
};
