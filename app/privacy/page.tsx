import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-blue-100">Dernière mise à jour : 28 Juin 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="mb-6">
                Chez TechRescue247, nous prenons la protection de vos données
                personnelles très au sérieux. Cette politique de confidentialité
                explique comment nous collectons, utilisons, stockons et
                protégeons vos informations personnelles.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                2. Informations que nous collectons
              </h2>
              <p className="mb-4">
                Nous collectons plusieurs types d&apos;informations :
              </p>

              <h3 className="text-xl font-semibold mb-3">
                2.1 Informations fournies directement
              </h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Nom de l&apos;entreprise</li>
                <li>Adresse de facturation</li>
                <li>Informations de paiement</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                2.2 Informations collectées automatiquement
              </h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Pages visitées</li>
                <li>Durée des visites</li>
                <li>Informations sur l&apos;appareil</li>
                <li>Cookies et technologies similaires</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                3. Comment nous utilisons vos informations
              </h2>
              <p className="mb-4">Nous utilisons vos informations pour :</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter vos demandes de support</li>
                <li>Envoyer des communications importantes</li>
                <li>Personnaliser votre expérience</li>
                <li>Analyser l&apos;utilisation de nos services</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
                <li>Respecter nos obligations légales</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                4. Partage des informations
              </h2>
              <p className="mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons
                partager vos informations avec :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Prestataires de services :</strong> Pour nous aider à
                  fournir nos services
                </li>
                <li>
                  <strong>Partenaires commerciaux :</strong> Avec votre
                  consentement explicite
                </li>
                <li>
                  <strong>Autorités légales :</strong> Si requis par la loi
                </li>
                <li>
                  <strong>En cas de fusion ou acquisition :</strong> Vos données
                  peuvent être transférées
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                5. Sécurité des données
              </h2>
              <p className="mb-6">
                Nous mettons en œuvre des mesures de sécurité techniques et
                organisationnelles pour protéger vos données, incluant :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Chiffrement des données sensibles</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Surveillance continue de nos systèmes</li>
                <li>Formation régulière de notre personnel</li>
                <li>Audits de sécurité périodiques</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                6. Conservation des données
              </h2>
              <p className="mb-6">
                Nous conservons vos données personnelles aussi longtemps que
                nécessaire pour :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Fournir nos services</li>
                <li>Respecter nos obligations légales</li>
                <li>Résoudre les litiges</li>
                <li>Faire respecter nos accords</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">7. Vos droits</h2>
              <p className="mb-4">Vous avez le droit de :</p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Accéder</strong> à vos données personnelles
                </li>
                <li>
                  <strong>Rectifier</strong> les informations inexactes
                </li>
                <li>
                  <strong>Supprimer</strong> vos données (droit à l&apos;oubli)
                </li>
                <li>
                  <strong>Limiter</strong> le traitement de vos données
                </li>
                <li>
                  <strong>Vous opposer</strong> à certains traitements
                </li>
                <li>
                  <strong>Recevoir</strong> vos données dans un format portable
                </li>
                <li>
                  <strong>Retirer</strong> votre consentement à tout moment
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">8. Cookies</h2>
              <p className="mb-6">
                Nous utilisons des cookies pour améliorer votre expérience. Vous
                pouvez gérer vos préférences de cookies via les paramètres de
                votre navigateur. Types de cookies utilisés :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Cookies essentiels :</strong> Nécessaires au
                  fonctionnement du site
                </li>
                <li>
                  <strong>Cookies de performance :</strong> Pour analyser
                  l&apos;utilisation du site
                </li>
                <li>
                  <strong>Cookies de fonctionnalité :</strong> Pour mémoriser
                  vos préférences
                </li>
                <li>
                  <strong>Cookies de marketing :</strong> Pour personnaliser les
                  publicités (avec consentement)
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">
                9. Transferts internationaux
              </h2>
              <p className="mb-6">
                Vos données peuvent être transférées et stockées dans des pays
                autres que le Cameroun. Nous nous assurons que ces transferts
                sont effectués conformément aux lois applicables sur la
                protection des données.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                10. Protection des mineurs
              </h2>
              <p className="mb-6">
                Nos services ne sont pas destinés aux personnes de moins de 18
                ans. Nous ne collectons pas sciemment des informations
                personnelles de mineurs.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                11. Modifications de cette politique
              </h2>
              <p className="mb-6">
                Nous pouvons mettre à jour cette politique de confidentialité.
                Nous vous informerons de tout changement important par email ou
                via une notification sur notre site.
              </p>

              <h2 className="text-2xl font-bold mb-4">12. Nous contacter</h2>
              <p className="mb-4">
                Pour toute question concernant cette politique ou vos données
                personnelles :
              </p>
              <ul className="list-none mb-6">
                <li>
                  <strong>Délégué à la protection des données :</strong>{" "}
                  dpo@techrescue247.com
                </li>
                <li>
                  <strong>Email général :</strong> privacy@techrescue247.com
                </li>
                <li>
                  <strong>Téléphone :</strong> +237 123 456 789
                </li>
                <li>
                  <strong>Adresse :</strong> TechRescue247, Yaoundé, Centre,
                  Cameroun
                </li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <p className="text-sm text-blue-800">
                  <strong>Note importante :</strong> En utilisant nos services,
                  vous acceptez cette politique de confidentialité. Si vous
                  n&apos;êtes pas d&apos;accord avec ces termes, veuillez ne pas
                  utiliser nos services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
