import { Layout } from "components/Layout";

export default function Personvern() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Personvernerklæring</h1>
          
          <div className="prose max-w-none">
            <h2>1. Innledning</h2>
            <p>
              Arv.ing tar personvern på alvor. Denne personvernerklæringen forklarer hvordan vi samler inn, 
              bruker og beskytter dine personopplysninger når du bruker vår tjeneste.
            </p>

            <h2>2. Hvilke opplysninger vi samler inn</h2>
            <p>Vi samler inn følgende typer personopplysninger:</p>
            <ul>
              <li>Kontaktinformasjon (navn, e-post, telefonnummer)</li>
              <li>Påloggingsinformasjon</li>
              <li>Informasjon om arveoppgjør og relaterte dokumenter</li>
              <li>Brukeraktivitet på plattformen</li>
            </ul>

            <h2>3. Hvordan vi bruker opplysningene</h2>
            <p>Vi bruker personopplysningene til å:</p>
            <ul>
              <li>Levere og forbedre våre tjenester</li>
              <li>Kommunisere med deg om tjenesten</li>
              <li>Sikre at plattformen fungerer optimalt</li>
              <li>Overholde juridiske forpliktelser</li>
            </ul>

            <h2>4. Informasjonssikkerhet</h2>
            <p>
              Vi bruker bransjestandardiserte sikkerhetstiltak for å beskytte dine personopplysninger, 
              inkludert kryptering og sikker datalagring.
            </p>

            <h2>5. Deling av opplysninger</h2>
            <p>
              Vi deler kun personopplysninger med tredjeparter når det er nødvendig for å levere 
              tjenesten eller når vi er pålagt ved lov.
            </p>

            <h2>6. Dine rettigheter</h2>
            <p>Du har rett til å:</p>
            <ul>
              <li>Få innsyn i dine personopplysninger</li>
              <li>Korrigere feilaktige opplysninger</li>
              <li>Slette dine opplysninger</li>
              <li>Protestere mot behandling av opplysninger</li>
            </ul>

            <h2>7. Kontaktinformasjon</h2>
            <p>
              Har du spørsmål om personvern, kontakt oss på:
              <br />E-post: ola@arv.ing
              <br />Telefon: +47 123 45 678
            </p>

            <h2>8. Endringer i personvernerklæringen</h2>
            <p>
              Vi forbeholder oss retten til å oppdatere denne personvernerklæringen. 
              Større endringer vil bli varslet via e-post eller på plattformen.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
