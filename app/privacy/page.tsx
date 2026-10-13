import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalShell, H2, P, UL, Disclaimer } from "@/components/LegalDoc";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Privacy Policy",
    description:
      "How M Studio collects, uses, and protects the information you share through this website.",
    path: "/privacy",
  }),
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      kicker="Privacy"
      title="Privacy Policy"
      updated="June 22, 2026"
      intro={
        <>
          This policy explains what information M Studio collects when you visit
          this website or get in touch, how it is used, and the choices you have.
          We keep this short and plain on purpose.
        </>
      }
    >
      <Disclaimer>
        <strong className="text-ink">A note:</strong> this policy is provided as a
        clear, good-faith summary of our practices. It is not legal advice. If you
        operate under specific obligations (for example HIPAA, or selling to the
        EU/UK at scale), have a qualified attorney review it for your situation.
      </Disclaimer>

      <H2>Who we are</H2>
      <P>
        This website is operated by Meg, a sole proprietor doing business as
        “M Studio,” based in Maine, United States. You can reach us any time at{" "}
        <a className="text-signal hover:opacity-80" href="mailto:contact@mlinx.studio">
          contact@mlinx.studio
        </a>{" "}
        or{" "}
        <a className="text-signal hover:opacity-80" href="tel:+12074329492">
          (207) 432-9492
        </a>
        . For privacy questions, that email is the fastest way to reach us.
      </P>

      <H2>Information we collect</H2>
      <P>We only collect what we need to run the site and respond to you:</P>
      <UL>
        <li>
          <strong className="text-ink">What you send us.</strong> When you submit
          the contact form, we collect your name, email address, and message, plus
          your company and phone number if you choose to add them.
        </li>
        <li>
          <strong className="text-ink">Information collected automatically.</strong>{" "}
          Like most websites, our hosting provider logs basic technical data with
          each request (such as IP address, browser type, and pages viewed) for
          security and to keep the service running. We also use this to apply
          basic rate limiting on the contact form to prevent spam.
        </li>
        <li>
          <strong className="text-ink">Analytics & cookies.</strong> We may use
          privacy-conscious analytics to understand which pages are useful. If and
          when analytics is enabled, it may set cookies or similar identifiers; see
          “Cookies and analytics” below.
        </li>
        <li>
          <strong className="text-ink">Free tools.</strong> Some tools on the site
          (for example the site health check) send a URL you enter to a third-party
          service to produce a result. We do not store the URLs you test or the
          results. Tool preferences may be saved locally in your own browser only.
        </li>
      </UL>
      <P>
        We do not knowingly collect sensitive personal information, and we never
        ask for payment details through this site.
      </P>

      <H2>How we use information</H2>
      <UL>
        <li>To reply to your message and discuss a possible project.</li>
        <li>To operate, secure, and improve the website and its tools.</li>
        <li>To prevent spam, abuse, and fraud.</li>
        <li>To comply with the law if we are ever required to.</li>
      </UL>
      <P>
        We do <strong className="text-ink">not</strong> sell or rent your personal
        information, and we don’t use your contact details for unrelated marketing.
      </P>

      <H2>Who we share it with</H2>
      <P>
        We don’t sell your data. We share it only with the service providers that
        help us run the site, and only as needed for them to do that work:
      </P>
      <UL>
        <li>
          <strong className="text-ink">Vercel</strong> — hosts the website and
          processes server logs.
        </li>
        <li>
          <strong className="text-ink">Google (Gmail)</strong> — when you submit the
          contact form, your message is delivered to, and kept in, our private email
          inbox so we can read and reply to it.
        </li>
        <li>
          <strong className="text-ink">Google PageSpeed Insights</strong> — powers
          the optional site health check tool when you choose to run it.
        </li>
      </UL>
      <P>
        We may also disclose information if required by law, or to protect the
        rights, safety, and security of our users or the public.
      </P>

      <H2>Cookies and analytics</H2>
      <P>
        The core website does not require advertising or tracking cookies to
        function. We may use privacy-conscious analytics and limited cookies or
        similar technologies to measure general usage and keep the site secure.
        You can control cookies through your browser settings, and where required
        we will ask for your consent before setting non-essential cookies. Some
        features store small preferences in your browser’s local storage on your
        device only — this never leaves your device and we cannot read it.
      </P>

      <H2>How long we keep it</H2>
      <P>
        We keep contact submissions only as long as needed to respond and maintain
        a record of our conversation, then delete or archive them. Server logs are
        kept for a limited period by our hosting provider. You can ask us to delete
        your information at any time (see below).
      </P>

      <H2>How we protect it</H2>
      <P>
        The site is served entirely over encrypted HTTPS, so your submission is
        encrypted in transit and delivered to a private email inbox that only we
        can access. We apply security headers, input validation, and rate limiting
        to reduce common web risks. No method of transmission or storage is ever
        100% secure, but we take reasonable steps to protect your information.
      </P>

      <H2>Your choices and rights</H2>
      <P>
        You can ask us to access, correct, or delete the personal information you’ve
        shared with us — just email{" "}
        <a className="text-signal hover:opacity-80" href="mailto:contact@mlinx.studio">
          contact@mlinx.studio
        </a>
        . Depending on where you live (for example California, or the EU/UK), you
        may have additional rights, such as the right to know what we hold, to
        request deletion, and to not be discriminated against for exercising those
        rights. We honor these requests regardless of where you are, to the extent
        the law allows.
      </P>

      <H2>Children</H2>
      <P>
        This site is intended for businesses and adults. It is not directed to
        children under 13, and we do not knowingly collect their information.
      </P>

      <H2>Changes to this policy</H2>
      <P>
        If we update this policy, we’ll change the “last updated” date above. For
        significant changes, we’ll make the update clear on this page.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about privacy? Email{" "}
        <a className="text-signal hover:opacity-80" href="mailto:contact@mlinx.studio">
          contact@mlinx.studio
        </a>{" "}
        or call{" "}
        <a className="text-signal hover:opacity-80" href="tel:+12074329492">
          (207) 432-9492
        </a>
        . You can also review our{" "}
        <a className="text-signal hover:opacity-80" href="/terms">
          Terms of Service
        </a>
        .
      </P>
    </LegalShell>
  );
}
