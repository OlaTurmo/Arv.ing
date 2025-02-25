import { Layout } from "components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a backend
    toast.success("Takk for din henvendelse! Vi vil kontakte deg snart.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Kontakt oss</h1>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-semibold mb-4">Vi er her for å hjelpe</h2>
              <p className="text-gray-600 mb-6">
                Har du spørsmål om arveoppgjør eller våre tjenester? Ta gjerne kontakt 
                med oss. Vi svarer normalt innen 24 timer på hverdager.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Besøksadresse</h3>
                  <p className="text-gray-600">
                    Storgata 1<br />
                    0155 Oslo<br />
                    Norge
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Kontaktinformasjon</h3>
                  <p className="text-gray-600">
                    E-post: ola@arv.ing<br />
                    Telefon: +47 123 45 678<br />
                    Chat: Tilgjengelig 09-17 på hverdager
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Åpningstider</h3>
                  <p className="text-gray-600">
                    Mandag - Fredag: 09:00 - 17:00<br />
                    Lørdag - Søndag: Stengt
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Send oss en melding</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Navn
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-post
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Melding
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send melding
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>
                  Ved å sende inn dette skjemaet samtykker du til at vi kan kontakte 
                  deg på e-post eller telefon. Vi behandler dine personopplysninger i 
                  henhold til vår personvernerklæring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
