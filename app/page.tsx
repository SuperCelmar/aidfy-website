import Hero from '@/components/Hero'
// import ProblemSolution from '@/components/ProblemSolution'
import { SparklingPartnersStrip } from '@/components/SparklingPartnersStrip'
import BenefitsSection from '@/components/BenefitsSection'
import FeaturesTimeline from '@/components/FeaturesTimeline'
import UseCasesSection from '@/components/UseCasesSection'
import IntegrationsCloudSection from '@/components/IntegrationsCloudSection'
import { IconEntry } from '@/components/ui/interactive-icon-cloud';

const partnerIconEntries: IconEntry[] = [
  // Simple Icons (using slugs)
  { type: 'slug', slug: 'make' }, 
  { type: 'slug', slug: 'n8n' },
  // Vapi will be custom below
  { type: 'slug', slug: 'whatsapp' },
  { type: 'slug', slug: 'openai' },
  { type: 'slug', slug: 'instagram' },
  { type: 'slug', slug: 'facebook' },
  { type: 'slug', slug: 'telegram' },
  { type: 'slug', slug: 'gohighlevel' },
  { type: 'slug', slug: 'twilio' },
  { type: 'slug', slug: 'googlegemini' },
  { type: 'slug', slug: 'zapier' },
  { type: 'slug', slug: 'hubspot' },
  { type: 'slug', slug: 'notion' },
  { type: 'slug', slug: 'supabase' },
  { type: 'slug', slug: 'googlesheets'},
  // Voiceflow will be custom below
  { type: 'slug', slug: 'googlecalendar'},
];

export default function HomePage() {
  return (
    <>
      <main className="flex-grow bg-white">
        <Hero />
        <SparklingPartnersStrip />
        <FeaturesTimeline />
        <BenefitsSection />
        <UseCasesSection />
        <IntegrationsCloudSection iconEntries={partnerIconEntries} />
      </main>
    </>
  )
} 