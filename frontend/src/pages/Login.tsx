import { SignInOrUpForm, useCurrentUser } from "app"
import { Layout } from "components/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <Layout showNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Velkommen til Arv.ing</h1>
            <p className="text-gray-600">Logg inn for å fortsette med arveoppgjøret</p>
          </div>
          <SignInOrUpForm signInOptions={{ google: true }} />
        </div>
      </div>
    </Layout>
  );
};