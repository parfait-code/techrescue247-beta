import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
        <p className="mt-2 text-sm text-gray-600">
          Accédez à votre espace client
        </p>
      </div>
      <LoginForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Pas encore de compte?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary/80"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
