import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArcserverService {
  token: any;
  constructor(
    private http: HttpClient
  ) { }

  getServices(token) {
    const url = 'http://minas/server/admin/services?f=json&token=' + token;
    return this.http.jsonp(url, 'callback').toPromise().then((res) => {
      return res;
    });
  }

  getInfoByServiceName(serviceName) {
    const url = `http://minas/server/rest/services/${serviceName}/MapServer?f=json`;
    return this.http.jsonp(url, 'callback').toPromise().then((res) => {
      return res;
    });
  }

  // 测试token请求未成功
  getArcToken() {
    const url = 'https://wer.bimviewer.net/arcgis/sharing/rest/generateToken';
    const body = JSON.stringify({
      username: 'gis_viewer',
      password: 'kalends123',
      ip: '',
      referer: '',
      client: 'requestip',
      expiration: 1440,
      f: 'json'
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'token': this.sign(url + this.key)
      })
    };
    return this.http.post(url, body).toPromise().then((res: Response) => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  createService(name) {
    const url = 'http://minas/server/admin/services/createService?';
    const params = {
      service: {
        serviceName: name,
        type: 'MapServer',
        description: 'my map service',
        capabilities: 'Map,Query,Data',
        clusterName: 'default',
        minInstancesPerNode: 1,
        maxInstancesPerNode: 2,
        maxWaitTime: 60,
        maxStartupTime: 300,
        maxIdleTime: 1800,
        maxUsageTime: 600,
        recycleInterval: 24,
        loadBalancing: 'ROUND_ROBIN',
        isolationLevel: 'HIGH',
        properties: {
          maxBufferCount: '100',
          virtualCacheDir: 'http://localhost/server/server/arcgiscache',
          maxImageHeight: '2048',
          maxRecordCount: '1000',
          filePath: 'E:\\Projects\\data\\wzbjson\\feaserver.msd',
          maxImageWidth: '2048',
          cacheOnDemand: 'false',
          virtualOutputDir: 'http://localhost/server/server/arcgisoutput',
          outputDir: 'D:\\arcgisserver\\directories\\arcgisoutput',
          supportedImageReturnTypes: 'MIME+URL',
          isCached: 'false',
          ignoreCache: 'false',
          clientCachingAllowed: 'false',
          cacheDir: 'D:\\arcgisserver\\directories\\arcgiscache\\test'
        },
        extensions: [
          {
            typeName: 'WCSServer',
            enabled: false,
            capabilities: '',
            properties: {}
          }
        ],
        frameworkProperties: {
          javaHeapSize: '64'
        }
      },
      f: 'json',
      token: this.token
    };
    return this.http.post(url, params).toPromise().then((res: Response) => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  stopService(servcieName) {
    // http://minas/server/admin/services/feaTest.MapServer/stop
    const url = `/api/admin/services/${servcieName}.MapServer/stop?f=json&token=${this.token}`;
    const params = {
      f: 'json',
      token: this.token
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    };
    return this.http.post(url, params, httpOptions).toPromise().then((res: Response) => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  startService(servcieName) {
    const url = `/api/admin/services/${servcieName}.MapServer/start?f=json&token=${this.token}`;
    const params = {
      f: 'json',
      token: this.token
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    };
    return this.http.post(url, params, httpOptions).toPromise().then((res: Response) => {
      return res;
    }).catch(err => {
      return err;
    });
  }
}
