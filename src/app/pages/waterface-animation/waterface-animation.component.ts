import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
// 该模块使用的数据需要发布一个河道面的featureserver
@Component({
  selector: 'app-water-face',
  templateUrl: './waterface-animation.component.html',
  styleUrls: ['./waterface-animation.component.scss']
})
export class WaterfaceAnimationComponent implements OnInit {
  @ViewChild('mapWater', { static: true }) mapContainer: ElementRef;
  map: any;
  view: any;
  layer:any;
  waterH:number=0;
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
      'esri/layers/BuildingSceneLayer',
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
        version: '4.15',
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
        BuildingSceneLayer,
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
        esriConfig.portalUrl = "https://gisvr1.kalends.com/arcgis";
        const serverInfo = new ServerInfo({
          adminTokenServiceUrl: 'https://gisvr1.kalends.com/arcgis/admin/generateToken',
          currentVersion: '10.8',
          server: 'https://gisvr1.kalends.com/arcgis/rest/services',
          shortLivedTokenValidity: '60',
          tokenServiceUrl: 'https://gisvr1.kalends.com/arcgis/tokens/generateToken'
        });
        const userInfo = {
          username: 'arcgis',
          password: 'Kalend2020'
        };
        esriId.generateToken(serverInfo, userInfo).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
          // alert(JSON.stringify(err));
        });
        // 该图层是3D对象发布的sceneserver，通过更改elevationInfo.offset可以改变图层高度，但是会触发重新渲染，有闪烁的现象；
        // this.layer =new SceneLayer({
        //   url: 'https://gisvr1.kalends.com/arcgis/rest/services/Hosted/蕰藻浜水面3ds_Layer3DToFeatureCla/SceneServer',
        //   elevationInfo: {
        //     mode: "absolute-height",
        //     offset:0,
        //     unit: "meters"
        //   }
        // });
        // 该图层是河道面polygon发布的FeatureServer，通过更改elevationInfo.offset可以改变图层高度，可以实现平滑移动；
        this.layer = new FeatureLayer({
          url:
            "https://gisvr1.kalends.com/arcgis/rest/services/Hosted/wzbWaterFace/FeatureServer",
          elevationInfo: {
            mode: "absolute-height",
            offset: 0
          },
          renderer: {
            type: "simple",
            symbol: {
              type: "polygon-3d",
              symbolLayers: [
                {
                  type: "water",
                  waveDirection: 260,
                  color: "#25427c",
                  waveStrength: "moderate",
                  waterbodySize: "medium"
                }
              ]
            }
          }
        });

        this.map = new Map({
          basemap: 'satellite',
          layers: [this.layer]
        });
        this.view = new SceneView({
          container: mapContainer,
          map: this.map,
          camera: {
            position: {
              x: 121.42756065929728, // lon
              y: 31.333806502176273,   // lat
              z: 557.7096280436963 // elevation in meters
            },
            heading: 355.7430344045478,
            fov: 55,
            tilt: 56.983801799501684
          }
        });
        // 开启地下导航，即视角可以移动到地下
        this.map.ground.navigationConstraint = {
          type: "none"
        };
        // 设置地表透明度
        this.map.ground.opacity = 0.6;

        this.view.on("drag", (event) =>{
          console.log(this.view);
        });
      }).catch(err => {
        // handle any errors
        console.error(err);
      });

      

  }
  start(){
    setInterval(()=>{
      if(this.waterH<10){
        this.waterH=this.waterH+0.5;
      }else{
        this.waterH=-10;
      }
      this.layer.elevationInfo={
        mode: "absolute-height",
        offset:this.waterH,
        unit: "meters"
      };
    },500)
    
  }
  change(h){
    // this.map.basemap.baseLayers.items[0].opacity=0.3;
    this.layer.elevationInfo={
      mode: "absolute-height",
      offset:0, //sceneLayer只能通过这个参数的改变实现高度更改
      featureExpressionInfo:{
        expression:h //featureLayer可以通过这个参数修改高度，也可以通过offset参数改变高度，并且效果都比较平滑
      },
      unit: "meters"
    };
    //每次改变高度后，图层会重新渲染出现闪烁现象；
    console.log(this.layer);
  }

}
