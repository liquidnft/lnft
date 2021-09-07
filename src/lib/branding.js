const BRANDING = {
  projectName: 'Cozmos',
  
  superUserName: 'cozmos',
  
  urls: {
    base: 'cozmos.coinos.io',
    www: 'www.cozmos.coinos.io',
    protocol: 'https://cozmos.coinos.io',
    external: {
      twitter: 'https://twitter.com/cozmos',
      telegram: 'https://t.me/cozmos',
      // blog: 'https://blog.raretoshi.com/',
    }
  },
  
  meta: {
    general: {
      og: {
        title: 'Cozmos',
        image: 'https://cozmos.coinos.io/branding/splash.png',
        url: 'https://cozmos.coinos.io/',
      },
      twitter: {
        card: 'summary_large_image',
        creator: '@cozmos',
        site: '@cozmos',
        title: 'Cozmos',
        image: 'https://cozmos.coinos.io/branding/splash.png',
      },
    },
    // for art page we use art info in <header> meta
    artPage: (art) => ({
      og: {
        title: `Cozmos - ${art.title}`,
        image: `/api/ipfs/${art.filename}`,
        url: `https://cozmos.coinos.io/a/${art.slug}`,
      },
      twitter: {
        title: `Cozmos - ${art.title}`,
        image: `/api/ipfs/${art.filename}`,
      },
    })
    
  },
  
  emails: {
    support : 'support@cozmos.coinos.io'
  }
};

export default BRANDING;
