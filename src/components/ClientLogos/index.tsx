'use client';

import React from 'react';
import Image from 'next/image';

interface Company {
  name: string;
  logo?: string;
  url?: string;
}

const companies: Company[] = [
  { name: 'Siemens', logo: '/images/logos/siemens.svg' },
  { name: 'Vattenfall', logo: '/images/logos/Vattenfall_logo2.svg', url: 'https://www.vattenfall.se/' },
  { name: 'SJ', logo: '/images/logos/SJ.svg', url: 'https://www.sj.se/' },
  { name: 'ICA', logo: '/images/logos/ICA_logo.svg', url: 'https://www.icagruppen.se/' },
  { name: 'Axfood', logo: '/images/logos/AXFO.ST_BIG.svg', url: 'https://www.axfood.se/' },
];

const ClientLogos: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '400ms' }}>
      <h2
        className="text-3xl sm:text-4xl font-bold font-serif mb-12 text-center text-gray-900 dark:text-white"
        style={{ lineHeight: '1.3' }}
      >
        I&apos;ve worked with:
      </h2>

      {/* Logos Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 place-content-center">
        {companies.map((company) => (
          <div
            key={company.name}
            className="aspect-square rounded-xl border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-center bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300 hover:scale-105 group p-6"
          >
            {company.logo ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={120}
                  height={120}
                  className="object-contain filter brightness-0 dark:invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-white font-medium text-xs sm:text-sm text-center px-2 transition-colors duration-300">
                {company.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientLogos;
