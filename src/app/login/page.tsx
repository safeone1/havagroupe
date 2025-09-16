"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useTransition } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
// import { SocialSignin, CredsSignin } from '@/lib/auth-client';
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
// import { LoginSchema, LoginSchemaType } from '@/zod/AuthSchemas';
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "@/lib/Schema";
import { CredsSignIn } from "@/lib/signIn";
import Image from "next/image";

const Login = () => {
  const [isPendingGithub] = useTransition();
  const [isPendingGoogle] = useTransition();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    await CredsSignIn(data);

    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center h-svh relative gap-4 p-4 sm:p-6">
      <Card className="w-full max-w-[450px] shadow-none sm:shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Welcome back!
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your email and password below to login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center justify-center">
          <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Field errors={errors.email?.message}>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                placeholder="example@gmail.com"
                id="email"
                type="name"
                {...register("email")}
              />
            </Field>
            <Field errors={errors.password?.message}>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                placeholder="*********"
                id="password"
                type="password"
                {...register("password")}
              />
            </Field>
            <Button
              disabled={isSubmitting}
              variant={"default"}
              className="w-full"
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Continue with credentials"
              )}
            </Button>
          </form>
          <Link className=" flex justify-center" href="/auth/forgot-password">
            Forgot Password?
          </Link>
        </CardContent>
        <CardFooter className="w-full flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2 w-full max-w-[80%]">
            <span className="h-[1px] flex-1 bg-border border" />
            <p className="px-2 text-sm">Or</p>
            <span className="h-[1px] flex-1 bg-border border" />
          </div>
          <Button
            disabled={isPendingGoogle}
            variant={"outline"}
            className="w-full gap-2"
            // onClick={async () =>
            //   startGoogleTransition(async () => await SocialSignin("google"))
            // }
          >
            {isPendingGoogle ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <FaGoogle className="h-4 w-4" />
                <span>Login with Google</span>
              </>
            )}
          </Button>
          <Button
            disabled={isPendingGithub}
            variant={"outline"}
            className="w-full gap-2"
            // onClick={async () =>
            //   startGithubTransition(async () => await SocialSignin("github"))
            // }
          >
            {isPendingGithub ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <FaGithub className="h-4 w-4" />
                <span>Login with Github</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <p className="text-sm w-full max-w-md text-center text-muted-foreground text-balance px-4">
        By clicking continue with credentials, you agree to our terms and
        conditions and <strong className="underline">privacy policy</strong>
      </p>
      <Image src="/hava_logo.svg" alt="logo" width={100} height={100} />
    </div>
  );
};

const Field = ({
  children,
  errors,
}: {
  children: React.ReactNode;
  errors: string | undefined;
}) => {
  return (
    <div className="space-y-3">
      {children}
      {errors && <p className={"text-red-500 text-sm indent-2"}>{errors}</p>}
    </div>
  );
};

export default Login;
