import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#002E77]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center lg:w-[20%] lg:items-start lg:px-20 lg:text-left">
          <h1 className="mb-6 text-2xl leading-tight font-bold text-white sm:text-3xl lg:text-4xl xl:text-5xl">
            Transforme sua clínica com o poder do agendamento inteligente
          </h1>

          <div className="mb-8">
            <Image
              src="/logoHome.svg"
              alt="Logo"
              width={150}
              height={60}
              className="sm:h-[72px] sm:w-[180px] lg:h-[80px] lg:w-[200px]"
              priority
            />
          </div>

          <Button
            asChild
            className="w-full max-w-[250px] bg-white px-6 py-3 text-base font-semibold text-[#002E77] hover:bg-white/90 sm:px-8 sm:py-4 sm:text-lg lg:w-[200px]"
          >
            <Link href="/dashboard">
              <span>Começar Agora</span>
            </Link>
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-center p-6 lg:w-[80%] lg:p-12">
          <div className="relative aspect-video w-full max-w-4xl">
            <Image
              src="/dashboardHome.png"
              alt="Dashboard Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
