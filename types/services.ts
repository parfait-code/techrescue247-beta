export interface ServiceProcess {
    title: string;
    description: string;
}

export interface ServiceFAQ {
    question: string;
    answer: string;
}

export interface Service {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    features: string[];
    benefits: string[];
    process: ServiceProcess[];
    technologies: string[];
    faq: ServiceFAQ[];
}

export interface ServiceCardProps {
    service: {
        id: string;
        title: string;
        shortDescription: string;
        icon: any;
        slug: string;
    };
}