import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez-nous pour bénéficier de notre support IT
        </p>
      </div>
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Déjà un compte?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary/80"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
