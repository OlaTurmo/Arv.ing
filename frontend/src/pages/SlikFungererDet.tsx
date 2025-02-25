import { Layout } from "components/Layout";

export default function SlikFungererDet() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Slik fungerer Arv.ing</h1>
          
          <div className="prose max-w-none">
            <section className="mb-12">
              <h2>1. Registrer dødsfallet</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>
                  Start prosessen ved å registrere grunnleggende informasjon om avdøde og 
                  dødsfallet. Du trenger:
                </p>
                <ul>
                  <li>Avdødes personalia</li>
                  <li>Dødsattest eller skifteattest</li>
                  <li>Oversikt over nærmeste pårørende</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2>2. Last opp dokumenter</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>
                  Vår AI-teknologi hjelper deg med å analysere og organisere viktige dokumenter:
                </p>
                <ul>
                  <li>Bankkontoutskrifter</li>
                  <li>Forsikringspapirer</li>
                  <li>Eiendomsdokumenter</li>
                  <li>Testamente (hvis det finnes)</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2>3. Automatisk boregnskap</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>
                  Systemet vårt:
                </p>
                <ul>
                  <li>Identifiserer eiendeler og gjeld</li>
                  <li>Kategoriserer transaksjoner</li>
                  <li>Beregner arveavgift (hvis aktuelt)</li>
                  <li>Lager oversiktlig booppgjør</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2>4. Håndtering av abonnementer</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>
                  Vi hjelper deg med å:
                </p>
                <ul>
                  <li>Identifisere aktive abonnementer</li>
                  <li>Generere oppsigelsesbrever</li>
                  <li>Spøre tilbakebetaling av forskuddsbetalte tjenester</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2>5. Fordeling av arv</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>
                  Plattformen vår:
                </p>
                <ul>
                  <li>Beregner arveandeler etter norsk lov</li>
                  <li>Håndterer særskilt arverett</li>
                  <li>Dokumenterer alle utbetalinger</li>
                  <li>Sikrer rettferdig fordeling</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2>6. Juridisk støtte</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>
                  Ved behov kan du:
                </p>
                <ul>
                  <li>Få juridisk veiledning</li>
                  <li>Generere nødvendige juridiske dokumenter</li>
                  <li>Få hjelp med kompliserte arvespørsmål</li>
                </ul>
              </div>
            </section>

            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2>Kom i gang</h2>
              <p>
                Start prosessen i dag for kun 3.000 NOK. Prisen inkluderer:
              </p>
              <ul>
                <li>Komplett digital bobehandling</li>
                <li>AI-drevet dokumentanalyse</li>
                <li>Automatisert boregnskap</li>
                <li>Juridisk kvalitetssikring</li>
                <li>Sikker digital lagring</li>
              </ul>
              <p className="mt-4">
                Har du spørsmål? Kontakt oss på ola@arv.ing eller +47 123 45 678
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
