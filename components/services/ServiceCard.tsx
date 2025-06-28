import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    shortDescription: string;
    icon: React.ElementType;
    slug: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
            <CardDescription className="text-base">
              {service.shortDescription}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link href={`/services/${service.slug}`}>
          <Button className="w-full" variant="outline">
            En savoir plus
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
