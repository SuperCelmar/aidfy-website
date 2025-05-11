import Chatbot from './Chatbot'
import Image from 'next/image'; // Re-enabled import

export default function Hero() {
  return (
    <section className="w-full pt-16 pb-12 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32 xl:pt-28 xl:pb-48 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Reverted to two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="flex flex-col space-y-6 items-center lg:items-start text-center lg:text-left">
            <div className="w-full max-w-md lg:max-w-none">
              <Chatbot />
            </div>
            <p className="text-center lg:text-left text-gray-500 md:text-sm dark:text-gray-400 mt-auto pt-6 w-full max-w-md lg:max-w-none">
              Alternatively, you can directly <a href="/book-demo" className="text-slate-700 hover:underline font-medium">book a demo</a> or <a href="mailto:contact@automationdfy.com" className="text-slate-700 hover:underline font-medium">contact us via email</a>.
            </p>
          </div>

          {/* Right Column: Image - Reinserted */}
          <div className="flex justify-center lg:order-last">
            <Image 
              src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets//hero_caucasian.png" 
              alt="Smiling person - AI Marketing Solutions for AutomationDFY"
              width={550}
              height={550}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-lg"
              priority={true} // Added priority as it's a hero image
            />
          </div> 
        </div>
      </div>
    </section>
  )
} 