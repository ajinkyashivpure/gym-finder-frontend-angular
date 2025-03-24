import {Gym} from './gym';

export interface GymMarker {
  position: google.maps.LatLngLiteral;
  title: string;
  info: Gym;
  distance?: number;
}
