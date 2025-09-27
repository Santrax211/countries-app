'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  flags: {
    png: string;
    svg: string;
  };
  region: string;
  population: number;
  capital?: string[];
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [minPop, setMinPop] = useState('');
  const [maxPop, setMaxPop] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital');
        if (!res.ok) throw new Error('Failed to fetch countries');
        const data: Country[] = await res.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setSearch(params.get('search') || '');
    setRegion(params.get('region') || '');
    setMinPop(params.get('minPop') || '');
    setMaxPop(params.get('maxPop') || '');
  }, [searchParams]);

  useEffect(() => {
    let filtered = countries;

    if (search) {
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (region) {
      filtered = filtered.filter(country => country.region === region);
    }

    if (minPop) {
      const min = parseInt(minPop);
      filtered = filtered.filter(country => country.population >= min);
    }

    if (maxPop) {
      const max = parseInt(maxPop);
      filtered = filtered.filter(country => country.population <= max);
    }

    setFilteredCountries(filtered);

    // Update URL
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (region) params.set('region', region);
    if (minPop) params.set('minPop', minPop);
    if (maxPop) params.set('maxPop', maxPop);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [countries, search, region, minPop, maxPop, router]);

  const regions = [...new Set(countries.map(c => c.region))];

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Countries</h1>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Search by name</label>
            <input
              type="text"
              placeholder="e.g. Peru"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium mb-1">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium mb-1">Min Population</label>
            <input
              type="number"
              placeholder="0"
              value={minPop}
              onChange={(e) => setMinPop(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium mb-1">Max Population</label>
            <input
              type="number"
              placeholder="1000000000"
              value={maxPop}
              onChange={(e) => setMaxPop(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">Error: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map(country => (
              <div
                key={country.cca3}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
                onClick={() => setSelectedCountry(country)}
              >
                <div className="p-6">
                  <img
                    src={country.flags.png}
                    alt={country.name.common}
                    className="w-20 h-12 object-cover mb-4 rounded"
                  />
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {country.name.common}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium">Region:</span> {country.region}</p>
                    <p><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCountry && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-none flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedCountry.name.official}
                  </h2>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="flex justify-center mb-6">
                  <img
                    src={selectedCountry.flags.png}
                    alt={selectedCountry.name.common}
                    className="w-48 h-32 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Capital:</span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedCountry.capital?.[0] || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Population:</span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedCountry.population.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Region:</span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedCountry.region}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
