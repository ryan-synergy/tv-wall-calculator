export interface TVDimensions {
  diagonal: number;
  width: number;  // inches
  height: number; // inches
  widthCm: number;
  heightCm: number;
}

export interface CalculatorState {
  tvSize: number;          // diagonal inches (0 = custom)
  customSize: string;
  wallWidth: number;       // inches
  wallHeight: number;      // inches
  mountHeight: number;     // inches from floor to TV center
  viewingDistance: number; // inches
  viewingDistanceAuto: boolean;
  hasFireplace: boolean;
  fireplaceHeight: number; // inches
  multipleTV: boolean;
  gridLayout: '1x2' | '2x2' | '2x3' | '3x3';
}

export interface CalculatorResults {
  tv: TVDimensions;
  recommendedDistance: number;
  floorToBottom: number;
  floorToTop: number;
  outletHeight: number;
  fitsOnWall: boolean;
  fitsHeightOnWall: boolean;
  sideMargin: number;
  topMargin: number;
}
