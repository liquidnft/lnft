<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <div class="mx-auto">
    <h2 class="mb-10">FAQ</h2>
    <div class="faq-content">
      <div class="faq">
        <h3>What's an NFT?</h3>

        <p>
          An NFT is a non-fungible token, a kind of digital bearer asset that
          represents ownership of a unique item or property. NFT's are designed to
          be distinguishable from each other so that no two tokens are the same,
          making them ideal for representing collectibles.
        </p>

        <h3>How do I use them?</h3>

        <p>
          NFT’s can be issued on different blockchains and networks. On NFT Glee,
          they're created on the Liquid Bitcoin network and can be stored in any wallet that
          supports Liquid Bitcoin assets. NFT Glee offers a free built-in web wallet that
          gets used by default.
        </p>

        <h3>How are they created?</h3>

        <p>
          When an artist first uploads an image or video file for an artwork, the
          file is added to the IPFS network and assigned a hash number that uniquely
          identifies the contents of the file. The artist's NFT Glee wallet will
          then generate a Liquid Bitcoin asset issuance transaction containing the title of
          the artwork and its hash and broadcast it to be permanently recorded in
          the Liquid Bitcoin blockchain.
        </p>

        <h3>Who can publish their art here?</h3>

        <p>
          Anyone can apply to become an artist on our platform. Your application
          will be reviewed by our team and we'll reach out to let you know if you’ve
          been accepted.
        </p>

        <h3>What’s different about NFT Glee compared to other NFT platforms?</h3>

        <p>
          NFT Glee is the first NFT platform that uses the Liquid Bitcoin Network
          instead of Ethereum or Counterparty. The Liquid Bitcoin network is a bitcoin
          sidechain where transaction fees are denominated in L-BTC, Liquid Bitcoin,
          which is pegged 1:1 to bitcoin.
        </p>

        <p>
          Transaction fees on Liquid Bitcoin are orders of magnitude cheaper than on the
          bitcoin or ethereum networks. Liquid Bitcoin also supports native asset issuance
          and atomic swaps which make it possible for people who don't know or trust
          each other to exchange their different tokens and assets directly in a
          single transaction without needing to go through a trusted 3rd party
          escrow agent.
        </p>
      </div>
      <div class="contact boxShadow">
        <p>Need more help?</p>
        <h5>Contact us through</h5>
        <a href="mailto:support@nftglee.com" target="_blank">support@nftglee.com</a>
      </div>
    </div>
  </div>
</div>

  <style>
  h3 { @apply mt-8 }
  p, h3 { @apply mb-4 }

  
  .faq-content{
    display: flex;
  }

  .faq-content p{
    margin-bottom: 80px;
  }

  .contact{
    height: 180px;
    width: 700px;
    padding: 30px;
    margin-left: 50px;
  }
  .contact p{
    margin-bottom: 30px;
    font-size: 22px;
    border-radius: 10px;
  }
  .contact h5{
    margin-bottom: 10px;
  }

  .contact a{
    color: #3ba5ac;
  }

  @media only screen and (max-width: 1023px){
    h3{font-weight: bold;}
    .faq-content{
      flex-wrap: wrap;
    }
    .contact{
      width: 100%;
      margin: 30px 0;
    }
  }
  </style>
