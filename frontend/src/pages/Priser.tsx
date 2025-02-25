import { Layout } from "components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Priser() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Enkel og transparent prising</h1>
          <p className="text-xl text-gray-600 mb-12">
            Ett arveoppgjør, én pris - ingen skjulte kostnader
          </p>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">
                3.000 NOK
              </div>
              <div className="text-gray-500 mb-8">per arveoppgjør</div>

              <div className="grid gap-4 text-left mb-8 w-full max-w-md">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Komplett digital bobehandling</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>AI-drevet dokumentanalyse</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Automatisert boregnskap</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Juridisk kvalitetssikring</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Sikker digital lagring</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full max-w-md"
                onClick={() => navigate("/login")}
              >
                Kom i gang
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Ingen skjulte kostnader</h3>
              <p className="text-gray-600">
                Alt er inkludert i prisen. Ingen ekstra gebyrer eller tilleggstjenester 
                å bekymre seg for.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Betal kun ved bruk</h3>
              <p className="text-gray-600">
                Ingen månedlige avgifter eller abonnementer. Du betaler kun for 
                arveoppgjørene du håndterer.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">14 dagers angrefrist</h3>
              <p className="text-gray-600">
                Er du ikke fornøyd? Du har full angrerett i 14 dager etter kjøp, 
                ingen spørsmål stilt.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg text-left">
            <h2 className="text-xl font-semibold mb-4">Vanlige spørsmål om prising</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Hva hvis boet er komplisert?</h3>
                <p className="text-gray-600">
                  Prisen er den samme uansett boets kompleksitet. Vår AI-teknologi 
                  håndterer effektivt både enkle og komplekse arveoppgjør.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Er juridisk bistand inkludert?</h3>
                <p className="text-gray-600">
                  Ja, grunnleggende juridisk kvalitetssikring er inkludert. For mer 
                  omfattende juridisk bistand kan det tilkomme ekstra kostnader.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Hvor lenge har jeg tilgang?</h3>
                <p className="text-gray-600">
                  Du har ubegrenset tilgang til all dokumentasjon og historikk for 
                  arveoppgjøret, også etter at det er ferdigstilt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
