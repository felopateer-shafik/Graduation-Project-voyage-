import PageShell from '@/components/common/PageShell';

export default function ContactPage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6">
            Get in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about your booking, need technical support, or just want to say hello, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-lg hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-2">Customer Support</h3>
            <p className="text-on-surface-variant mb-6 flex-1">Available 24/7 for all booking and account inquiries.</p>
            <a href="mailto:support@voyage.com" className="text-primary font-bold hover:underline">support@voyage.com</a>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-lg hover:-translate-y-1 transition-transform flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6 relative z-10">
              <span className="material-symbols-outlined text-3xl">handshake</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-2 relative z-10">Partnerships</h3>
            <p className="text-on-surface-variant mb-6 flex-1 relative z-10">Interested in partnering with Voyage? Reach out to our business team.</p>
            <a href="mailto:partners@voyage.com" className="text-secondary font-bold hover:underline relative z-10">partners@voyage.com</a>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-lg hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-2">Office</h3>
            <p className="text-on-surface-variant mb-6 flex-1">123 Horizon Blvd, Suite 400<br/>Cairo, Egypt 11511</p>
            <a href="#" className="text-primary font-bold hover:underline">View on Map</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
