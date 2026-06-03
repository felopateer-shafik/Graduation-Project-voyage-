import PageShell from '@/components/common/PageShell';

export default function TermsPage() {
  return (
    <PageShell>
      <div className="bg-background min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Terms of Service
            </h1>
            <p className="text-on-surface-variant font-medium">Last Updated: October 24, 2024</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-outline-variant/30">
            <div className="prose prose-slate prose-p:text-on-surface-variant prose-headings:font-headline prose-headings:text-on-surface max-w-none">
              <p className="lead text-lg font-medium text-on-surface mb-8">
                Welcome to Voyage. Please read these Terms of Service carefully before using our platform. By accessing or using Voyage, you agree to be bound by these terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By creating an account or using our services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not access or use the platform.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Voyage provides a platform for discovering, planning, and booking travel experiences, including flights and accommodations, utilizing artificial intelligence to generate recommendations. We act as an intermediary between you and third-party travel providers.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2>4. Booking and Payments</h2>
              <p>
                When you make a booking through Voyage, you agree to the specific terms and conditions of the third-party providers (airlines, hotels). Prices and availability are subject to change until confirmed. Voyage is not responsible for cancellations or changes made by third-party providers.
              </p>

              <h2>5. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Voyage shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>

              <h2>6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of these Terms and maintaining a log of previous versions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
