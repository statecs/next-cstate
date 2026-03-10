'use client';

import React from 'react';
import Image from 'next/image';

interface Company {
  name: string;
  logo?: string;
  url?: string;
}

const companies: Company[] = [
  { name: 'Cartina', url: 'https://cartina.se/' },
  { name: 'Vattenfall', url: 'https://www.vattenfall.se/' },
  { name: 'SJ', url: 'https://www.sj.se/' },
  { name: 'ICA', url: 'https://www.icagruppen.se/' },
  { name: 'Mapiful', url: 'https://www.mapiful.com/' },
  { name: 'Doctrin', url: 'https://www.doctrin.se/' },
  { name: 'THS', url: 'https://ths.kth.se/' },
  { name: 'KTH', url: 'https://www.kth.se/' },
  { name: 'State Creative' },
];

const ClientLogos: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '400ms' }}>
      <h2
        className="text-3xl sm:text-4xl font-bold font-serif mb-12 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        style={{ lineHeight: '1.3' }}
      >
        I&apos;ve worked with:
      </h2>

      {/* Logos Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {companies.map((company) => (
          <div
            key={company.name}
            className="aspect-square rounded-xl border border-gray-800 dark:border-gray-700 flex items-center justify-center bg-gray-900/50 dark:bg-gray-800/50 hover:bg-gray-800 dark:hover:bg-gray-700 hover:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 group p-6"
          >
            {company.logo ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={120}
                  height={120}
                  className="object-contain filter brightness-0 invert dark:brightness-100 dark:invert-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
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
