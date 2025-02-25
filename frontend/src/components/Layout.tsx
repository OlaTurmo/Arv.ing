import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Mail as MailIcon } from "lucide-react";
import { useCurrentUser } from "app";
import { useInvitationsStore } from "utils/invitationsStore";

interface Props {
  showFooter?: boolean;
  children: React.ReactNode;
  showNav?: boolean;
  className?: string;
}

export function Layout({ children, showNav = true, showFooter = true, className = '' }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useCurrentUser();
  const { invitations, loadInvitations } = useInvitationsStore();

  useEffect(() => {
    if (user?.email) {
      loadInvitations(user.email);
    }
  }, [user?.email, loadInvitations]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      {showNav && (
        <nav className="py-4 px-4 border-b sticky top-0 bg-white z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div 
              className="text-2xl font-bold text-blue-600 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Arv.ing
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/invitations')}
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <MailIcon className="h-4 w-4" />
                      {invitations.length > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                        >
                          {invitations.length}
                        </Badge>
                      )}
                    </div>
                    Invitasjoner
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/documents')}
                  >
                    Dokumenter
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/transactions')}
                  >
                    Transaksjoner
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/logout')}
                  >
                    Logg ut
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Logg inn
                </Button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
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
                <h3 className="text-lg font-semibold mb-4">Informasjon</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><button onClick={() => navigate("/Priser")} className="hover:text-white">Priser</button></li>
                  <li><button onClick={() => navigate("/FAQ")} className="hover:text-white">FAQ</button></li>
                  <li><button onClick={() => navigate("/Personvern")} className="hover:text-white">Personvern</button></li>
                  <li><button onClick={() => navigate("/Vilkar")} className="hover:text-white">Vilkår</button></li>
                  <li><button onClick={() => navigate("/Cookies")} className="hover:text-white">Cookies</button></li>
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
              <p>© {new Date().getFullYear()} Arv.ing. Alle rettigheter reservert.</p>
              <div className="mt-4 text-xs text-gray-500">
                Arv.ing er GDPR-kompatibel og bruker bank-nivå kryptering for å beskytte dine data. 
                Alle transaksjoner er sikret med Stripe betalingsløsning.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}