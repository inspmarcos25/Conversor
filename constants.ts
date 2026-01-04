import { Category } from './types';

// Helper for simple linear conversions
const linear = (factor: number) => ({
  toBase: (val: number) => val * factor,
  fromBase: (val: number) => val / factor,
});

export const CATEGORIES: Category[] = [
  {
    id: 'pressure',
    name: 'Pressure',
    icon: 'compress',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', ...linear(1) },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', ...linear(1000) },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', ...linear(1000000) },
      { id: 'bar', name: 'Bar', symbol: 'bar', ...linear(100000) },
      // PSI refined to more decimal places (1 PSI = 6,894.75729 Pa)
      { id: 'psi', name: 'PSI', symbol: 'psi', ...linear(6894.757) },
      // kgf/cm² is exactly 98066.5 Pa (Standard gravity 9.80665 * 10000)
      { id: 'kgf', name: 'Kilograma-força/cm²', symbol: 'kgf/cm²', ...linear(98066.5) },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', ...linear(101325) },
      { id: 'torr', name: 'Torr', symbol: 'Torr', ...linear(133.322368) },
      { id: 'mmhg', name: 'mmHg', symbol: 'mmHg', ...linear(133.322387) },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: 'square', 
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', ...linear(1) },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', ...linear(0.001) },
      // US Gallon = 3.785411784 L
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', ...linear(3.785412) },
      // US Fluid Ounce = 29.5735296 ml
      { id: 'floz', name: 'Fluid Ounce', symbol: 'fl oz', ...linear(0.02957353) },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', ...linear(1000) },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: 'speed',
    units: [
      { id: 'mps', name: 'Meter per second', symbol: 'm/s', ...linear(1) },
      { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', ...linear(0.27777778) }, // 1 km/h = 1/3.6 m/s
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', ...linear(0.44704) },
      { id: 'kn', name: 'Knot', symbol: 'kn', ...linear(0.514444) },
      { id: 'ft', name: 'Foot per second', symbol: 'ft/s', ...linear(0.3048) },
    ],
  },
  {
    id: 'temperature',
    name: 'Temp',
    icon: 'thermometer',
    units: [
      { 
        id: 'c', 
        name: 'Celsius', 
        symbol: '°C', 
        toBase: (v) => v, 
        fromBase: (v) => v 
      },
      { 
        id: 'f', 
        name: 'Fahrenheit', 
        symbol: '°F', 
        toBase: (v) => (v - 32) * (5/9), 
        fromBase: (v) => (v * 9/5) + 32 
      },
      { 
        id: 'k', 
        name: 'Kelvin', 
        symbol: 'K', 
        toBase: (v) => v - 273.15, 
        fromBase: (v) => v + 273.15 
      },
    ],
  },
  {
    id: 'length',
    name: 'Length',
    icon: 'straighten',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', ...linear(1) },
      { id: 'km', name: 'Kilometer', symbol: 'km', ...linear(1000) },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ...linear(0.01) },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ...linear(0.001) },
      // International Mile is exactly 1609.344 meters
      { id: 'mi', name: 'Mile', symbol: 'mi', ...linear(1609.344) },
      // International Foot is exactly 0.3048 meters
      { id: 'ft', name: 'Foot', symbol: 'ft', ...linear(0.3048) },
      // International Inch is exactly 0.0254 meters
      { id: 'in', name: 'Inch', symbol: 'in', ...linear(0.0254) },
    ],
  },
  {
    id: 'mass',
    name: 'Mass',
    icon: 'scale',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', ...linear(1) },
      { id: 'g', name: 'Gram', symbol: 'g', ...linear(0.001) },
      // Avoirdupois Pound is exactly 0.45359237 kg
      { id: 'lb', name: 'Pound', symbol: 'lb', ...linear(0.45359237) },
      // Avoirdupois Ounce is exactly 28.349523125 g
      { id: 'oz', name: 'Ounce', symbol: 'oz', ...linear(0.0283495231) },
      { id: 't', name: 'Metric Ton', symbol: 't', ...linear(1000) },
    ],
  },
];