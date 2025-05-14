import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 prose lg:prose-xl">
      <h1>Privacy Policy</h1>
      <p>Last Updated: 01/01/2025</p>

      <h2>1. Introduction</h2>
      <p>
        AutomationDFY (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website automationdfy.com (the &quot;Service&quot;), including when you use our contact forms or download templates. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
      </p>
      <p>
        We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the &quot;Last Updated&quot; date of this Privacy Policy.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
      <h3>2.1. Personal Data</h3>
      <p>
        When you fill out a form to download templates or access certain resources, we collect personally identifiable information, such as your:
      </p>
      <ul>
        <li>First Name</li>
        <li>Last Name</li>
        <li>Email Address</li>
        <li>Company Name</li>
        <li>Role</li>
        <li>Reason for interest in the template</li>
        <li>Template slug and title you are interested in</li>
      </ul>
      <p>You are under no obligation to provide us with personal information of any kind, however, your refusal to do so may prevent you from using certain features of the Service.</p>
      
      <h3>2.2. Derivative Data</h3>
      <p>
        Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
      <ul>
        <li>Provide you with access to requested templates and resources.</li>
        <li>Respond to your inquiries and fulfill your requests.</li>
        <li>Send you administrative information, such as changes to our terms, conditions, and policies.</li>
        <li>Improve our website and offerings.</li>
        <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
        <li>Comply with legal obligations.</li>
        <li>Send your form submission details to our internal processing systems via a webhook (currently to an n8n.automationdfy.com URL) for automation and record-keeping purposes.</li>
      </ul>

      <h2>4. Disclosure of Your Information</h2>
      <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
      <h3>4.1. By Law or to Protect Rights</h3>
      <p>
        If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
      </p>
      <h3>4.2. Third-Party Service Providers</h3>
      <p>
        We may share your information with third parties that perform services for us or on our behalf, including data storage, data analysis, email delivery, hosting services, and customer service. We use Supabase for database and storage services. Data submitted through our forms is also sent via a webhook to our automation platform hosted at n8n.automationdfy.com.
      </p>
      <h3>4.3. Business Transfers</h3>
      <p>
        We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
      </p>
      {/* <h3>4.4. Affiliates</h3>
      <p>
        We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.
      </p> */}
      {/* <h3>4.5. With Your Consent</h3>
      <p>We may disclose your personal information for any other purpose with your consent.</p> */}

      <h2>5. Data Security</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
      </p>

      <h2>7. Your Data Protection Rights</h2>
      <p>
        Depending on your location, you may have the following rights regarding your personal information:
      </p>
      <ul>
        <li>The right to access – You have the right to request copies of your personal data.</li>
        <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
        <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
        <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
        <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
        <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
      </ul>
      <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our contact information below.</p>

      <h2>8. Cookies and Tracking Technologies</h2>
      <p>
        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Service to help customize the Service and improve your experience. When you access the Service, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Service.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        Our Service is not intended for use by children under the age of 13 (or 16 in certain jurisdictions). We do not knowingly collect personally identifiable information from children under 13 (or 16). If we become aware that we have collected personal information from a child under the relevant age without verification of parental consent, we take steps to remove that information from our servers.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:
        <br />
        AutomationDFY
        <br />
        Email: contact@automationdfy.com
      </p>
    </div>
  );
}
