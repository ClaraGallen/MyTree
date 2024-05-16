cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-certificates.Certificates",
      "file": "plugins/cordova-plugin-certificates/www/certificate.js",
      "pluginId": "cordova-plugin-certificates",
      "clobbers": [
        "cordova.plugins.certificates"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-certificates": "0.6.4"
  };
});