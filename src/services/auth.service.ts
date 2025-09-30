import { sendEvent } from "../events/producer";

export async function registerUserService(email: string) {
  // Later: save user to Postgres
  await sendEvent("user.registered", { email });

  return { message: "User registered, event published", email };
}
