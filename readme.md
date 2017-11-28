# localneo

Run your SAP-WebIDE based applications locally using the neo-app.json as a web server config.  

## install

``` 
$ npm install --global @uniorg/localneo
``` 

## configuration

A `destinations.json` file can be used to map applications and destinations to targets. 

```json
{
  "service": {
    "sapui5": {
      "useSAPUI5": true,
      "version": "1.48.5"
    }
  },
  "applications": { 
    "mylib": {
      "path": "../mylib"
    },
    "images": {
       "path": "/var/www/images"
    }
  },

  "destinations": {
    "SAP_BACKEND": {
      "url": "https://our_secret_sap_system.com" 
    }
  }
}

```

## usage

```
$ cd my/cool/neo/project
$ localneo
``` 

`localneo` will start a webserver on port 4567. 
Open you browser on [localhost:4567](http://localhost:4567) to get started.



