import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalShell, H2, P, UL, Disclaimer } from "@/components/LegalDoc";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Terms of Service",
    description:
      "The terms for using the M Studio website and its free tools.",
    path: "/terms",
  }),
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalShell
      kicker="Terms"
      title="Terms of Service"
      updated="June 22, 2026"
      intro={
        <>
          These terms cover your use of this website and the free tools on it. By
          using the site, you agree to them. They’re written to be readable rather
          than to bury anything in fine print.
        </>
      }
    >
      <Disclaimer>
        <strong className="text-ink">A note:</strong> these terms are a sensible
        starting point for a marketing website, not legal advice, and they do not
        govern paid project work — that is set out in a separate written agreement
        or proposal for each engagement. Have an attorney review these for your
        specific needs.
      </Disclaimer>

      <H2>Who we are</H2>
      <P>
        This website is operated by Meg, a sole proprietor doing business as
        “M Studio,” based in Maine, United States (“M Studio,” “we,” “us”).
        “You” means anyone who visits or uses the site.
      </P>

      <H2>Using the site</H2>
      <P>
        You may browse the site and use its free tools for lawful purposes. You
        agree not to:
      </P>
      <UL>
        <li>Use the site in any way that breaks the law or harms others.</li>
        <li>
          Attempt to disrupt, overload, hack, or gain unauthorized access to the
          site, its tools, or the systems behind them.
        </li>
        <li>
          Scrape, copy, or reuse the site’s content or code beyond normal personal
          and evaluation use without our permission.
        </li>
        <li>
          Submit false information, spam, malware, or anything you don’t have the
          right to share through the contact form or tools.
        </li>
      </UL>

      <H2>The contact form</H2>
      <P>
        Sending us a message through the contact form starts a conversation — it
        does not create a contract or any obligation on either side. Any actual
        project is governed by a separate written agreement we both sign or accept.
        Please don’t send confidential or sensitive information through the form
        until we’ve agreed how to handle it.
      </P>

      <H2>Free tools</H2>
      <P>
        The tools on this site (such as estimators, generators, and the site health
        check) are provided for convenience and general guidance. Their results are
        estimates and informational only — they are not a guarantee, a formal quote,
        or professional advice, and you shouldn’t rely on them as the sole basis for
        a decision.
      </P>

      <H2>Intellectual property</H2>
      <P>
        The site’s design, text, logos, and original code are owned by M Studio and
        protected by law, except where third-party or open-source materials are
        noted. You may not use our branding or copy it as your own. Anything you
        send us remains yours; you grant us permission to use it only as needed to
        respond to you and provide the site, as described in our{" "}
        <a className="text-signal hover:opacity-80" href="/privacy">
          Privacy Policy
        </a>
        .
      </P>

      <H2>Third-party links and services</H2>
      <P>
        The site may link to or rely on third-party services. We don’t control
        those services and aren’t responsible for their content, availability, or
        practices. Your use of them is governed by their own terms.
      </P>

      <H2>“As is,” and limits on liability</H2>
      <P>
        The site and its tools are provided “as is” and “as available,” without
        warranties of any kind, whether express or implied, to the fullest extent
        the law allows. We don’t promise the site will always be available,
        error-free, or fit for a particular purpose.
      </P>
      <P>
        To the fullest extent permitted by law, M Studio will not be liable for any
        indirect, incidental, or consequential damages arising from your use of the
        site or its free tools. Nothing in these terms limits liability that cannot
        be limited under applicable law.
      </P>

      <H2>Governing law</H2>
      <P>
        These terms are governed by the laws of the State of Maine, without regard
        to its conflict-of-laws rules. Any dispute relating to the site will be
        handled in the state or federal courts located in Maine, and you agree to
        that jurisdiction.
      </P>

      <H2>Changes</H2>
      <P>
        We may update these terms from time to time. When we do, we’ll change the
        “last updated” date above. Continuing to use the site after a change means
        you accept the updated terms.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms? Email{" "}
        <a className="text-signal hover:opacity-80" href="mailto:contact@mlinx.studio">
          contact@mlinx.studio
        </a>{" "}
        or call{" "}
        <a className="text-signal hover:opacity-80" href="tel:+12074329492">
          (207) 432-9492
        </a>
        .
      </P>
    </LegalShell>
  );
}
