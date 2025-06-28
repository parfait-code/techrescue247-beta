import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Stat {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
  description?: string;
}

interface StatsProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
  variant?: "default" | "centered" | "cards" | "inline";
  bgColor?: "white" | "gray" | "primary";
}

export function Stats({
  stats,
  title,
  subtitle,
  variant = "default",
  bgColor = "gray",
}: StatsProps) {
  const bgClass = {
    white: "bg-white",
    gray: "bg-gray-50",
    primary: "bg-primary text-white",
  }[bgColor];

  const textColorClass = bgColor === "primary" ? "text-white" : "text-gray-600";
  const valueColorClass = bgColor === "primary" ? "text-white" : "text-primary";

  if (variant === "cards") {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && (
                <h2
                  className={`text-3xl font-bold mb-4 ${
                    bgColor === "primary" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={`text-xl ${textColorClass}`}>{subtitle}</p>
              )}
            </div>
          )}

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${stats.length} gap-6`}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-8">
                    {Icon && (
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                      {stat.prefix}
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <p className="text-sm text-gray-500 mt-2">
                        {stat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "inline") {
    return (
      <section className={`py-12 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-2xl sm:text-3xl font-bold ${valueColorClass}`}
                >
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className={`text-sm ${textColorClass}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className={`py-20 ${bgClass}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          {(title || subtitle) && (
            <div className="mb-12">
              {title && (
                <h2
                  className={`text-3xl sm:text-4xl font-bold mb-4 ${
                    bgColor === "primary" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={`text-xl ${textColorClass}`}>{subtitle}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  {Icon && (
                    <Icon
                      className={`w-8 h-8 mx-auto mb-2 ${
                        bgColor === "primary" ? "text-blue-200" : "text-primary"
                      }`}
                    />
                  )}
                  <div
                    className={`text-3xl sm:text-4xl font-bold mb-2 ${valueColorClass}`}
                  >
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className={textColorClass}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2
                className={`text-3xl font-bold mb-4 ${
                  bgColor === "primary" ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-xl ${textColorClass}`}>{subtitle}</p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-2 lg:grid-cols-${stats.length} gap-8`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`text-3xl sm:text-4xl font-bold mb-2 ${valueColorClass}`}
              >
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </div>
              <div className={textColorClass}>{stat.label}</div>
              {stat.description && (
                <p
                  className={`text-sm mt-1 ${
                    bgColor === "primary" ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
