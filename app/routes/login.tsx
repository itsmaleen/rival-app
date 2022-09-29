import { Form, useActionData, useTransition } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { signInUser } from "~/utils/auth";

export async function action({ request }: ActionArgs) {
  const errors = {};
  try {
    const form = await request.formData();
    const email = form.get("email");
    // validate the fields
    if (typeof email !== "string" || !email.match(/^\S+@\S+$/)) {
      errors.email = "Email address is invalid";
    }
    // return data if we have errors
    if (Object.keys(errors).length) {
      return json(errors, { status: 422 });
    }
    // otherwise create the user and redirect
    const { data, error } = await signInUser({
      email,
    });
    if (data) {
      console.log(data);
    }
    throw error;
  } catch (error) {
    console.log("error", error);
    errors.server = error?.message || error;
    return json(errors, { status: 500 });
  }
}

export default function Login() {
  const errors = useActionData();
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
                  {errors?.email ? (
                    <p className="text-red-500 text-xs italic">
                      {errors.email}
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
                {errors?.server ? (
                  <p className="text-red-500 text-xs italic">{errors.server}</p>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
