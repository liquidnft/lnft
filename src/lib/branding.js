const BRANDING = {
  projectName: 'Mintalio',
  
  superUserName: 'mintalio',
  
  urls: {
    base: 'mintalio.com',
    www: 'www.mintalio.com',
    protocol: 'https://mintalio.com',
    external: {
      twitter: 'https://twitter.com/mintalionft',
      telegram: 'https://t.me/mintalio',
      blog: 'https://medium.com/@MintalioNFT',
    }
  },
  
  meta: {
    general: {
      title: 'Mintalio',
      image: 'https://mintalio.com/branding/splash.png',
      url: 'https://mintalio.com/',
      twitter: {
        card: 'summary_large_image',
        creator: '@mintalio',
        site: '@mintalio',
      },
      logo: {
        header: {
          path: '/branding/logo-default.svg',
          class: 'w-14 lg:w-14'
        },
        footer: {
          path: '/branding/logo-footer.svg',
          class: 'w-24'
        }
      },
      colors: {
        primary: '#3C63C4',
        secondary: '#32373C',
      },
      description: 'Upload, collect, and transact rare digital art on the Liquid Network',
      keywords: 'Bitcoin Liquid NFT Art',
      homeHeroText: 'Create, Collect and Trade Exclusive NFT Art on the Liquid Network'
    },
    artwork: (art) => ({
        title: `Mintalio - ${art.title}`,
        image: `/api/ipfs/${art.filename}`,
        url: `https://mintalio.com/a/${art.slug}`,
    })
    
  },
  
  emails: {
    support : 'support@mintalio.com'
  }
};

export default BRANDING;
