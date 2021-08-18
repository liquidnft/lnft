<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import branding from '$lib/branding';
</script>

<style>
  h3 {
    @apply mt-8;
  }
  p,
  h3 {
    @apply mb-4;
    text-align: left;
  }

  h4 {
    font-weight: bold;
    margin: 20px 0 10px 0;
  }

  .faq-content {
    display: flex;
    text-align: justify;
  }

  ul {
    list-style: disc;
    padding: 0 20px;
  }

  ul li {
    margin-bottom: 20px;
    text-align: left;
  }

  @media only screen and (max-width: 1023px) {
    h3 {
      font-weight: bold;
    }
    .faq-content {
      flex-wrap: wrap;
    }
  }

</style>

<div class="max-w-4xl container mx-auto sm:justify-between mt-10 md:mt-20">
  <div class="mx-auto">
    <h2 class="mb-10">{ branding.projectName } Privacy Policy</h2>
    <div class="faq-content">
      <div class="faq">
        <p>
          At { branding.projectName } (“Website”, “we”) We are committed to protecting the
          privacy and confidentiality of any personal data we collect when you
          use this Website. This Privacy Policy describes the ways we collect
          information from and about you, and what we do with the information,
          so that you may decide whether or not to provide information to us. By
          accessing or using { branding.projectName } ({ branding.urls.www }), you agree to be
          bound by the terms and conditions described in this document and also
          by any terms and conditions incorporated by reference.
        </p>
        <h3>1. Scope of definitions</h3>
        <p>
          This Privacy Policy applies to all information (including personal
          information) collected through our sites.
        </p>

        <p>
          “<b>Sites</b>” are all websites that are owned and operated by
          { branding.projectName }, including { branding.urls.base } and all subdomains
        </p>

        <p>
          “<b>Visitor</b>” includes anyone using the { branding.projectName } sites, whether
          viewing pages or uploading/downloading information directly from those
          sites using some other means.
        </p>

        <p>
          “<b>Personal information</b>” means information that identifies you
          personally, either alone or in combination with other information
          available to us.
        </p>

        <p>
          <b>A Note to Users Outside of the United States.</b>
          If you are a non-U.S. user of the Sites, by visiting the Sites and
          providing us with data, you acknowledge and agree that your Personal
          Information may be processed for the purposes identified in the
          Privacy Policy. In addition, your Personal Information may be
          processed in the country in which it was collected and in other
          countries, including the United States, where laws regarding
          processing of Personal Information may be less stringent than the laws
          in your country. By providing your data, you consent to such transfer.
        </p>

        <h3>2. What information do we collect?</h3>

        <h4>Active Collection of Information</h4>

        <p>
          We may collect certain information that you voluntarily provide to us
          which may contain personal information. For example, when you create
          your user account we may collect your username and email address. We
          retain this information until you ask to be removed from the Website.
          The User may choose to provide their full name, location, biographical
          information, and include links to their website or other social
          platforms. For users submitting an application to become Artists in
          the Website we may collect information such as name, email address,
          artwork samples, information about your promoting sites (website or
          other social platforms) and other information about your art. In
          addition, if any Token has a physical item associated, we may collect
          shipping information (such as name and mailing address) from you in
          order to ship the items to you. We do not sell or otherwise transmit
          any such actively-collected personal information to third parties
          other than to third party service providers discussed in Section 4.
        </p>

        <h4>Passive Collection of Information</h4>

        <p>
          When you visit our sites, some information about your visit is
          automatically collected. This information includes your IP address,
          access times, browser type and language, and referring web site
          addresses. We collect this information to troubleshoot technical
          issues, understand how visitors use our website, provide an experience
          relevant to the general location associated with your IP address, and
          to make improvements to our website. If you arrive at our website by
          clicking a link, then we may capture information that tracks your
          visit from that link.
        </p>

        <p>
          We may place a cookie on your hard drive during the web visit to help
          us identify the number of unique visitors to our website, whether or
          not those visitors are repeat visitors, and the source of the visits.
          If you do not want this information to be collected, you may disable
          cookies in your web browser.
        </p>

        <p>
          Additionally, we may use third-party analytics services to collect and
          analyze data automatically collected from site users; the type and
          nature of those services may change without notice. Data collected
          this way is governed by the terms and conditions of those third party
          services.
        </p>

        <h4>Links to non-{ branding.projectName } Websites</h4>

        <p>
          Some projects, tools, forums, or other publicly-available resources
          associated with { branding.projectName } may be hosted on third-party websites.
          Additionally, we may provide links to third-party websites for
          informational purposes. The privacy practices of those sites may
          differ from our practices, are not controlled by { branding.projectName }, and are
          not covered by this Privacy Policy. We do not make any representations
          about third-party websites. We encourage you to review their privacy
          policies before submitting your personal data to such sites.
        </p>

        <h4>Sensitive Information</h4>

        <p>
          We will not intentionally collect or maintain, and do not want you to
          provide, any information regarding sensitive personal information. Our
          services are not designed for or directed to children under the age of
          18, and we will not intentionally collect or maintain information
          about anyone under the age of 13. If a child under 13 submits Personal
          Information to { branding.projectName } and we learn that the Personal Information is
          the information of a child under 13, we will attempt to delete the
          information as soon as possible. If you believe that we might have any
          Personal Data from a child under 13, please contact us at
          { branding.emails.support }.
        </p>

        <h3>3. What do we use this information for?</h3>
        <p>
          We use web visit information to measure interest in and develop
          { branding.projectName } and marketing plans, customize the content you view on your
          web visits based on your activity on past visits, diagnose technical
          problems, and to generally administer the Platform. If any Token is
          associated with a physical item, we will use the shipping information
          you provide in order to ship the products to your address.
        </p>

        <p>
          Any information actively collected, such as names and email addresses,
          will be used to provide you with information regarding { branding.projectName }
          services when you sign up on our Platform.
        </p>

        <h3>4. Disclosure of personal information</h3>

        <p>
          Personal information we gather is for internal use only. We will not
          authorize the release of this information to anyone outside { branding.projectName },
          except:
        </p>

        <ul>
          <li>
            to third party service providers who perform functions on our behalf
            such as to provide you with the content and Services that we offer
            you through our Site; to conduct quality assurance testing; to
            facilitate shipping of physical items in the Platform; to provide
            technical support; and/or to provide hosting and other services to
            { branding.projectName }. In such events, personal information will only be shared
            to the extent reasonably necessary to perform their functions and
            they will not be authorized to use it for any other function,
          </li>
          <li>
            when we believe it is necessary to comply with the law, including in
            allegations of copyright infringement such as the Digital Millennium
            Copyright Act
          </li>
        </ul>
        <h3>5. Security of your information</h3>
        <p>
          We use various security measures to protect your personal information
          (including preventing the loss, misuse, unauthorized access,
          disclosure, alteration and destruction of your personal information).
          We store information you provide to us on a computer system located in
          a controlled facility with limited access, and require the same of any
          third-party we work with. However, we cannot guarantee the absolute
          security and safety of your Personal Information.
        </p>
        <h3>6. Inquiries or complaints</h3>
        <p>
          If you have a question or complaint about this Privacy Policy or our
          information collection practices, please contact us at
          { branding.emails.support }.
        </p>

        <h3>7. Changes</h3>

        <p>
          We may change this Privacy Policy from time to time. If we make a
          material modification that diminishes the protections afforded
          visitors to our website then we will place a notification on our
          website, post the updated Privacy Policy and change the effective
          date. If we have collected your email address, we will also notify you
          by email. Any use of our website after the posted effective date is
          subject to the updated Privacy Policy.
        </p>

        <p class="w-full text-center italic mt-10">
          This Privacy Policy was last updated on May 19th, 2021.
        </p>
      </div>
    </div>
  </div>
</div>
