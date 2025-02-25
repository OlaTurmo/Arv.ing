import { Layout } from "components/Layout";

export default function Cookies() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Informasjonskapsler (cookies)</h1>
          
          <div className="prose max-w-none">
            <h2>Hva er informasjonskapsler?</h2>
            <p>
              Informasjonskapsler er små tekstfiler som lagres på din enhet når du besøker 
              nettsiden vår. De hjelper oss å gi deg en bedre brukeropplevelse.
            </p>

            <h2>Hvilke informasjonskapsler bruker vi?</h2>
            <h3>Nødvendige informasjonskapsler</h3>
            <p>
              Disse er essensielle for at nettsiden skal fungere og kan ikke slås av. 
              De inkluderer:
            </p>
            <ul>
              <li>Innloggingsinformasjon</li>
              <li>Sesjons-ID</li>
              <li>Sikkerhetsrelaterte cookies</li>
            </ul>

            <h3>Funksjonelle informasjonskapsler</h3>
            <p>
              Disse hjelper oss å huske dine preferanser og valg for å gi deg en 
              bedre brukeropplevelse:
            </p>
            <ul>
              <li>Språkpreferanser</li>
              <li>Tidligere besøk</li>
              <li>Tilpassede innstillinger</li>
            </ul>

            <h3>Analytiske informasjonskapsler</h3>
            <p>
              Vi bruker disse for å forstå hvordan besøkende bruker nettsiden vår:
            </p>
            <ul>
              <li>Google Analytics</li>
              <li>Brukeroppførselstatistikk</li>
              <li>Feilrapportering</li>
            </ul>

            <h2>Hvordan administrere informasjonskapsler?</h2>
            <p>
              Du kan når som helst endre dine innstillinger for informasjonskapsler. 
              De fleste nettlesere lar deg:
            </p>
            <ul>
              <li>Se hvilke informasjonskapsler du har</li>
              <li>Slette enkelte eller alle informasjonskapsler</li>
              <li>Blokkere informasjonskapsler fra bestemte nettsteder</li>
            </ul>

            <p>
              Merk at å blokkere enkelte informasjonskapsler kan påvirke funksjonaliteten 
              på nettsiden vår.
            </p>

            <h2>Endringer i cookie-policy</h2>
            <p>
              Vi forbeholder oss retten til å oppdatere denne policyen. Større endringer 
              vil bli varslet på nettsiden vår.
            </p>

            <h2>Kontakt oss</h2>
            <p>
              Har du spørsmål om vår bruk av informasjonskapsler, kontakt oss på:
              <br />E-post: ola@arv.ing
              <br />Telefon: +47 123 45 678
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
