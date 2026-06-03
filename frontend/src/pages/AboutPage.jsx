import PageShell from '@/components/common/PageShell';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function AboutPage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6">
            We are <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Voyage</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-3xl mx-auto leading-relaxed">
            Redefining the way you experience the world through intelligent design and seamless technology.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-[2rem] shadow-[0_20px_40px_rgba(42,47,55,0.05)]">
            <div className="prose prose-lg prose-slate text-on-surface-variant max-w-none">
              <p className="text-xl text-on-surface font-bold mb-8">
                Voyage is your ultimate AI-powered travel companion, designed to simplify journey planning and elevate your exploration experiences.
              </p>
              <div className="space-y-6">
                <p>
                  Founded in 2024, our mission is to make global travel accessible, personalized, and seamless. We believe that discovering the world should be as enjoyable as the destination itself. Gone are the days of spending hours comparing prices across dozens of tabs.
                </p>
                <p>
                  By leveraging cutting-edge artificial intelligence, Voyage curates bespoke itineraries, tracks the best deals, and provides intelligent recommendations tailored to your unique interests and preferences. We combine beautiful, intuitive design with powerful backend technology to create a travel ecosystem that works for you.
                </p>
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="font-headline font-bold text-4xl text-primary mb-2">1M+</h3>
                <p className="text-sm text-on-surface-variant uppercase tracking-widest font-bold">Travelers</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-4xl text-primary mb-2">500+</h3>
                <p className="text-sm text-on-surface-variant uppercase tracking-widest font-bold">Destinations</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-4xl text-primary mb-2">24/7</h3>
                <p className="text-sm text-on-surface-variant uppercase tracking-widest font-bold">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8">Ready to start your journey?</h2>
          <Link 
            to={ROUTES.EXPLORE}
            className="inline-flex items-center gap-2 bg-on-surface text-white px-8 py-4 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-transform"
          >
            Explore Destinations <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
