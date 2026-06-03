import PageShell from '@/components/common/PageShell';

const POSITIONS = [
  { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote / Cairo' },
  { title: 'Product Designer', department: 'Design', location: 'Remote' },
  { title: 'AI Research Scientist', department: 'Data', location: 'Dubai / Remote' },
  { title: 'Travel Experience Manager', department: 'Operations', location: 'Cairo' },
];

export default function CareersPage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6">
            Join the <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-3xl mx-auto leading-relaxed">
            We're building the future of travel. Come help us make the world more accessible and beautifully designed.
          </p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold mb-6">Work from anywhere. <br/> Impact everywhere.</h2>
            <div className="prose prose-lg prose-slate text-on-surface-variant">
              <p>
                At Voyage, we value autonomy, creativity, and a relentless focus on the user. Our team is globally distributed, united by a passion for exploring the world and building exceptional software.
              </p>
              <p>
                We offer competitive compensation, flexible hours, comprehensive health coverage, and of course, an annual travel stipend to encourage you to experience the world.
              </p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-md border border-white/40 p-8 rounded-[2rem] shadow-xl">
            <h3 className="font-headline text-xl font-bold mb-6">Open Positions</h3>
            <div className="space-y-4">
              {POSITIONS.map((pos, i) => (
                <div key={i} className="group bg-white rounded-2xl p-4 border border-outline-variant/30 hover:border-primary/50 transition-colors flex justify-between items-center cursor-pointer shadow-sm hover:shadow-md">
                  <div>
                    <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{pos.title}</h4>
                    <p className="text-sm text-on-surface-variant">{pos.department} • {pos.location}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-on-surface-variant font-medium">Don't see a fit? <a href="mailto:careers@voyage.com" className="text-primary hover:underline">Email us anyway.</a></p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
