const BRANDING = {
  projectName: "Maven",

  superUserName: "maven",

  urls: {
    base: "mavennft.io",
    www: "www.mavennft.io",
    protocol: "https://mavennft.io",
    external: {
      instagram: "https://www.instagram.com/maven_nft/",
      twitter: "https://twitter.com/maven_nft",
      telegram: "https://t.me/maven_nft",
      blog: "https://blog.mavennft.io/",
    },
  },

  meta: {
    title: "Maven",
    keywords: "Bitcoin Asset Backed NFTs",
    description: "An asset backed NFT marketplace",
    image: "https://mavennft.io/splash.png",
    url: "https://mavennft.io/",

    twitter: {
      card: "summary_large_image",
      creator: "@maven",
      site: "@maven",
    },

    artwork: (art) => ({
      title: `Maven - ${art.title}`,
      image: `/api/ipfs/${art.filename}`,
      url: `https://mavennft.io/a/${art.slug}`,
    }),
  },

  emails: {
    support: "support@mavennft.io",
  },
};

export default BRANDING;
