import React from 'react';
import ReactCountryFlag from 'react-country-flag';

// Helper function to get country code for react-country-flag
const getCountryCode = (country) => {
  const countryCodes = {
    'Pakistan': 'PK',
    'United States': 'US',
    'USA': 'US',
    'India': 'IN',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Canada': 'CA',
    'Germany': 'DE',
    'France': 'FR',
    'Japan': 'JP',
    'China': 'CN',
    'Australia': 'AU',
    'Brazil': 'BR',
    'Russia': 'RU',
    'South Korea': 'KR',
    'Italy': 'IT',
    'Spain': 'ES',
    'Netherlands': 'NL',
    'Turkey': 'TR',
    'Saudi Arabia': 'SA',
    'UAE': 'AE',
    'Egypt': 'EG',
    'South Africa': 'ZA',
    'Nigeria': 'NG',
    'Mexico': 'MX',
    'Singapore': 'SG',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Bangladesh': 'BD',
    'Sri Lanka': 'LK',
    'Vietnam': 'VN',
    'Thailand': 'TH',
    'Poland': 'PL',
    'Ukraine': 'UA',
    'Argentina': 'AR',
    'Colombia': 'CO',
    'Kenya': 'KE',
    'Morocco': 'MA',
    'Iran': 'IR',
    'Iraq': 'IQ',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Romania': 'RO',
    'Hungary': 'HU',
    'Czech Republic': 'CZ',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'New Zealand': 'NZ',
    'Chile': 'CL',
    'Algeria': 'DZ',
    'Tunisia': 'TN',
    'Jordan': 'JO',
    'Lebanon': 'LB',
    'Kazakhstan': 'KZ',
    'Uzbekistan': 'UZ'
  };
  
  return countryCodes[country] || null;
};

const CountryFlag = ({ 
  country, 
  size = '16px', 
  height = '12px', 
  showFallback = true, 
  className = '',
  title = null 
}) => {
  const countryCode = getCountryCode(country);
  
  if (countryCode) {
    return (
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: size,
          height: height,
          borderRadius: '2px'
        }}
        className={className}
        title={title || country}
      />
    );
  }
  
  if (showFallback) {
    return <span className={className}>🌍</span>;
  }
  
  return null;
};

export default CountryFlag;
export { getCountryCode };
