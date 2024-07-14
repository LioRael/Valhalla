import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserAuthForm } from "@//components/auth/user-auth-form";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "Valhalla | Authentication",
  description: "Authentication page for Valhalla Hub",
};

export default async function AuthenticationPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex w-24 items-center text-lg font-medium">
          <Image
            src="/logo.png"
            alt="Valhalla"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full invert"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Valhalla is the best resource management platform
              I&rsquo;ve ever used. It&rsquo;s so intuitive and easy to use.
              &rdquo;
            </p>
            <footer className="text-sm">LioRael</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to Valhalla
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your username and password to access your account.
            </p>
          </div>
          <UserAuthForm />
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
