import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-blue-100">Dernière mise à jour : 28 Juin 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <h2 className="text-2xl font-bold mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="mb-6">
                En utilisant les services de TechRescue247, vous acceptez
                d&apos;être lié par ces conditions d&apos;utilisation. Si vous
                n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos
                services.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                2. Description des services
              </h2>
              <p className="mb-6">
                TechRescue247 fournit des services de support informatique,
                incluant mais non limités à :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Support technique HelpDesk 24/7</li>
                <li>Gestion d&apos;infrastructure IT</li>
                <li>Migration cloud</li>
                <li>Développement d&apos;applications</li>
                <li>Services de consultation IT</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                3. Utilisation acceptable
              </h2>
              <p className="mb-6">
                Vous vous engagez à utiliser nos services de manière légale et
                éthique. Il est interdit de :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Utiliser nos services pour des activités illégales</li>
                <li>Tenter de compromettre la sécurité de nos systèmes</li>
                <li>Transmettre des virus ou codes malveillants</li>
                <li>Usurper l&apos;identité d&apos;une autre personne</li>
                <li>Harceler ou nuire à d&apos;autres utilisateurs</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">4. Compte utilisateur</h2>
              <p className="mb-6">
                Pour accéder à certains services, vous devez créer un compte.
                Vous êtes responsable de :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Maintenir la confidentialité de vos identifiants</li>
                <li>Toutes les activités effectuées sous votre compte</li>
                <li>
                  Nous notifier immédiatement de toute utilisation non autorisée
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                5. Propriété intellectuelle
              </h2>
              <p className="mb-6">
                Tout le contenu présent sur notre plateforme, incluant textes,
                graphiques, logos, et logiciels, est la propriété de
                TechRescue247 ou de ses partenaires et est protégé par les lois
                sur la propriété intellectuelle.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                6. Limitation de responsabilité
              </h2>
              <p className="mb-6">
                TechRescue247 s&apos;efforce de fournir des services de qualité,
                mais ne peut garantir :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>L&apos;absence totale d&apos;interruptions de service</li>
                <li>L&apos;exactitude absolue de toutes les informations</li>
                <li>La résolution de tous les problèmes techniques</li>
              </ul>
              <p className="mb-6">
                Notre responsabilité est limitée au montant des frais de service
                payés.
              </p>

              <h2 className="text-2xl font-bold mb-4">7. Confidentialité</h2>
              <p className="mb-6">
                La protection de vos données est importante pour nous. Veuillez
                consulter notre
                <a
                  href="/privacy"
                  className="text-primary hover:underline ml-1"
                >
                  Politique de confidentialité
                </a>
                pour comprendre comment nous collectons et utilisons vos
                informations.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                8. Modifications des conditions
              </h2>
              <p className="mb-6">
                Nous nous réservons le droit de modifier ces conditions à tout
                moment. Les modifications entrent en vigueur dès leur
                publication sur notre site. Votre utilisation continue des
                services constitue votre acceptation des conditions modifiées.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Résiliation</h2>
              <p className="mb-6">
                Nous pouvons suspendre ou résilier votre accès aux services en
                cas de violation de ces conditions ou pour toute autre raison à
                notre discrétion.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Droit applicable</h2>
              <p className="mb-6">
                Ces conditions sont régies par les lois du Cameroun. Tout litige
                sera soumis à la juridiction exclusive des tribunaux de Yaoundé.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
              <p className="mb-6">
                Pour toute question concernant ces conditions
                d&apos;utilisation, veuillez nous contacter :
              </p>
              <ul className="list-none mb-6">
                <li>Email : contact@techrescue247.com</li>
                <li>Téléphone : +237 658 375 813</li>
                <li>Adresse : Mimboman Terminus, Yaoundé, Centre, Cameroun</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
