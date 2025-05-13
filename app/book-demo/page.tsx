import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalComEmbed from '@/components/CalComEmbed';

export default function BookDemoPage() {
  return (
    <>
      <main className="flex-grow bg-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Book a Demo</h1>
            <p className="text-slate-600 mt-2 md:text-lg">
              Schedule a time that works for you to see AutomationDFY in action.
            </p>
          </div>
          <div className="max-w-4xl mx-auto" style={{ height: '700px' }}> {/* Wrapper with defined height */}
            <CalComEmbed 
              calLink="marcel-lin/demo-call" 
              namespace="automationdfy-demo"
              theme="light"
              // The style prop in CalComEmbed defaults to 100% height/width,
              // so it will fill this parent div.
            />
          </div>
        </div>
      </main>
    </>
  );
} 