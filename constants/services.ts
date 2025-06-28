import { Network, Cloud, Server, Code } from "lucide-react";
import type { Service } from "@/types/services";

export const servicesData: Service[] = [
    {
        id: "network-infrastructure",
        slug: "infrastructure-reseau",
        title: "Infrastructure Réseau",
        description: "Conception et sécurisation de vos réseaux locaux pour une connectivité optimale et protégée. Nous analysons vos besoins, concevons l'architecture réseau appropriée et mettons en place des solutions robustes et évolutives.",
        shortDescription: "Conception et sécurisation de vos réseaux locaux pour une connectivité optimale et protégée.",
        features: [
            "Architecture LAN/WAN",
            "Sécurité avancée",
            "Surveillance continue",
            "Support 24/7"
        ],
        benefits: [
            "Amélioration des performances réseau jusqu'à 80%",
            "Réduction des temps d'arrêt de 95%",
            "Sécurité renforcée contre les cyberattaques",
            "Évolutivité garantie pour la croissance future",
            "Support technique expert disponible 24/7"
        ],
        process: [
            {
                title: "Audit Initial",
                description: "Évaluation complète de votre infrastructure réseau actuelle et identification des points d'amélioration."
            },
            {
                title: "Conception",
                description: "Création d'une architecture réseau personnalisée adaptée à vos besoins spécifiques et votre croissance."
            },
            {
                title: "Déploiement",
                description: "Installation et configuration des équipements avec migration progressive pour éviter les interruptions."
            },
            {
                title: "Optimisation",
                description: "Tests de performance, ajustements fins et mise en place de la surveillance continue."
            }
        ],
        technologies: [
            "Cisco", "Juniper", "Fortinet", "Palo Alto", "Aruba", "Ubiquiti",
            "VLAN", "VPN", "Firewall", "Load Balancing", "QoS", "SD-WAN"
        ],
        faq: [
            {
                question: "Combien de temps faut-il pour installer une nouvelle infrastructure réseau ?",
                answer: "Le délai varie selon la complexité : 1-2 semaines pour un réseau simple, 4-8 semaines pour une architecture avancée. Nous planifions l'installation pour minimiser l'impact sur votre activité."
            },
            {
                question: "Puis-je conserver mon équipement actuel ?",
                answer: "Nous évaluons votre équipement existant lors de l'audit. Ceux qui sont compatibles et en bon état peuvent être intégrés dans la nouvelle architecture pour optimiser votre investissement."
            },
            {
                question: "Comment garantissez-vous la sécurité de notre réseau ?",
                answer: "Nous implémentons des pare-feu de nouvelle génération, la segmentation réseau, le chiffrement des données et une surveillance 24/7 avec détection d'intrusion."
            }
        ]
    },
    {
        id: "cloud-migration",
        slug: "migration-cloud",
        title: "Migration Cloud",
        description: "Accompagnement complet pour migrer vos systèmes vers le cloud sans interruption de service. Nous développons une stratégie de migration personnalisée, gérons la transition et optimisons vos coûts cloud.",
        shortDescription: "Accompagnement complet pour migrer vos systèmes vers le cloud sans interruption de service.",
        features: [
            "Audit préliminaire",
            "Stratégie de migration",
            "AWS/Azure/GCP",
            "Formation des équipes"
        ],
        benefits: [
            "Réduction des coûts IT jusqu'à 40%",
            "Flexibilité et évolutivité améliorées",
            "Accès aux dernières technologies cloud",
            "Sécurité des données renforcée",
            "Capacités de travail à distance optimisées"
        ],
        process: [
            {
                title: "Évaluation",
                description: "Analyse approfondie de votre infrastructure actuelle et évaluation de la compatibilité cloud."
            },
            {
                title: "Stratégie",
                description: "Définition de la feuille de route de migration avec priorisation des applications et sélection du fournisseur cloud."
            },
            {
                title: "Migration",
                description: "Exécution par phases de la migration avec tests rigoureux et validation à chaque étape."
            },
            {
                title: "Optimisation",
                description: "Ajustement des ressources, optimisation des coûts et mise en place des bonnes pratiques cloud."
            }
        ],
        technologies: [
            "AWS", "Microsoft Azure", "Google Cloud", "Docker", "Kubernetes",
            "Terraform", "Ansible", "Jenkins", "GitLab CI/CD", "Monitoring"
        ],
        faq: [
            {
                question: "Quelle est la durée typique d'une migration cloud ?",
                answer: "Cela dépend de la complexité : 1-3 mois pour une migration simple, 6-12 mois pour une transformation complète. Nous procédons par phases pour maintenir la continuité de service."
            },
            {
                question: "Comment choisir le bon fournisseur cloud ?",
                answer: "Nous analysons vos besoins techniques, budget, contraintes réglementaires et préférences. AWS, Azure et GCP ont chacun leurs avantages selon le contexte."
            },
            {
                question: "Que se passe-t-il si la migration échoue ?",
                answer: "Nous avons un plan de retour arrière pour chaque phase. Nos migrations sont testées en environnement de staging avant la production, minimisant les risques."
            }
        ]
    },
    {
        id: "infrastructure-management",
        slug: "gestion-infrastructure",
        title: "Gestion d'Infrastructure",
        description: "Optimisation et supervision de vos infrastructures pour une performance maximale et des coûts maîtrisés. Surveillance proactive, maintenance préventive et support expert pour garantir la disponibilité de vos systèmes.",
        shortDescription: "Optimisation et supervision de vos infrastructures pour une performance maximale et des coûts maîtrisés.",
        features: [
            "Monitoring avancé",
            "Optimisation des coûts",
            "Automatisation",
            "Sauvegarde & récupération"
        ],
        benefits: [
            "Disponibilité système garantie à 99,9%",
            "Réduction des coûts opérationnels de 30%",
            "Détection proactive des problèmes",
            "Automatisation des tâches répétitives",
            "Plan de continuité d'activité robuste"
        ],
        process: [
            {
                title: "Évaluation",
                description: "Audit complet de votre infrastructure actuelle et identification des points d'optimisation."
            },
            {
                title: "Mise en œuvre",
                description: "Installation des outils de monitoring, d'automatisation et de sauvegarde adaptés à votre environnement."
            },
            {
                title: "Supervision",
                description: "Surveillance 24/7 avec alertes proactives et intervention rapide en cas d'incident."
            },
            {
                title: "Amélioration",
                description: "Optimisation continue basée sur les métriques et les retours d'expérience."
            }
        ],
        technologies: [
            "Prometheus", "Grafana", "Nagios", "Zabbix", "ELK Stack",
            "Terraform", "Ansible", "Puppet", "Docker", "VMware"
        ],
        faq: [
            {
                question: "Qu'inclut la surveillance 24/7 ?",
                answer: "Surveillance continue des serveurs, applications, réseau et bases de données avec alertes immédiates et intervention d'astreinte si nécessaire."
            },
            {
                question: "Comment gérez-vous les sauvegardes ?",
                answer: "Sauvegardes automatisées quotidiennes avec rétention configurable, stockage sécurisé et tests réguliers de restauration pour garantir la récupération des données."
            },
            {
                question: "Puis-je garder mon équipe IT interne ?",
                answer: "Absolument. Nous travaillons en collaboration avec vos équipes, apportant notre expertise complémentaire et les formant aux meilleures pratiques."
            }
        ]
    },
    {
        id: "application-development",
        slug: "developpement-applications",
        title: "Développement d'Applications",
        description: "Création d'applications métier sur mesure adaptées aux besoins spécifiques de votre entreprise. De l'analyse des besoins au déploiement, nous développons des solutions performantes et évolutives.",
        shortDescription: "Création d'applications métier sur mesure adaptées aux besoins spécifiques de votre entreprise.",
        features: [
            "Applications web",
            "Solutions mobiles",
            "APIs & intégrations",
            "Maintenance évolutive"
        ],
        benefits: [
            "Automatisation des processus métier",
            "Amélioration de la productivité des équipes",
            "Interface utilisateur intuitive",
            "Intégration avec les systèmes existants",
            "Évolutivité et maintenance facilitée"
        ],
        process: [
            {
                title: "Analyse",
                description: "Étude approfondie de vos besoins métier et définition des spécifications fonctionnelles."
            },
            {
                title: "Conception",
                description: "Design UX/UI et architecture technique adaptés à vos contraintes et objectifs."
            },
            {
                title: "Développement",
                description: "Développement agile avec livraisons itératives et validation continue avec vos équipes."
            },
            {
                title: "Déploiement",
                description: "Mise en production sécurisée avec formation des utilisateurs et support au démarrage."
            }
        ],
        technologies: [
            "React", "Node.js", "Python", "PHP", "Java", ".NET",
            "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "REST API"
        ],
        faq: [
            {
                question: "Combien de temps prend le développement d'une application ?",
                answer: "Cela varie selon la complexité : 2-3 mois pour une app simple, 6-12 mois pour une solution complète. Nous livrons de façon itérative pour valider régulièrement."
            },
            {
                question: "Pouvez-vous intégrer notre application avec nos outils existants ?",
                answer: "Oui, nous développons des APIs et connecteurs pour intégrer votre nouvelle application avec votre ERP, CRM ou autres outils métier existants."
            },
            {
                question: "Qu'inclut la maintenance évolutive ?",
                answer: "Corrections de bugs, mises à jour de sécurité, petites évolutions fonctionnelles et support technique continu selon le niveau de service choisi."
            }
        ]
    }
];

export const servicesSummary = [
    {
        id: "network-infrastructure",
        title: "Infrastructure Réseau",
        shortDescription: "Conception et sécurisation de vos réseaux locaux pour une connectivité optimale et protégée.",
        icon: Network,
        slug: "infrastructure-reseau"
    },
    {
        id: "cloud-migration",
        title: "Migration Cloud",
        shortDescription: "Accompagnement complet pour migrer vos systèmes vers le cloud sans interruption de service.",
        icon: Cloud,
        slug: "migration-cloud"
    },
    {
        id: "infrastructure-management",
        title: "Gestion d'Infrastructure",
        shortDescription: "Optimisation et supervision de vos infrastructures pour une performance maximale et des coûts maîtrisés.",
        icon: Server,
        slug: "gestion-infrastructure"
    },
    {
        id: "application-development",
        title: "Développement d'Applications",
        shortDescription: "Création d'applications métier sur mesure adaptées aux besoins spécifiques de votre entreprise.",
        icon: Code,
        slug: "developpement-applications"
    }
];