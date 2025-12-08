import { data, redirect } from "react-router";
import type { Route } from "./+types/subscribe";
import { ShopifyCustomer } from "~/lib/data/subscribe.server";
import { isValidRedirect } from "~/lib/redirect";
import * as z from "zod";

/**
 * Validates that a string contains only safe characters for Shopify tags.
 * Allows: alphanumeric, hyphens, underscores, and spaces (for titles).
 */
const safeTagStringSchema = (fieldName: string, allowSpaces = false) =>
  z
    .string(`${fieldName} is required.`)
    .min(1, `${fieldName} cannot be empty.`)
    .max(100, `${fieldName} is too long.`)
    .regex(
      allowSpaces ? /^[a-zA-Z0-9\s_-]+$/ : /^[a-zA-Z0-9_-]+$/,
      `${fieldName} contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed.`,
    );

const subscribeSchema = z.object({
  email: z.email("Please enter a valid email address."),
  variantHandle: safeTagStringSchema("Variant handle", false),
  variantTitle: safeTagStringSchema("Variant title", true),
  redirectTo: z.string().nullish(),
});

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return data(
      { error: "Method not allowed", success: false },
      { status: 405 },
    );
  }

  const form = await request.formData();

  const validationResult = subscribeSchema.safeParse({
    email: form.get("email"),
    variantHandle: form.get("variant-handle"),
    variantTitle: form.get("variant-title"),
    redirectTo: form.get("redirectTo"),
  });

  if (!validationResult.success) {
    console.error(validationResult.error);
    const firstError = validationResult.error.issues[0];
    return data({ error: firstError.message, success: false }, { status: 400 });
  }

  let {
    email,
    variantHandle,
    variantTitle,
    redirectTo: redirectUrl,
  } = validationResult.data;

  // Sanitize variant title: convert to lowercase and replace spaces with hyphens
  // This is safe because we've already validated the input contains only safe characters
  variantTitle = variantTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace one or more spaces with a single hyphen
    .replace(/--+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  const tags = [
    `back-in-stock-subscriber`,
    `${variantHandle}-${variantTitle}-back-in-stock-subscriber`,
  ];

  try {
    const customerClient = new ShopifyCustomer(context);
    const existingCustomer = await customerClient.getCustomerByEmail(email);

    if (existingCustomer) {
      const existingTags = existingCustomer.tags;
      const newTags = [...new Set([...existingTags, ...tags])];

      await customerClient.updateCustomerTags({
        id: existingCustomer.id,
        tags: newTags,
      });

      await customerClient.subscribeCustomer({
        customerId: existingCustomer.id,
      });
    } else {
      await customerClient.createAndSubscribeCustomer({
        email,
        tags,
      });
    }

    // If redirect URL exists and is valid, redirect after success (JS not loaded)
    if (redirectUrl && isValidRedirect(redirectUrl)) {
      return redirect(redirectUrl);
    }

    // Otherwise, return data for hydrated form (JS loaded)
    return data(
      {
        success: true,
        message:
          "Thanks for subscribing! We'll let you know when it's back in stock.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Subscribe action error:", error);

    return data(
      {
        error: "Something went wrong. Please try again.",
        success: false,
      },
      { status: 500 },
    );
  }
}
