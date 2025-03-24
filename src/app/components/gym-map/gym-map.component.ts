import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoogleMap, GoogleMapsModule} from '@angular/google-maps';
import {FormsModule} from '@angular/forms';
import {GymService} from '../../services/gym.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gym-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule],
  templateUrl: './gym-map.component.html',
  styleUrls: ['./gym-map.component.css']
})
export class GymMapComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  center = { lat: 30.7333, lng: 76.7794 };
  zoom = 12;
  markers: any[] = [];
  searchTerm = '';
  selectedGym: any = null;
  mapOptions: google.maps.MapOptions = {
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ],
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true,
  };

  customMarkerIcon = {
    url: '/src/assets/gym-marker.svg', // You'll need to create this SVG
    scaledSize: new google.maps.Size(40, 40)
  };

  constructor(private gymService: GymService, private router: Router) {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.loadNearbyGyms();
        }
      );
    }
  }

  loadNearbyGyms() {
    this.gymService.getNearbyGyms(this.center.lat, this.center.lng).subscribe({
      next: (gyms) => {
        this.markers = gyms.map(gym => ({
          position: {
            lat: gym.latitude,
            lng: gym.longitude
          },
          title: gym.name,
          info: gym,
          options: {
            icon: this.customMarkerIcon,
            animation: google.maps.Animation.DROP
          },
          distance: this.calculateDistance(
            this.center.lat,
            this.center.lng,
            gym.latitude,
            gym.longitude
          )
        }));
      }
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  viewGymDetails(gymId: number) {
    this.router.navigate(['/gym', gymId]);
  }

  onMarkerClick(marker: any) {
    this.router.navigate(['/gym', marker.info.id]);
  }

  get sortedMarkers() {
    return [...this.markers]
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .filter(marker =>
        marker.info.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        marker.info.address.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }
}
