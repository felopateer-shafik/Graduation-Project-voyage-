/**
 * AtmosphericBackground — Floating cloud silhouettes for ethereal pages
 * Used on auth pages and landing page
 */
export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="cloud-silhouette animate-float"
        style={{ width: '500px', height: '250px', top: '-50px', left: '-80px' }}
      />
      <div
        className="cloud-silhouette animate-float-slow"
        style={{ width: '600px', height: '300px', top: '30%', right: '-120px', opacity: 0.4 }}
      />
      <div
        className="cloud-silhouette animate-float-reverse"
        style={{ width: '400px', height: '200px', bottom: '10%', left: '15%', opacity: 0.3 }}
      />
      <div
        className="cloud-silhouette"
        style={{ width: '700px', height: '350px', bottom: '-100px', right: '10%', opacity: 0.2 }}
      />
    </div>
  );
}
