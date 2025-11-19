import React from 'react';
import ReactCountryFlag from "react-country-flag";
import { Globe } from 'lucide-react';

interface FlagProps {
  locale: string;
}

/**
 * A component that displays a flag icon based on a locale code.
 * It uses the react-country-flag library, which is robust and purpose-built.
 */
const Flag: React.FC<FlagProps> = ({ locale }) => {
  const parts = locale.split('_');
  
  // The library expects the country code part of the locale (e.g., "US" from "en_US")
  const countryCode = parts.length > 1 ? parts[1] : null;

  if (countryCode) {
    return (
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: '1.25em',
          height: '1.25em',
          lineHeight: '1.25em',
        }}
        title={countryCode}
      />
    );
  }

  // Fallback for locales without a country code (e.g., 'en')
  return <Globe className="h-4 w-4 text-muted-foreground" />;
};

export { Flag };
