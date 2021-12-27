const BRANDING = {
  projectName: 'JungleLab',
  
  superUserName: 'junglelab',
  
  urls: {
    base: 'junglelab.io',
    www: 'www.junglelab.io',
    protocol: 'https://junglelab.io',
    external: {
      twitter: 'https://twitter.com/raretoshi',
      telegram: 'https://t.me/raretoshi',
      blog: 'https://junglelab.net',
    }
  },

  meta: {
      title: 'JungleLab',
      keywords: "Bitcoin Liquid NFT Video,Music,Art",
      description: "Upload, collect, and transact rare digital art on the Liquid Network",
        image: 'https://raretoshi.com/splash.png',
        url: 'https://junglelab.io/',

      twitter: {
        card: 'summary_large_image',
        creator: '@junglelab',
        site: '@junglelab',
      },
    
    artwork: (art) => ({
      title: `JungleLab - ${art.title}`,
      image: `/api/ipfs/${art.filename}`,
      url: `https://junglelab.io/a/${art.slug}`,
    })
    
  },

  emails: {
    support : 'support@junglelab.io'
  }
};

export default BRANDING;
