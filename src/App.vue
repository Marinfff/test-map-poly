<script>
export default {
  name: "App",

  data: () => ({
    map: null,
    marker: null,
    poly: null,
    model: {
      radius: 10,
      lng: null,
      lat: null,
    },
    zoom: 17,
    markers: [],
  }),

  async mounted() {
    await this.loadMap();
  },

  methods: {
    async loadMap() {
      this.map = new (await this.$google).maps.Map(
        document.getElementById("map"),
        {
          center: {
            lat: 47.784926,
            lng: 27.897512,
          },
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          zoom: this.zoom,
        }
      );
      await this.createPoly();
      this.map.addListener("click", this.addLatLng);
    },
    async createPoly() {
      this.poly = new (await this.$google).maps.Polyline({
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });
      this.poly.setMap(this.map);
    },
    async addLatLng(event) {
      if (!this.poly) {
        await this.createPoly();
      }

      const path = this.poly.getPath();

      path.push(event.latLng);

      const marker = new (await this.$google).maps.Marker({
        position: event.latLng,
        title: "#" + path.getLength(),
        map: this.map,
      });

      this.markers.push(marker);
    },
    async drawFigure() {
      const paths = this.markers.map((item) => ({
        lng: item.position.lng(),
        lat: item.position.lat(),
      }));

      for (const marker of this.markers) {
        marker.setMap(null);
      }

      this.markers = [];

      this.poly.setMap(null);

      this.poly = null;

      const figure = new (await this.$google).maps.Polygon({
        paths,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });

      const bounds = new (await this.$google).maps.LatLngBounds();

      for (const path of paths) {
        bounds.extend(path);
      }

      const marker = new (await this.$google).maps.Marker({
        position: bounds.getCenter(),
        map: this.map,
      });

      marker.addListener("mouseout", () => {
        figure.setMap(null);
      });

      marker.addListener("mouseover", () => {
        figure.setMap(this.map);
      });

      //figure.setMap(this.map);
    },
  },
};
</script>

<template>
  <div id="app">
    <div class="map" id="map"></div>
    <div class="save-dialog">
      <div v-if="markers.length > 2" style="padding: 24px">
        <button style="height: 100px; width: 100px" @click="drawFigure()">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0 !important;
}

.map {
  width: 100vw;
  height: 100vh;
}

.save-dialog {
  position: fixed;
  left: 50px;
  bottom: 50px;
  background: white;
  border: 1px solid black;
}
</style>
