import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface HeroButton {
  text: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  icon?: LucideIcon;
}

interface HeroFeature {
  icon: LucideIcon;
  text: string;
}

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttons?: HeroButton[];
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  features?: HeroFeature[];
  variant?: "default" | "centered" | "split" | "minimal";
  bgStyle?: "gradient" | "solid" | "pattern";
  height?: "default" | "tall" | "short";
}

export function Hero({
  title,
  subtitle,
  description,
  buttons = [],
  badge,
  features = [],
  variant = "default",
  bgStyle = "gradient",
  height = "default",
}: HeroProps) {
  const heightClass = {
    short: "py-16 lg:py-20",
    default: "py-20 lg:py-28",
    tall: "py-24 lg:py-32",
  }[height];

  const bgClass = {
    gradient: "bg-gradient-to-br from-blue-600 via-primary to-blue-700",
    solid: "bg-primary",
    pattern: "bg-primary relative overflow-hidden",
  }[bgStyle];

  const bgPattern = bgStyle === "pattern" && (
    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
  );

  if (variant === "split") {
    return (
      <section className={`${bgClass} text-white ${heightClass}`}>
        {bgPattern}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {badge && (
                <Badge variant="secondary" className="mb-4 px-4 py-1">
                  {badge.icon && <badge.icon className="w-4 h-4 mr-1" />}
                  {badge.text}
                </Badge>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {title}
                {subtitle && (
                  <span className="block text-blue-200 mt-2">{subtitle}</span>
                )}
              </h1>
              {description && (
                <p className="text-xl mb-8 text-blue-100">{description}</p>
              )}
              {buttons.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {buttons.map((button, index) => {
                    const Icon = button.icon;
                    return (
                      <Link key={index} href={button.href}>
                        <Button
                          size="lg"
                          variant={
                            button.variant ||
                            (index === 0 ? "secondary" : "outline")
                          }
                          className={`text-lg px-8 ${
                            button.variant === "outline"
                              ? "bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                              : ""
                          }`}
                        >
                          {Icon && <Icon className="mr-2" />}
                          {button.text}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
              {features.length > 0 && (
                <div className="space-y-3">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-blue-200" />
                        <span>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section className={`${bgClass} text-white py-16`}>
        {bgPattern}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-blue-100 mb-6">{description}</p>
          )}
          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {buttons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <Link key={index} href={button.href}>
                    <Button
                      size="lg"
                      variant={
                        button.variant ||
                        (index === 0 ? "secondary" : "outline")
                      }
                      className={
                        button.variant === "outline"
                          ? "bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                          : ""
                      }
                    >
                      {Icon && <Icon className="mr-2" />}
                      {button.text}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default and centered variants
  return (
    <section
      className={`relative ${bgClass} text-white overflow-hidden ${heightClass}`}
    >
      {bgPattern}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={variant === "centered" ? "text-center" : "text-center"}>
          {badge && (
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              {badge.icon && <badge.icon className="w-4 h-4 mr-1" />}
              {badge.text}
            </Badge>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
            {subtitle && (
              <span className="block text-blue-200 mt-4">{subtitle}</span>
            )}
          </h1>
          {description && (
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {buttons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <Link key={index} href={button.href}>
                    <Button
                      size="lg"
                      variant={
                        button.variant ||
                        (index === 0 ? "secondary" : "outline")
                      }
                      className={`text-lg px-8 ${
                        button.variant === "outline"
                          ? "bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                          : ""
                      }`}
                    >
                      {Icon && <Icon className="mr-2" />}
                      {button.text}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {features.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-${features.length} gap-6 max-w-3xl mx-auto`}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Icon className="w-6 h-6 text-blue-200" />
                    <span className="text-lg">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
