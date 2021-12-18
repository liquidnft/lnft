<script context="module">
  export const prerender = true;
</script>

<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <div class="mx-auto">
    <h2 class="mb-10">Raretoshi User Guide</h2>
    <div class="guide-content">
      <div class="toc boxShadow">
        <h3>Table of contents</h3>
        <ol style="list-style: decimal; padding-left: 30px">
          <li><p><a href="#create-new-account">CREATE A NEW ACCOUNT</a></p></li>
          <li><p><a href="#create-new-wallet">CREATE A NEW WALLET</a></p></li>
          <li>
            <p><a href="#fund-your-wallet">FUND YOUR WALLET</a></p>
            <ol style="list-style: decimal; padding-left: 30px">
              <li><a href="#liquid">Liquid</a></li>
              <li><a href="#btc-on-chain">BTC (on-chain)</a></li>
              <li><a href="#btc-lightning">BTC (Lightning)</a></li>
            </ol>
          </li>
          <li>
            <p><a href="#upload-artwork-and-mint-nft">UPLOAD ARTWORK & MINT NFT</a></p>
          </li>
          <li>
            <p><a href="#list-artwork">LIST ARTWORK</a></p>
            <ol style="list-style: decimal; padding-left: 30px">
              <li><a href="#simple-listing">Simple listing</a></li>
              <li><a href="#auctions">Auctions</a></li>
            </ol>
          </li>
          <li>
            <p>
              <a href="#what-to-expect-after-listing"
                >WHAT TO EXPECT AFTER LISTING ARTWORK</a
              >
            </p>
          </li>
          <li>
            <p><a href="#other">OTHER</a></p>
            <ol style="list-style: decimal; padding-left: 30px">
              <li><a href="#edit-profile">Edit your Raretoshi profile</a></li>
            </ol>
          </li>
        </ol>
      </div>
      <div class="guide">
        <div class="item" id="create-new-account">
          <h3>1. CREATE A NEW ACCOUNT</h3>
          <ol style="list-style: decimal; padding-left: 30px">
            <li>
              <p>
                Go to <a href="https://raretoshi.com/" target="_blank"
                  >https://raretoshi.com</a
                > and navigate to “Sign in” at the top right corner.
              </p>
              <img
                class="guide-image"
                src="/guide/image19.png"
                alt="Screenshot"
              />
            </li>
            <li>
              <p>Select "Don’t have an account? Sign up."</p>
              <img
                class="guide-image"
                src="/guide/image35.png"
                alt="Screenshot"
              />
            </li>
            <li>
              <p>
                Provide your email address and define your username and
                password.
              </p>
              <img
                class="guide-image"
                src="/guide/image23.png"
                alt="Screenshot"
              />
            </li>
            <li>
              <p>
                Check your inbox for a confirmation email and follow the
                instructions provided to validate your email address.
              </p>
              <img
                class="guide-image"
                src="/guide/image2.png"
                alt="Screenshot"
              />
              <img
                class="guide-image"
                src="/guide/image22.png"
                alt="Screenshot"
              />
            </li>
            <li>
              <p>
                Select “Continue to Raretoshi” or go back to
                <a href="https://raretoshi.com/login" target="_blank"
                  >https://raretoshi.com/login</a
                > and log in with your username and password. The first time you
                log into your Raretoshi account you will be prompted to create a
                new wallet.
              </p>
            </li>
          </ol>
        </div>
        <div class="item" id="create-new-wallet">
          <h3>2. CREATE A NEW WALLET</h3>
          <ol style="list-style: decimal; padding-left: 30px">
            <li>
              <p>
                Select “Create new wallet”. Read the instructions and click "I
                am ready to start" to see your 12-words mnemonic seed.
              </p>
            </li>
            <li>
              <p>
                Write down all the words displayed including their order.
                Remember this is your ultimate back-up. If you lose access to
                your account and lose your 12-word mnemonic seed your funds and
                NFTs will be lost forever.
              </p>
              <img
                class="guide-image"
                src="/guide/image16.png"
                alt="Screenshot"
              />
              <img
                class="guide-image"
                src="/guide/image33.png"
                alt="Screenshot"
              />
              <img
                class="guide-image"
                src="/guide/image7.png"
                alt="Screenshot"
              />
            </li>
            <li>
              <p>
                Validate that you have correctly written down your 12-word
                mnemonic seed phrase by typing them in the correct order. Once
                you are done click "Next."
              </p>
              <img
                class="guide-image"
                src="/guide/image25.png"
                alt="Screenshot"
              />
            </li>
            <li>
              <p>Your wallet is now ready to be funded.</p>
              <img
                class="guide-image"
                src="/guide/image34.png"
                alt="Screenshot"
              />
            </li>
          </ol>
        </div>
        <div class="item" id="fund-your-wallet">
          <h3>3. FUND YOUR WALLET</h3>
          <p>
            Artists will need a bit of Liquid Bitcoin (L-BTC) in their wallet to
            mint an NFT (~0.000013 L-BTC or ~0.5 USD at the time of writing).
            Raretoshi users will also need L-BTC or other Liquid assets (e.g.
            USDt Liquid) in their wallets to bid on artwork. Your wallet can be
            funded through a Liquid, Bitcoin on-chain or Lightning transaction.
          </p>
          <p class="font-bold">
            If you choose to fund your account through a Bitcoin on-chain
            address or Lightning invoice, your BTC will automatically convert to
            L-BTC within Raretoshi. This is probably the most straightforward
            and easiest way to get L-BTC in your Raretoshi wallet.
          </p>
          <p>
            Confidential Liquid and bitcoin deposits require one on-chain
            confirmation before being converted (Liquid: ~1-2 min; BTC: ~10-30
            min). No pending deposit indication will be shown while the
            conversion is underway. The minimum amount to convert is 0.00001 BTC
            and the maximum is 0.01 BTC.
          </p>
          <p>
            Please see <a
              href="https://blog.liquid.net/how-to-get-l-btc/"
              target="_blank">this article</a
            > for a complete list of the fastest and easiest ways to get L-BTC.
          </p>
        </div>
        <div class="item" id="liquid">
          <h4>3.1 Liquid</h4>
          <p>
            When funding through Liquid, users have a choice between
            confidential transactions and non-confidential transactions. By
            default, all transactions are confidential. More info <a
              href="https://help.blockstream.com/hc/en-us/articles/900001390743-How-does-Liquid-keep-my-transaction-data-confidential-"
              target="_blank">here</a
            >.
          </p>
          <p>
            When selecting “Fund” in your Raretoshi wallet, you will be shown a
            Liquid non-confidential address in text format and in QR code. You
            can use this non-confidential address to send any Liquid asset
            including L-BTC, USDt (Liquid), or L-CAD directly to your Raretoshi
            wallet without limit in amount.
          </p>
          <p>
            We recommend using <a
              href="https://help.blockstream.com/hc/en-us/articles/900002327003-How-do-I-create-a-new-wallet-"
              target="_blank">Blockstream Green</a
            >,
            <a
              href="https://help.blockstream.com/hc/en-us/articles/900002604286-How-do-I-create-a-new-wallet-on-AQUA-"
              target="_blank">Blockstream AQUA</a
            >
            or <a href="https://coinos.io/" target="_blank">Coinos</a> to send Liquid
            assets to your Raretoshi wallet. If you get an error in your Green or
            AQUA wallet saying “Non-Confidential addresses not supported” simply
            click on “Confidential” under the Liquid address and you will be shown
            a confidential address and corresponding QR code.
          </p>
          <img class="guide-image" src="/guide/image17.png" alt="Screenshot" />
          <p>
            It can take 3-6 min for the funds to show up in your wallet. If you
            don’t see the amount updated in your wallet try refreshing the page.
          </p>
          <p>
            To speed up your Raretoshi wallet funding process, avoid funding
            delays and be able to bid on artwork with agility, we recommend
            obtaining L-BTC ahead of time. If you want to learn about different
            ways to get L-BTC please take a look at <a
              href="https://help.blockstream.com/hc/en-us/articles/900000630846-How-do-I-get-Liquid-Bitcoin-L-BTC-"
              target="_blank">this Blockstream Help Center guide</a
            >
            or
            <a href="https://blog.liquid.net/how-to-get-l-btc/" target="_blank"
              >this article on Liquid.net</a
            >.
          </p>
        </div>
        <div class="item" id="btc-on-chain">
          <h4>3.2 BTC (on-chain)</h4>
          <p>
            By selecting “Bitcoin” you can fund your wallet by sending an
            on-chain transaction to a native SegWit address generated by your
            wallet. This option will automatically exchange your BTC to L-BTC
            using Coinos. Depending on BTC network traffic and the selected
            transaction fee this funding option can take 12-60 min (however,
            keep in mind that this could take longer if there is high traffic
            volume on the Bitcoin network). You can use this option if you are
            not in a rush.
          </p>
          <img class="guide-image" src="/guide/image6.png" alt="Screenshot" />
        </div>
        <div class="item" id="btc-lightning">
          <h4>3.3 BTC (Lightning)</h4>
          <p>
            You can also fund your Raretoshi Liquid wallet using Lightning. By
            selecting “Lightning” you will be presented with a Lightning invoice
            with no predefined amount. You can scan this QR code and input the
            amount you want to send. Similar to on-chain funding, your BTC will
            be sent to Coinos and automatically exchanged to L-BTC that will
            then be deposited in your Raretoshi Liquid wallet. Keep in mind that
            there is currently a minimum of 0.00001 btc (~1,000 sats) and a
            maximum of 0.01 BTC with this funding option.
          </p>
          <img class="guide-image" src="/guide/image30.png" alt="Screenshot" />
        </div>
        <div class="item" id="upload-artwork-and-mint-nft">
          <h3>4. UPLOAD ARTWORK & MINT NFT</h3>
          <p>
            All new accounts in Raretoshi are “Fan” accounts. With this type of
            account you can bid on artwork and trade NTFs in the secondary
            market, but you can’t upload or mint NFTs. These options are
            reserved for users with an artist account. Artists will get their
            accounts tagged as “Artists” during the onboarding process.
          </p>
          <p>
            To upload their artwork, artists can go to their profile page and
            select “Submit a new artwork.” This option is also available in the
            “Market” page (https://raretoshi.com/market). Current supported file
            formats are jpg, png, gif and mp4 up to a size limit of 400MB.
          </p>
          <img class="guide-image" src="/guide/image11.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image4.png" alt="Screenshot" />
          <p>
            You will be presented with a “Submit artwork” form. You can either
            drag and drop your file or click on “Upload your artwork” to select
            a file from your device. You will see a “Upload complete!” message
            once your artwork is ready
          </p>
          <img class="guide-image" src="/guide/image3.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image1.png" alt="Screenshot" />
          <p>You can now fill out details of your artwork including:</p>
          <ul style="list-style: disc; padding-left: 30px">
            <li>Title</li>
            <li>
              This is a physical artwork (this just adds an icon to indicate
              that the NFT is associated with a physical item like a physical
              copy of the artwork)
            </li>
            <li>Number of editions (1:1, multiple editions)</li>
            <li>
              Description (here you can add a description of your artwork, about
              yourself, or indicate that there is additional content associated
              with the NFT such as a physical copy of the underlying artwork,
              access to an event, etc.)
            </li>
            <li>
              Ticker (this is a short 3-5 character identifier for your asset
              that you will see in other Liquid wallets and explorers. The
              ticker will be automatically selected based on the title of your
              artwork, but it can also be customized)
            </li>
            <li>
              Tags (you can use this field to add search words for your artwork
              so other users can find it easily. This section will also be used
              to include your artwork in a specific gallery (e.g., #Bitcoin2021;
              #Cypherpunks, etc.) Please only add the tag to a specific gallery
              if you are authorized to do so. We will remove any artwork that is
              not supposed to be displayed in the gallery. Consult with your
              gallery organizer to make sure you include the appropriate tag
            </li>
          </ul>
          <img class="guide-image" src="/guide/image21.png" alt="Screenshot" />
          <p>
            After clicking “Submit” your artwork will be uploaded into our IPFS
            node and a Liquid issuance transaction will be generated to mint the
            NFT. You will be redirected to the newly uploaded artwork page and
            you will be able to see different details such as the username of
            the artist that created the artwork, the current owner (in this case
            the same artist), and under asset details you’ll be able to see the
            IPFS hash and the Liquid transaction ID.
          </p>
          <p>
            You will have to wait 1-2 min for the NFT minting transaction to be
            confirmed in the Liquid blockchain (indicated as “pending'' by the
            history of the artwork on the bottom left corner).
          </p>
          <img class="guide-image" src="/guide/image37.png" alt="Screenshot" />
          <p>
            Once the minting transaction is confirmed, your artwork/NFT will be
            ready to be listed. At this point your artwork is labelled as
            “Unlisted” so no other Raretoshi user can see it in the platform.
            You can see it in your profile page but it won’t be publicly visible
            until listed.
          </p>
          <img class="guide-image" src="/guide/image5.png" alt="Screenshot" />
          <p>
            The NFT will also be in your wallet now. You can confirm this by
            going to your profile page and then to your wallet. If you go to “X
            assets available in this wallet>” you will see all Liquid assets in
            your wallet including L-BTC and NFTs.
          </p>
          <img class="guide-image" src="/guide/image10.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image28.png" alt="Screenshot" />
        </div>
        <div class="item" id="list-artwork">
          <h3>5. LIST ARTWORK</h3>
          <p>
            After uploading your artwork and minting NFT you can then proceed to
            list your piece for sale.
          </p>
          <p>
            1. Go to your Raretoshi profile page. There, you will find all your
            uploaded artwork under the “Creations” tab.
          </p>
          <img class="guide-image" src="/guide/image8.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image24.png" alt="Screenshot" />
          <p>
            2. Select the unlisted piece that you want to publicly list by
            clicking on it. You will be taken to the artwork page where you will
            be able to list it by clicking on “List.”
          </p>
          <img class="guide-image" src="/guide/image14.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image26.png" alt="Screenshot" />
          <p>
            3. You will now be presented with several options for your listing
            and you’ll be able to select between simple listing and auction.
          </p>
        </div>
        <div class="item" id="simple-listing">
          <h4>5.1 Simple listing</h4>
          <p>You have different options that include:</p>
          <p>
            1. Listing currency: you can define if you want to receive L-BTC,
            L-CAD or USDt (Liquid). Users bidding for your artwork will have to
            do it in this listing currency
          </p>
          <p>
            2. Price: setting a price is optional. This would be the “buy it
            now” or buyout price. If you don’t set a price, users will post
            offers for your piece.
          </p>
          <p>
            3. Royalty Rate: setting a royalty rate (in percentage) is optional.
            This is the percentage that will be paid to the original artist in
            subsequent sales of the NFT. Setting a royalty involves transferring
            the artwork to a 2-of-2 multisig address with Raretoshi. Our servers
            will only co-sign a transfer if they pay the specified royalty to
            the original artist. This percentage can not be modified afterwards
            by any NFT owner. Once an NFT has a royalty associated it gets
            locked in Raretoshi to ensure that the original artists receive
            their royalties, which means the NFT cannot be transferred outside
            of the platform. If you want your NFT to be transferable outside of
            Raretoshi wallets, do not add a royalty.
          </p>
          <p>
            Once you are happy with your listing conditions you can hit “Submit”
            and your piece will be published for sale. You will be redirected to
            the artwork page and will be able to see the listing details and the
            history of the artwork if you scroll down.
          </p>
          <img class="guide-image" src="/guide/image9.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image13.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image12.png" alt="Screenshot" />
          <p>
            Other users will now be able to make you an offer or directly buy
            your artwork if a price was set.
          </p>
          <img class="guide-image" src="/guide/image38.png" alt="Screenshot" />
        </div>
        <div class="item" id="auction">
          <h4>5.2 Auction</h4>
          <p>
            You must enable “Create an auction” on the listing page to activate
            this option. You have the same options as in simple listing, but in
            this case, you can also add a start and end date and time for your
            auction and a reserve price. The reserve price is the minimum price
            you’ll accept for the artwork. Setting one is optional.
          </p>
          <img class="guide-image" src="/guide/image27.png" alt="Screenshot" />

          <p>
            To ensure auction start and end dates and time, once an artwork is
            listed using this option it is transferred to a 2-of-2 multisig
            address. The Raretoshi server will co-sign this transaction once the
            auction is finished and the NFT will be sent to the highest bidder
            and the money to the artist.
          </p>
          <p>
            After listing your artwork using the auction option, other users
            will bid on it and see information such as reserve price, if any,
            and how much time is left until the auction ends.
          </p>
          <img class="guide-image" src="/guide/image36.png" alt="Screenshot" />
        </div>
        <div class="item" id="what-to-expect-after-listing">
          <h3>6. WHAT TO EXPECT AFTER LISTING</h3>
          <p>
            After listing your artwork, Raretoshi users will be able to bid in
            different ways depending on your listing conditions. If you set a
            price, users will be able to buy out your artwork immediately for
            that price. Users can also make an offer and you’ll see these offers
            in the artwork page and in your profile page under “Offers.” If you
            did a simple listing (i.e., not auction) after someone places a bid
            on your artwork, you can accept that offer, wait for further offers
            or wait until someone pays the buyout price for your piece.
          </p>
          <p>
            If you decide to accept an offer, your wallet will sign the atomic
            swap transaction that will transfer the NFT to the bidder and will
            deposit the bid money into your Raretoshi wallet. Your artwork will
            still be visible to you in your profile page under “Creations” but
            since you no longer are the owner, it won’t show up under the
            “Collection” tab. The artwork page will also show the history of the
            NFT and it will reflect the new owner.
          </p>
          <img class="guide-image" src="/guide/image31.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image20.png" alt="Screenshot" />
          <img class="guide-image" src="/guide/image32.png" alt="Screenshot" />
          <p>
            If you decide to list your artwork as an auction, Raretoshi users
            will see the time left until the auction goes live, and they will be
            able to bid for your piece until the end of the auction. If you set
            a reserve price (i.e., minimum amount that you will accept for your
            piece), users will also be able to see this information. Raretoshi
            users will also see a countdown timer indicating when the auction
            ends. If someone bids in the last 15 min, this will automatically
            push the auction end time 15 min. Once an auction is finished, the
            NFT will automatically be transferred to the highest bidder and the
            money to the artist.
          </p>
        </div>
        <div class="item" id="other">
          <h3>7. OTHER</h3>
        </div>
        <div class="item" id="edit-profile">
          <h4>7.1 Edit your Raretoshi profile</h4>
          <p>1. Go to your profile page</p>
          <img class="guide-image" src="/guide/image11.png" alt="Screenshot" />

          <p>2. Select "Edit Profile"</p>
          <img class="guide-image" src="/guide/image15.png" alt="Screenshot" />

          <p>
            3. Fill out the fields and change your profile picture if you want
            and save the changes. Done.
          </p>
          <img class="guide-image" src="/guide/image18.png" alt="Screenshot" />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .guide-content .item {
    margin-bottom: 80px;
  }

  .guide-content .item h4 {
    font-size: 26px;
    line-height: 32px;
    font-weight: bold;
  }
  .toc {
    padding: 20px 30px;
    margin-bottom: 30px;
  }

  .toc h3 {
    margin-bottom: 20px;
  }
  .toc p {
    margin: 5px 0;
    font-size: 22px;
  }

  .guide p {
    margin: 5px 0;
  }

  .toc a,
  .guide a {
    color: #3ba5ac;
  }
  .guide-image {
    max-width: 800px;
    margin: 10px auto;
  }
</style>
