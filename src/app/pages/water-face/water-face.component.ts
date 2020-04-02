import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
// 该模块使用的数据需要发布一个河道面的featureserver
@Component({
  selector: 'app-water-face',
  templateUrl: './water-face.component.html',
  styleUrls: ['./water-face.component.scss']
})
export class WaterFaceComponent implements OnInit {
  @ViewChild('mapWater', { static: true }) mapContainer: ElementRef;
  map: any;
  view: any;
  constructor() { }

  ngOnInit() {

    this.initMap();
  }
  initMap() {
    console.log(this.mapContainer);
    const mapContainer = this.mapContainer.nativeElement;
    loadModules([
      'esri/widgets/Sketch',
      'esri/Map',
      'esri/config',
      'esri/request',
      'esri/WebScene',
      'esri/views/MapView',
      'esri/views/SceneView',
      'esri/layers/SceneLayer',
      'esri/layers/MapImageLayer',
      'esri/layers/FeatureLayer',
      'esri/layers/WebTileLayer',
      'esri/geometry/SpatialReference',
      'esri/identity/IdentityManager',
      'esri/identity/ServerInfo',
      'esri/tasks/support/Query',
      'esri/tasks/QueryTask',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/geometry/Polygon',
      'esri/geometry/Polyline',
      'esri/views/draw/Draw',
      'esri/geometry/geometryEngine',
      'esri/geometry/support/webMercatorUtils',
      'esri/widgets/DirectLineMeasurement3D',
      'esri/PopupTemplate',
      'esri/Color',
      'esri/widgets/Slice',
      'esri/widgets/Compass', 'esri/widgets/Zoom',
      'esri/widgets/NavigationToggle',
      'esri/widgets/Editor'
    ], {
        version: '4.14',
        css: true
      })
      .then(([
        Sketch,
        Map,
        esriConfig,
        esriRequest,
        WebScene,
        MapView,
        SceneView, SceneLayer, MapImageLayer, FeatureLayer,
        WebTileLayer,
        SpatialReference,
        esriId,
        ServerInfo,
        Query,
        QueryTask,
        GraphicsLayer,
        Graphic, Point,
        Polygon, Polyline,
        Draw, GeometryEngine, webMercatorUtils,
        DirectLineMeasurement3D, PopupTemplate,
        Color,
        Slice, Zoom,
        Compass, NavigationToggle, Editor
      ]) => {
        // esriConfig.request.corsEnabledServers.push('http://minas/server/');
        const serverInfo = new ServerInfo({
          adminTokenServiceUrl: 'http://minas/server/admin/generateToken',
          currentVersion: '10.5',
          server: 'http://minas/server/rest/services',
          shortLivedTokenValidity: '60',
          tokenServiceUrl: 'http://minas/server/tokens/generateToken'
        });
        const userInfo = {
          username: 'arcgis',
          password: '123456'
          // username: 'zhangyue',
          // password: 'zhangyue'
        };
        esriId.generateToken(serverInfo, userInfo).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
          // alert(JSON.stringify(err));
        });
        const waterLayer = new FeatureLayer({
          url: 'http://minas/server/rest/services/hedaoTest/FeatureServer',
          elevationInfo: {
            mode: 'on-the-ground',
            offset: -2
          },
          renderer: {
            type: 'simple',
            symbol: {
              type: 'polygon-3d',
              symbolLayers: [
                {
                  type: 'water',
                  waveDirection: 260,
                  color: '#25427c',
                  waveStrength: 'moderate',
                  waterbodySize: 'medium'
                }
              ]
            }
          }
        });
        const vec = new WebTileLayer({
          urlTemplate: 'http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=2ccb5e9994316752630b91c5d87c868e',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        });

        this.map = new Map({
          basemap: 'satellite',
          layers: [waterLayer]
        });

        this.view = new SceneView({
          container: mapContainer,
          map: this.map,
          center: [121.5, 31.1],
          zoom: 9
        });
        // this.view.ui.remove('attribution');
        // this.view.ui.move(['zoom', 'navigation-toggle', 'compass'], 'bottom-right');

      }).catch(err => {
        // handle any errors
        console.error(err);
      });

  }

}
