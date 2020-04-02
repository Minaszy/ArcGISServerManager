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
  addLayer: any;
  nameToCreate: any;
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
            Promise.all(result.services.map(value => this.arcserver.getInfoByServiceName(value.serviceName))).then(list => {
              console.log(list);
              this.getLayerGroup(result.services, list);
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
          if (service.serviceLayers) {
            const layer = new MapImageLayer({
              id: service.serviceName,
              url: service.serviceLayers[0].url,
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
  getLayerGroup(services, list) {
    const array = [];
    let serviceInfo = {};
    list.forEach((item, i) => {
      if (item.error) {
        serviceInfo = {
          serviceName: services[i].serviceName,
          details: item,
          description: '服务未启动',
          disabled: true,
          checked: false
        };
      } else {
        const supportedExtensions = item.supportedExtensions.split(', ');
        const layers = [];
        layers.push({
          serviceType: 'MapServer',
          url: `http://minas/server/rest/services/${services[i].serviceName}/MapServer`
        });
        supportedExtensions.forEach((element) => {
          const url = `http://minas/server/rest/services/${services[i].serviceName}/${element}`;
          const layer = {
            serviceType: element,
            // tslint:disable-next-line:object-literal-shorthand
            url: url
          };
          layers.push(layer);
        });

        serviceInfo = {
          serviceName: services[i].serviceName,
          serviceLayers: layers,
          details: item,
          disabled: false,
          checked: false
        };
      }
      array.push(serviceInfo);
      this.addLayer(serviceInfo);
    });
    this.services = array;
    console.log(this.services);
  }
  select(item) {
    const layer = this.map.findLayerById(item.serviceName);
    // 如果一个服务在初始化时没有被启动，name初始化时就没有获取到该服务的服务类型等信息
    if (layer) {
      layer.visible = item.checked;
    } else {
      console.log('地图上没有添加该图层');
      console.log(item);
      // this.addLayer(item);
    }

  }
  start(item) {
    this.arcserver.startService(item.serviceName).then((res) => {
      if (res.status === 'success') {
        // 重启服务后需要重新更新服务的详细信息
        this.arcserver.getInfoByServiceName(item.serviceName).then((result) => {
          console.log(result);
        });
        // 允许操作页面上已经停掉的服务显隐控件
        this.services = this.services.map((element) => {
          if (element.serviceName === item.serviceName) {
            element.disabled = false;
          }
          return element;
        });
      }
    });
  }
  stop(item) {
    this.arcserver.stopService(item.serviceName).then((res) => {
      if (res.status === 'success') {
        // 禁止操作页面上已经停掉的服务显隐控件
        this.services = this.services.map((element) => {
          if (element.serviceName === item.serviceName) {
            element.disabled = true;
            if (element.checked) {
              element.checked = false;
            }
          }
          return element;
        });
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
  createService() {
    console.log(this.nameToCreate);
    this.arcserver.createService(this.nameToCreate);
  }
}
