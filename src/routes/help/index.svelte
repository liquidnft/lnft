<script context="module">
  export const prerender = true;
</script>

<script>
  import branding from "$lib/branding";
</script>

<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <div class="mx-auto">
    <h2 class="mb-10">FAQ</h2>
    <div class="faq-content">
      <div class="faq">
        <h3>What's an NFT?</h3>

        <p>
          An NFT is a non-fungible token, a kind of digital bearer asset that
          represents ownership of a unique item or property. NFT's are designed
          to be distinguishable from each other so that no two tokens are the
          same, making them ideal for representing collectibles.
        </p>

        <h3>How do I use them?</h3>

        <p>
          NFT’s can be issued on different blockchains and networks. On {branding.projectName},
          they're created on the Liquid Network, a Bitcoin layer-2 solution and sidechain, that 
          can be stored in any wallet that supports Liquid assets. {branding.projectName} offers
          a free built-in web wallet that gets used by default.
        </p>

        <h3>How are they created?</h3>

        <p>
          When an artist first uploads an image or video file for an artwork,
          the file is added to the IPFS network and assigned a hash number that
          uniquely identifies the contents of the file. The artist's {branding.projectName}
          wallet will then generate a Liquid asset issuance transaction containing
          the artwork's title and its hash and broadcast it to be permanently
          recorded in the Liquid blockchain.
        </p>

        <h3>Who can publish their art here?</h3>

        <p>
          Raretoshi is a curated physical and digital art marketplace focused solely 
          on Bitcoin art. Your application will be reviewed by our team and we'll reach 
          out to let you know if you’ve been accepted.
        </p>

        <h3>
          What’s different about {branding.projectName} compared to other NFT platforms?
        </h3>

        <p>
          {branding.projectName} is the first NFT platform that uses the Bitcoin
          Liquid Network instead of Ethereum or Counterparty. The Liquid Network
          is a Bitcoin layer-2 solution and sidechain where transaction fees are denominated in 
          Liquid Bitcoin (L-BTC), which is pegged 1:1 to bitcoin.
        </p>

        <p>
          Transaction fees on Liquid are orders of magnitude cheaper than on the
          Bitcoin or Ethereum networks. Liquid also supports native asset issuance 
          and atomic swaps, making it possible for people who don't know or trust 
          each other to exchange their different tokens and assets directly in a 
          single transaction without needing to go through a trusted 3rd party escrow agent.
        </p>
        
         <h3>
          How much are fees on {branding.projectName}?
        </h3>
        
        <p>
          Currently, it is 50 sats (0.0000005 BTC) or less than three cents per asset issuance, 
          and 100 sats (0.000001 BTC) for listing and auctions. The lowest bid price allowed 
          is 1,000 sats (0.00001 BTC).
        </p>

        <h3>How do I get some L-BTC?</h3>

        <p>
          To bid or list art on Raretoshi, patrons will need to have some L-BTC in their Raretoshi wallets. 
          The easiest way to fund your account is to send onchain BTC or bitcoin on the Lighting Network to 
          your Raretoshi wallet, and it will auto-convert to L-BTC.

          You can also watch <a
            href="https://www.youtube.com/watch?v=LxY3oxLQhA8"
            target="_blank">this video tutorial</a
          >
          to learn how to use the SideSwap mobile app to turn BTC into L-BTC.
        </p>
      </div>
      <div class="contact boxShadow">
        <p>Need more help?</p>
        <ul>
          <li><a href="/guide">Explore user guide</a></li>
          <li>
            <a href={branding.urls.external.discord} target="_blank" rel='noreferrer'
              >Chat with support</a
            >
          </li>
          <li>
            <a href="mailto:{branding.emails.support}" target="_blank" rel='noreferrer'
              >Email support</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  h3 {
    @apply mt-8;
  }
  p,
  h3 {
    @apply mb-4;
  }

  .faq-content {
    display: flex;
  }

  .faq-content p {
    margin-bottom: 80px;
  }

  .contact {
    height: 300px;
    width: 800px;
    padding: 30px;
    margin-left: 50px;
  }
  .contact p {
    margin-bottom: 30px;
    font-size: 22px;
    border-radius: 10px;
  }
  .contact h5 {
    margin-bottom: 10px;
  }

  .contact a,
  .faq a {
    color: #3ba5ac;
  }

  @media only screen and (max-width: 1023px) {
    h3 {
      font-weight: bold;
    }
    .faq-content {
      flex-wrap: wrap;
    }
    .contact {
      width: 100%;
      margin: 30px 0;
    }
  }
</style>
