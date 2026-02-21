import { TVDimensions, CalculatorState, CalculatorResults } from './types';

const ASPECT_W = 16;
const ASPECT_H = 9;
const ASPECT_RATIO = Math.sqrt(ASPECT_W ** 2 + ASPECT_H ** 2);

export function tvDimensions(diagonalInches: number): TVDimensions {
  const width = (diagonalInches * ASPECT_W) / ASPECT_RATIO;
  const height = (diagonalInches * ASPECT_H) / ASPECT_RATIO;
  return {
    diagonal: diagonalInches,
    width: Math.round(width * 10) / 10,
    height: Math.round(height * 10) / 10,
    widthCm: Math.round(width * 2.54 * 10) / 10,
    heightCm: Math.round(height * 2.54 * 10) / 10,
  };
}

export function recommendedViewingDistance(diagonalInches: number): number {
  // Industry standard: 1.5x diagonal for 4K displays
  return Math.round(diagonalInches * 1.5);
}

export function calculate(state: CalculatorState): CalculatorResults {
  const effectiveSize = state.tvSize === 0
    ? (parseFloat(state.customSize) || 65)
    : state.tvSize;

  const tv = tvDimensions(effectiveSize);
  const recommendedDistance = recommendedViewingDistance(effectiveSize);
  const floorToBottom = state.mountHeight - tv.height / 2;
  const floorToTop = state.mountHeight + tv.height / 2;
  const outletHeight = Math.max(6, floorToBottom - 6); // 6" below bottom of TV
  const sideMargin = (state.wallWidth - tv.width) / 2;
  const topMargin = state.wallHeight - floorToTop;

  return {
    tv,
    recommendedDistance,
    floorToBottom: Math.round(floorToBottom * 10) / 10,
    floorToTop: Math.round(floorToTop * 10) / 10,
    outletHeight: Math.round(outletHeight * 10) / 10,
    fitsOnWall: tv.width <= state.wallWidth - 4, // 2" margin each side
    fitsHeightOnWall: floorToTop <= state.wallHeight - 2,
    sideMargin: Math.round(sideMargin * 10) / 10,
    topMargin: Math.round(topMargin * 10) / 10,
  };
}

export function inchesToFeetInches(inches: number): string {
  const ft = Math.floor(inches / 12);
  const inc = Math.round(inches % 12);
  if (ft === 0) return `${inc}"`;
  if (inc === 0) return `${ft}'`;
  return `${ft}' ${inc}"`;
}

export function feetToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}
