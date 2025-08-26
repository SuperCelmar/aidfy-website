import Chatbot from './Chatbot'
import Image from 'next/image'; // Re-enabled import

export default function Hero() {
  return (
    <section className="w-full pt-12 pb-10 md:pt-16 md:pb-16 lg:pt-20 lg:pb-24 xl:pt-24 xl:pb-32 bg-background overflow-x-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="flex flex-col space-y-6 items-center lg:items-start text-center lg:text-left">
            <div className="w-full">
              <Chatbot />
            </div>
            <p className="text-center lg:text-left text-sm text-muted pt-4 md:pt-6 w-full">
              Alternatively, you can directly <a href="/book-demo" className="text-foreground hover:underline font-medium">book a demo</a> or <a href="mailto:contact@automationdfy.com" className="text-foreground hover:underline font-medium">contact us via email</a>.
            </p>
          </div>

          <div className="flex justify-center lg:order-last px-4 sm:px-0">
            <Image 
              src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets//hero_caucasian.png" 
              alt="Smiling person - AI Marketing Solutions for AutomationDFY"
              width={500}
              height={500}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full"
              priority={true}
            />
          </div> 
        </div>
      </div>
    </section>
  )
} 