import PageShell from '@/components/common/PageShell';

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="bg-background min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Privacy Policy
            </h1>
            <p className="text-on-surface-variant font-medium">Last Updated: October 24, 2024</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-outline-variant/30">
            <div className="prose prose-slate prose-p:text-on-surface-variant prose-headings:font-headline prose-headings:text-on-surface max-w-none">
              <p className="lead text-lg font-medium text-on-surface mb-8">
                Your privacy is profoundly important to us at Voyage. This policy explains how we collect, use, and protect your personal information when you use our travel platform.
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, build a travel itinerary, or contact customer support. This may include your name, email address, payment information, and travel preferences.
              </p>
              <p>
                Additionally, we automatically collect certain information about your device and how you interact with our services, including IP addresses, browser types, and usage data to improve our AI recommendations.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related information, including confirmations and receipts.</li>
                <li>Personalize your experience and deliver AI-generated itineraries tailored to your interests.</li>
                <li>Send technical notices, updates, security alerts, and support messages.</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processors, flight APIs).
              </p>

              <h2>4. Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. All payment data is encrypted using industry-standard protocols.
              </p>

              <h2>5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@voyage.com" className="text-primary font-bold">privacy@voyage.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
