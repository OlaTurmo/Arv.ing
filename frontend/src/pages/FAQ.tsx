import { Layout } from "components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Vanlige spørsmål</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Generelt om tjenesten</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is">
                  <AccordionTrigger>Hva er Arv.ing?</AccordionTrigger>
                  <AccordionContent>
                    Arv.ing er en digital plattform som forenkler arveoppgjør ved hjelp av 
                    AI-teknologi. Vi tilbyr automatisert boregnskap, dokumenthåndtering, 
                    og juridisk assistanse for å gjøre prosessen enklere og mer effektiv.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-works">
                  <AccordionTrigger>Hvordan fungerer tjenesten?</AccordionTrigger>
                  <AccordionContent>
                    Du laster opp relevante dokumenter som bankkontoutskrifter og 
                    forsikringspapirer. Vår AI analyserer dokumentene, kategoriserer 
                    eiendeler og gjeld, og hjelper deg med å håndtere hele arveoppgjøret 
                    digitalt.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="who-can-use">
                  <AccordionTrigger>Hvem kan bruke Arv.ing?</AccordionTrigger>
                  <AccordionContent>
                    Arv.ing kan brukes av privatpersoner som skal håndtere et dødsbo, 
                    advokater som jobber med arveoppgjør, og andre profesjonelle aktører 
                    i bransjen.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Sikkerhet og personvern</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="data-security">
                  <AccordionTrigger>Hvordan sikres mine data?</AccordionTrigger>
                  <AccordionContent>
                    Vi bruker bank-nivå sikkerhet med ende-til-ende-kryptering. Alle data 
                    lagres i Norge og behandles i henhold til GDPR. Vi har også 
                    regelmessige sikkerhetsrevisjoner.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="data-sharing">
                  <AccordionTrigger>Deles mine data med andre?</AccordionTrigger>
                  <AccordionContent>
                    Nei, dine data deles ikke med tredjeparter med mindre det er 
                    nødvendig for å utføre tjenesten eller vi er pålagt det ved lov. 
                    Du har full kontroll over dine data.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Priser og betaling</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pricing">
                  <AccordionTrigger>Hva koster tjenesten?</AccordionTrigger>
                  <AccordionContent>
                    Arv.ing koster 3.000 NOK per arveoppgjør. Dette er en engangspris 
                    som inkluderer all funksjonalitet: dokumentanalyse, boregnskap, 
                    juridisk kvalitetssikring og digital lagring.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-methods">
                  <AccordionTrigger>Hvilke betalingsmetoder aksepteres?</AccordionTrigger>
                  <AccordionContent>
                    Vi aksepterer alle vanlige betalingskort (VISA, Mastercard) og 
                    faktura. Betalingen prosesseres sikkert gjennom vår 
                    betalingsleverandør Stripe.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refund">
                  <AccordionTrigger>Kan jeg få pengene tilbake?</AccordionTrigger>
                  <AccordionContent>
                    Ja, vi tilbyr 14 dagers angrerett. Hvis du ikke er fornøyd med 
                    tjenesten, refunderer vi hele beløpet uten spørsmål.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Teknisk støtte</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="support">
                  <AccordionTrigger>Hvordan får jeg hjelp?</AccordionTrigger>
                  <AccordionContent>
                    Vi tilbyr kundeservice via e-post, telefon og chat. Vårt 
                    støtteteam er tilgjengelig på hverdager mellom 09:00 og 17:00.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="technical-requirements">
                  <AccordionTrigger>Hvilke tekniske krav stilles?</AccordionTrigger>
                  <AccordionContent>
                    Du trenger bare en moderne nettleser og internettilkobling. 
                    Tjenesten fungerer på både PC, nettbrett og mobil.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Fant du ikke svaret?</h2>
            <p className="mb-4">
              Kontakt oss gjerne hvis du har andre spørsmål. Vi er her for å hjelpe!
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>E-post: ola@arv.ing</li>
              <li>Telefon: +47 123 45 678</li>
              <li>Chat: Tilgjengelig på hverdager 09-17</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
