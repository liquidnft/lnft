const BRANDING = {
  projectName: 'Raretoshi',
  
  superUserName: 'raretoshi',
  
  urls: {
    base: 'raretoshi.com',
    www: 'www.raretoshi.com',
    protocol: 'https://raretoshi.com',
    external: {
      twitter: 'https://twitter.com/raretoshi',
      telegram: 'https://t.me/raretoshi',
      blog: 'https://blog.raretoshi.com/',
    }
  },
  
  meta: {
    general: {
      og: {
        title: 'Raretoshi',
        image: 'https://raretoshi.com/branding/splash.png',
        url: 'https://raretoshi.com/',
      },
      twitter: {
        card: 'summary_large_image',
        creator: '@raretoshi',
        site: '@raretoshi',
        title: 'Raretoshi',
        image: 'https://raretoshi.com/branding/splash.png',
      },
    },
    // for art page we use art info in <header> meta
    artPage: (art) => ({
      og: {
        title: `Raretoshi - ${art.title}`,
        image: `/api/ipfs/${art.filename}`,
        url: `https://raretoshi.com/a/${art.slug}`,
      },
      twitter: {
        title: `Raretoshi - ${art.title}`,
        image: `/api/ipfs/${art.filename}`,
      },
    })
    
  },
  
  emails: {
    support : 'support@raretoshi.com'
  }
};

export default BRANDING;
