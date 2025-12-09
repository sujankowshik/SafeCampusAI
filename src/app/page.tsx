import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export default function Home() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'hero-campus');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
            SafeCampus AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            Anonymously report safety incidents on campus. Your voice matters.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <Link href="/report">Report an Incident</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-card py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-headline font-semibold">Anonymous Reporting</h3>
              <p className="mt-2 text-muted-foreground">
                Submit reports without revealing your identity. We prioritize your privacy and security.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-headline font-semibold">AI-Powered Analysis</h3>
              <p className="mt-2 text-muted-foreground">
                Our system uses AI to classify incidents and assess risk, ensuring a faster response.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-headline font-semibold">Track Your Reports</h3>
              <p className="mt-2 text-muted-foreground">
                Authenticated users can track the status of their submitted reports in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
