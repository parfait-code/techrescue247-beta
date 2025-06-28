import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CTAButton {
  text: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  icon?: LucideIcon;
}

interface CTAProps {
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  variant?: "default" | "centered" | "split" | "minimal";
  bgColor?: "primary" | "secondary" | "dark" | "gradient";
  image?: string;
}

export function CTA({
  title,
  subtitle,
  buttons,
  variant = "default",
  bgColor = "primary",
  image,
}: CTAProps) {
  const bgClass = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    dark: "bg-gray-900",
    gradient: "bg-gradient-to-r from-primary to-blue-700",
  }[bgColor];

  const textColor = ["primary", "dark", "gradient"].includes(bgColor)
    ? "text-white"
    : "text-gray-900";
  const subtitleColor = ["primary", "dark", "gradient"].includes(bgColor)
    ? "text-blue-100"
    : "text-gray-600";

  if (variant === "split") {
    return (
      <section className={`py-20 ${bgClass} ${textColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
              {subtitle && (
                <p className={`text-xl mb-8 ${subtitleColor}`}>{subtitle}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
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
                          button.variant === "outline" &&
                          bgColor !== "secondary"
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
            </div>
            {image && (
              <div className="relative h-64 lg:h-full">
                <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section className={`py-12 ${bgClass} ${textColor}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">{title}</h3>
              {subtitle && <p className={subtitleColor}>{subtitle}</p>}
            </div>
            <div className="flex gap-4">
              {buttons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <Link key={index} href={button.href}>
                    <Button
                      variant={
                        button.variant ||
                        (index === 0 ? "secondary" : "outline")
                      }
                      className={
                        button.variant === "outline" && bgColor !== "secondary"
                          ? "bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                          : ""
                      }
                    >
                      {Icon && <Icon className="mr-2 w-4 h-4" />}
                      {button.text}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className={`py-24 ${bgClass} ${textColor} text-center`}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">{title}</h2>
          {subtitle && (
            <p className={`text-xl sm:text-2xl mb-10 ${subtitleColor}`}>
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttons.map((button, index) => {
              const Icon = button.icon;
              return (
                <Link key={index} href={button.href}>
                  <Button
                    size="lg"
                    variant={
                      button.variant || (index === 0 ? "secondary" : "outline")
                    }
                    className={`text-lg px-8 ${
                      button.variant === "outline" && bgColor !== "secondary"
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
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className={`py-20 ${bgClass} ${textColor}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className={`text-xl mb-8 ${subtitleColor}`}>{subtitle}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {buttons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Link key={index} href={button.href}>
                <Button
                  size="lg"
                  variant={
                    button.variant || (index === 0 ? "secondary" : "outline")
                  }
                  className={
                    button.variant === "outline" && bgColor !== "secondary"
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
      </div>
    </section>
  );
}
