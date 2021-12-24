import { getDefaultRoyaltyRecipients } from "$queries/royalty_recipients";

export async function get({ headers, locals: { q } }) {
  try {
    const { default_royalty_recipients } = await q(getDefaultRoyaltyRecipients);

    return {
      body: {
        default_royalty_recipients,
      },
      headers,
    };
  } catch (e) {
    console.log(e);
    return {
      body: {},
      status: 500,
    };
  }
}
