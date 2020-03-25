import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { loadModules } from 'esri-loader';
import { ArcserverService } from '../../services/arcserver.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('mapOrthophoto', { static: true }) mapContainer: ElementRef;
  selectedValue = null;
  map: any;
  view: any;
  services: any;
  servicesInfo: any;
  addLayer: any;
  checked: false;
  checkOptionsOne: any = [];
  constructor(
    private arcserver: ArcserverService
  ) { }

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
          this.arcserver.token = res.token;
          this.arcserver.getServices(res.token).then((result: any) => {
            console.log(result);
            this.services = result.services;
            Promise.all(this.services.map(value => this.arcserver.getInfoByServiceName(value.serviceName))).then(list => {
              console.log(list);
              this.getLayerGroup(list);
            });
          });
          // if (res) {
          //   esriId.registerToken({
          //     server: 'http://minas/server/rest/services',
          //     token: res.token,
          //     expires: res.expires,
          //     ssl: true
          //   });
          // }
        }).catch((err) => {
          console.log(err);
          // alert(JSON.stringify(err));
        });

        const vec = new WebTileLayer({
          urlTemplate: 'http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=2ccb5e9994316752630b91c5d87c868e',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        });

        this.map = new Map({
          basemap: 'satellite',
          // layers: [vec]
        });

        this.view = new SceneView({
          container: mapContainer,
          map: this.map,
          center: [121.5, 31.1],
          zoom: 9,
          spatialReference: new SpatialReference({
            wkid: 3857
          })
        });
        // this.view.ui.remove('attribution');
        // this.view.ui.move(['zoom', 'navigation-toggle', 'compass'], 'bottom-right');
        this.addLayer = (service) => {
          if (service.layers) {
            const layer = new MapImageLayer({
              id: service.serviceName,
              url: service.layers[0].url,
              visible: false
            });
            this.map.add(layer);
          }
        };
      })
      .catch(err => {
        // handle any errors
        console.error(err);
      });
  }
  getLayerGroup(list) {
    const array = [];
    let data = {};
    let layer = {};
    this.services.forEach((item, i) => {
      if (list[i].error) {
        // 说明服务没有开启
        data = {
          serviceName: item.serviceName,
          details: item,
          description: '服务未启动'
        };
        this.checkOptionsOne.push({
          label: item.serviceName, value: item.serviceName, disabled: true, checked: false
        });
      } else {
        this.checkOptionsOne.push({
          label: item.serviceName, value: item.serviceName, disabled: false, checked: false
        });
        const supportedExtensions = list[i].supportedExtensions.split(', ');
        console.log(supportedExtensions);

        const layers = [];
        layers.push({
          serviceType: 'MapServer',
          // tslint:disable-next-line:object-literal-shorthand
          url: `http://minas/server/rest/services/${item.serviceName}/MapServer`
        });
        supportedExtensions.forEach((element) => {
          const url = `http://minas/server/rest/services/${item.serviceName}/${element}`;
          layer = {
            serviceType: element,
            // tslint:disable-next-line:object-literal-shorthand
            url: url
          };
          layers.push(layer);
        });
        data = {
          serviceName: item.serviceName,
          layers,
          details: list[i]
        };
      }
      array.push(data);
    });
    // console.log(array);
    this.servicesInfo = array;
    this.servicesInfo.forEach(item => {
      this.addLayer(item);
    });
  }
  select(e) {
    this.servicesInfo.forEach(item => {
      if (item.serviceName === e && item.layers) {
        this.map.findLayerById(item.serviceName).visible = true;
      } else if (item.layers) {
        this.map.findLayerById(item.serviceName).visible = false;
      }
    });
  }
  log(arr) {
    console.log(arr);
    arr.forEach(layer => {
      if (!layer.disabled) {
        this.map.findLayerById(layer.value).visible = layer.checked;
      }

    });
  }
}
