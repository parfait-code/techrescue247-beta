import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Mentions légales</h1>
          <p className="text-blue-100">
            Informations légales et réglementaires
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <h2 className="text-2xl font-bold mb-4">1. Éditeur du site</h2>
              <div className="mb-6">
                <p className="mb-2">
                  <strong>Raison sociale :</strong> TechRescue247 SARL
                </p>
                <p className="mb-2">
                  <strong>Capital social :</strong> 10 000 000 FCFA
                </p>
                <p className="mb-2">
                  <strong>Siège social :</strong> Avenue Kennedy, Yaoundé,
                  Centre, Cameroun
                </p>
                <p className="mb-2">
                  <strong>Numéro RCCM :</strong> CM-YAO-01-2010-B12-00123
                </p>
                <p className="mb-2">
                  <strong>Numéro de contribuable :</strong> M012345678901P
                </p>
                <p className="mb-2">
                  <strong>Téléphone :</strong> +237 123 456 789
                </p>
                <p className="mb-2">
                  <strong>Email :</strong> contact@techrescue247.com
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                2. Directeur de la publication
              </h2>
              <div className="mb-6">
                <p className="mb-2">
                  <strong>Nom :</strong> Jean-Paul Mbarga
                </p>
                <p className="mb-2">
                  <strong>Fonction :</strong> Directeur Général
                </p>
                <p className="mb-2">
                  <strong>Email :</strong> direction@techrescue247.com
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-4">3. Hébergement</h2>
              <div className="mb-6">
                <p className="mb-2">
                  <strong>Hébergeur :</strong> Vercel Inc.
                </p>
                <p className="mb-2">
                  <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                  91789, USA
                </p>
                <p className="mb-2">
                  <strong>Site web :</strong> https://vercel.com
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                4. Propriété intellectuelle
              </h2>
              <p className="mb-6">
                L&apos;ensemble de ce site relève de la législation camerounaise
                et internationale sur le droit d&apos;auteur et la propriété
                intellectuelle. Tous les droits de reproduction sont réservés, y
                compris pour les documents téléchargeables et les
                représentations iconographiques et photographiques.
              </p>
              <p className="mb-6">
                La reproduction de tout ou partie de ce site sur un support
                électronique quel qu&apos;il soit est formellement interdite
                sauf autorisation expresse du directeur de la publication.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                5. Données personnelles
              </h2>
              <p className="mb-6">
                Conformément à la loi n° 2010/012 du 21 décembre 2010 relative à
                la cybersécurité et la cybercriminalité au Cameroun, vous
                disposez d&apos;un droit d&apos;accès, de rectification et de
                suppression des données vous concernant.
              </p>
              <p className="mb-6">
                Pour exercer ce droit, veuillez nous contacter à :
                privacy@techrescue247.com
              </p>

              <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
              <p className="mb-6">
                Ce site utilise des cookies pour améliorer l&apos;expérience
                utilisateur. En poursuivant votre navigation sur ce site, vous
                acceptez l&apos;utilisation de cookies conformément à notre
                politique de confidentialité.
              </p>

              <h2 className="text-2xl font-bold mb-4">7. Liens hypertextes</h2>
              <p className="mb-6">
                Les liens hypertextes mis en place dans le cadre du présent site
                internet en direction d&apos;autres ressources présentes sur le
                réseau Internet ne sauraient engager la responsabilité de
                TechRescue247.
              </p>

              <h2 className="text-2xl font-bold mb-4">8. Responsabilité</h2>
              <p className="mb-6">
                Les informations fournies sur ce site le sont à titre indicatif.
                TechRescue247 ne saurait garantir l&apos;exactitude, la
                complétude, l&apos;actualité des informations diffusées sur ce
                site.
              </p>
              <p className="mb-6">
                En conséquence, l&apos;utilisateur reconnaît utiliser ces
                informations sous sa responsabilité exclusive.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Litiges</h2>
              <p className="mb-6">
                Les présentes conditions sont régies par le droit camerounais.
                En cas de litige et après l&apos;échec de toute tentative de
                recherche d&apos;une solution amiable, les tribunaux camerounais
                seront seuls compétents pour connaître de ce litige.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Crédits</h2>
              <div className="mb-6">
                <p className="mb-2">
                  <strong>Conception et réalisation :</strong> Équipe
                  TechRescue247
                </p>
                <p className="mb-2">
                  <strong>Technologies utilisées :</strong> Next.js, React,
                  Tailwind CSS
                </p>
                <p className="mb-2">
                  <strong>Icônes :</strong> Lucide Icons
                </p>
                <p className="mb-2">
                  <strong>Polices :</strong> Inter (Google Fonts)
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant ces mentions légales, vous pouvez
                nous contacter :
              </p>
              <ul className="list-none mb-6">
                <li>
                  <strong>Par email :</strong> legal@techrescue247.com
                </li>
                <li>
                  <strong>Par téléphone :</strong> +237 123 456 789
                </li>
                <li>
                  <strong>Par courrier :</strong> TechRescue247 SARL, Avenue
                  Kennedy, BP 1234, Yaoundé, Cameroun
                </li>
              </ul>

              <div className="bg-gray-100 p-6 rounded-lg mt-8">
                <p className="text-sm text-gray-700">
                  <strong>Dernière mise à jour :</strong> 28 Juin 2025
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
