import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  // Set UBB location
  ubb: any = {
    lat: -36.5951436,
    lng: -72.0823686,
  };
  markerId: string;

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createMap();
  }

  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'google-maps',
        element: this.mapRef.nativeElement,
        apiKey: environment.google_maps_api_key,
        config: {
          center: this.ubb,
          zoom: 13,
        },
      });

      // Move map at UBB location
      await this.newMap.setCamera({
        coordinate: {
          lat: this.ubb.lat,
          lng: this.ubb.lng,
        },
        animate: true
      });

      /** 
      * The following lines enable some Google Maps features
      * More info can be found at https://capacitorjs.com/docs/apis/google-maps
      **/

      // Enable marker clustering
      await this.newMap.enableClustering();

      // Enable traffic Layer
      await this.newMap.enableTrafficLayer(true);

      //await this.newMap.enableCurrentLocation(true);

      // Add two markers
      this.addMarkers(this.ubb.lat, this.ubb.lng);
      this.addListeners();
    } catch(e) {
      console.log(e);
    }
  }

  // Add multiple markers
  async addMarkers(lat, lng) {
    await this.newMap.addMarkers([
      {
        coordinate: {
          lat: lat,
          lng: lng,
        },
        // title: ,
        draggable: true
      },
      {
        coordinate: {
          lat: -36.6005781, 
          lng: -72.0764763,
        },
        // title: ,
        draggable: true
      },
    ]);
  }
  
  // Add one marker
  async addMarker(lat, lng) {
    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat: lat,
        lng: lng,
      },
      // title: ,
      draggable: true
    });
  }

  // Remove marker
  async removeMarker(id?) {
    await this.newMap.removeMarker(id ? id : this.markerId);
  }

  // Add listeners to extend funcionality
  async addListeners() {
    /**
     * Every time the user clicks on the map, a marker is added/removed
     */
    await this.newMap.setOnMarkerClickListener((event) => {
      console.log('setOnMarkerClickListener', event);
      this.removeMarker(event.markerId);
    });

    await this.newMap.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener', event);
      this.addMarker(event.latitude, event.longitude);
    });

  }

}
