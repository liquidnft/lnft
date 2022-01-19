const BRANDING = {
  projectName: "Raretoshi",

  superUserName: "raretoshi",

  urls: {
    base: "raretoshi.com",
    www: "www.raretoshi.com",
    protocol: "https://raretoshi.com",
    external: {
      twitter: "https://twitter.com/raretoshi",
      telegram: "https://t.me/raretoshi",
      blog: "https://blog.raretoshi.com/",
      facebook: "https://facebook.com/raretoshi",
			instagram: "https://www.instagram.com/raretoshi/",
			discord: "https://discord.gg/XUxPs3YnQz",
    },
  },

  meta: {
    title: "Raretoshi",
    keywords: "Bitcoin Liquid NFT Art",
    description:
      "Upload, collect, and transact rare digital art on the Liquid Network",
    image: "https://raretoshi.com/splash.png",
    url: "https://raretoshi.com/",

    twitter: {
      card: "summary_large_image",
      creator: "@raretoshi",
      site: "@raretoshi",
    },

    artwork: (art) => ({
      title: `Raretoshi - ${art.title}`,
      image: `/api/ipfs/${art.filename}`,
      url: `https://raretoshi.com/a/${art.slug}`,
    }),
  },

  emails: {
    support: "support@raretoshi.com",
  },
};

export default BRANDING;
