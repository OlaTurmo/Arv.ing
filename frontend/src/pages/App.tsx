import React, { useEffect } from "react";
import { Layout } from "components/Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "app";



export default function App() {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();
  useEffect(() => {
    if (!loading && user) {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  return (
    <Layout showNav={false} showFooter={false}>
      <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="py-4 px-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Arv.ing</div>
          <Button 
            variant="outline"
            onClick={() => navigate('/Login')}
          >
            Logg inn
          </Button>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Arveoppgjør gjort enkelt med AI – Raskere, tryggere og juridisk korrekt
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automatisert arveoppgjør med AI-drevet analyse, boregnskap, dokumenthåndtering og juridisk assistanse. 
            Effektiviser prosessen og unngå konflikter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto text-lg px-8"
              onClick={() => navigate('/Login')}
            >
              Spar tid og penger – Start nå!
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Se 1-minutt demo
            </Button>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 mb-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              GDPR-sertifisert
            </div>
            <div className="group relative">
              <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Brukes av 500+ familier
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
                Over 500 norske familier har valgt Arv.ing for sitt arveoppgjør
              </div>
            </div>
            <div className="group relative">
              <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Advokatanbefalt
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
                Juridisk kvalitetssikret av norske arveadvokater
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-6 mb-8">
            <div className="aspect-video relative bg-white rounded shadow-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p className="text-center">
                  [Placeholder for 30-60 sek video som viser hvordan AI automatiserer arveoppgjøret]
                </p>
              </div>
            </div>
          </div>

          {/* Process steps */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Slik fungerer det</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Last opp dokumenter</h4>
                <p className="text-gray-600">Last opp testamenter, bankutskrifter og andre relevante dokumenter</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">AI analyserer automatisk</h4>
                <p className="text-gray-600">Vår AI har analysert over 10.000 dokumenter med 99% nøyaktighet</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Fordel arv enkelt</h4>
                <p className="text-gray-600">Få oversikt og fordel arv på en rettferdig måte</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Hva sier kundene?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      "Arv.ing gjorde prosessen enkel og trygg. Vi sparte både tid og penger, 
                      og unngikk potensielle konflikter. Anbefales på det sterkeste!"
                    </p>
                    <p className="font-medium">Anne Larsen</p>
                    <p className="text-sm text-gray-500">Fullførte arveoppgjør i januar 2024</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      "AI-analysen sparte oss for mange timer med gjennomgang av dokumenter. 
                      Alt ble håndtert profesjonelt og effektivt."
                    </p>
                    <p className="font-medium">Per Hansen</p>
                    <p className="text-sm text-gray-500">Fullførte arveoppgjør i desember 2023</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      {/* How it works */}
      <section id="how-it-works" className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Slik forenkler vi arveoppgjøret
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Vår AI analyserer testamenter, bankutskrifter og juridiske dokumenter automatisk, 
            og gir deg en fullstendig oversikt på sekunder – uten behov for manuell gjennomgang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-4 sm:p-6">
              <div className="mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-drevet analyse</h3>
              <p className="text-gray-600">Automatisk gjennomgang av dokumenter og økonomiske forhold på sekunder, ikke dager</p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tidsbesparende</h3>
              <p className="text-gray-600">Reduser måneder med arbeid til dager med vår effektive digitale prosess</p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trygg og sikker</h3>
              <p className="text-gray-600">Sikker håndtering av sensitive data med bank-nivå kryptering og GDPR-sertifisering</p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Samarbeid</h3>
              <p className="text-gray-600">Digital plattform for effektivt samarbeid mellom arvinger, reduserer konflikter</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Enkel og transparent prismodell</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Spar tid og penger sammenlignet med tradisjonelle løsninger. 
            Advokathjelp kan koste fra 5.000 NOK til 300.000+ NOK.
          </p>
          <Card className="max-w-lg mx-auto p-4 sm:p-8">
            <h3 className="text-2xl font-bold mb-2">Fast pris per arveoppgjør</h3>
            <div className="mb-4">
              <div className="text-lg text-gray-500 line-through">Vanlig pris: 4.500 NOK</div>
              <div className="text-5xl font-bold text-blue-600">3.000 NOK</div>
              <div className="text-sm text-green-600 font-medium">Lanseringspris – Spar 1.500 NOK nå!</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 text-sm">
              <div className="font-medium text-orange-800 mb-1">Sammenligning med advokatkostnader:</div>
              <ul className="space-y-1 text-orange-700">
                <li>• Advokat: 20.000 – 300.000+ NOK</li>
                <li>• Arv.ing: 3.000 NOK</li>
                <li>• Din besparelse: 90%+ på advokathonorarer!</li>
              </ul>
            </div>
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Ikke fornøyd? Få pengene tilbake innen 14 dager!
              </span>
            </div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ubegrenset tilgang til alle verktøy
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                AI-drevet dokumentanalyse
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Juridisk assistanse og maler
              </li>
            </ul>
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate('/Login')}
            >
              Start nå
            </Button>
          </Card>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Om Arv.ing</h3>
              <p className="text-gray-400 text-sm">
                Arv.ing er en norskutviklet AI-plattform som hjelper familier med trygge og effektive arveoppgjør. 
                Vi kombinerer juridisk ekspertise med automatisering for å spare deg tid og penger.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Lenker</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#how-it-works" className="hover:text-white">Slik fungerer det</a></li>
                <li><a href="#" className="hover:text-white">Priser</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Kontakt oss</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>E-post: ola@arv.ing</li>
                <li>Telefon: +47 123 45 678</li>
                <li>Chat: Åpen 09-17</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Sikkerhet</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  GDPR-sertifisert
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Bank-nivå sikkerhet
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Arv.ing. Alle rettigheter reservert.</p>
            <div className="mt-2">
              <a href="#" className="hover:text-white">Personvern</a> · 
              <a href="#" className="hover:text-white">Vilkår</a> · 
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Arv.ing er GDPR-kompatibel og bruker bank-nivå kryptering for å beskytte dine data. 
              Alle transaksjoner er sikret med Stripe betalingsløsning.
            </div>
          </div>
        </div>
      </footer>
      </div>
    </Layout>
  );
}
