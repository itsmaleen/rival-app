import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { getLoggedInUser } from "~/sessions.server";
import { supabase } from "~/superbase.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getLoggedInUser(request);
  if (user) {
    return redirect(`/${user.username}`);
  }
  return json({});
}

export async function action({ request }: ActionArgs) {
  const errors = { email: "", server: "" };
  const form = await request.formData();
  const email = form.get("email")?.toString();
  if (typeof email !== "string" || !email.match(/^\S+@\S+$/)) {
    errors.email = "Email address is invalid";
  }
  try {
    const { user, error } = await supabase.auth.signIn({
      email: email,
    });
    if (error) {
      throw error;
    }
    console.log(user);
    return json({ success: true });
  } catch (error) {
    console.log("error", error);
    errors.server = error?.message || error;
    return json(errors, { status: 500 });
  }
}

export default function Login() {
  const data = useActionData();
  const transition = useTransition();

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form className="space-y-6" action="#" method="post">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-dark focus:outline-none focus:ring-primary-dark sm:text-sm"
                  />
                  {data?.errors?.email ? (
                    <p className="mt-6 text-red-500 text-sm italic">
                      {data?.errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
                  disabled={transition.state !== "idle"}
                >
                  {transition.state !== "idle"
                    ? "Loading..."
                    : "Continue with Email"}
                </button>
                {data?.errors?.server ? (
                  <p className="mt-6 text-red-500 text-sm italic">
                    {data?.errors.server}
                  </p>
                ) : null}
                {data?.success ? (
                  <p className="mt-6 text-sm italic">
                    Please check your email for a login link.
                  </p>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
