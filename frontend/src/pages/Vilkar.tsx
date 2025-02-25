import { Layout } from "components/Layout";

export default function Vilkar() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Vilkår for bruk</h1>
          
          <div className="prose max-w-none">
            <h2>1. Aksept av vilkår</h2>
            <p>
              Ved å bruke Arv.ing aksepterer du disse brukervilkårene. Hvis du ikke aksepterer 
              vilkårene, må du ikke bruke tjenesten.
            </p>

            <h2>2. Tjenestebeskrivelse</h2>
            <p>
              Arv.ing er en digital plattform for håndtering av arveoppgjør. Tjenesten inkluderer:
            </p>
            <ul>
              <li>AI-drevet dokumentanalyse</li>
              <li>Digital håndtering av arveoppgjør</li>
              <li>Automatisert boregnskap</li>
              <li>Juridisk assistanse</li>
            </ul>

            <h2>3. Brukerforpliktelser</h2>
            <p>Som bruker forplikter du deg til å:</p>
            <ul>
              <li>Gi korrekt og fullstendig informasjon</li>
              <li>Beskytte ditt passord og kontoopplysninger</li>
              <li>Ikke misbruke tjenesten</li>
              <li>Overholde norsk lov</li>
            </ul>

            <h2>4. Betaling og refusjon</h2>
            <p>
              Tjenesten koster 3.000 NOK per arveoppgjør. Betalingen gjennomføres via vår 
              sikre betalingsløsning. Vi tilbyr 14 dagers angrerett.
            </p>

            <h2>5. Ansvarsbegrensning</h2>
            <p>
              Arv.ing er et verktøy for å forenkle arveoppgjør, men erstatter ikke juridisk 
              rådgivning. Vi er ikke ansvarlige for:
            </p>
            <ul>
              <li>Feil i brukeroppgitt informasjon</li>
              <li>Tap som følge av systemfeil eller nedetid</li>
              <li>Indirekte tap eller følgeskader</li>
            </ul>

            <h2>6. Immaterielle rettigheter</h2>
            <p>
              Alt innhold og funksjonalitet på plattformen er beskyttet av opphavsrett og 
              tilhører Arv.ing.
            </p>

            <h2>7. Oppsigelse</h2>
            <p>
              Vi forbeholder oss retten til å avslutte eller suspendere kontoer som bryter 
              disse vilkårene.
            </p>

            <h2>8. Endringer i vilkårene</h2>
            <p>
              Vi kan endre disse vilkårene med 30 dagers varsel. Fortsatt bruk av tjenesten 
              etter endringer anses som aksept av nye vilkår.
            </p>

            <h2>9. Kontakt</h2>
            <p>
              For spørsmål om vilkårene, kontakt oss på:
              <br />E-post: ola@arv.ing
              <br />Telefon: +47 123 45 678
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
