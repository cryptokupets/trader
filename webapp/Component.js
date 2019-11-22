sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device"], function(
  UIComponent,
  Device
) {
  "use strict";

  return UIComponent.extend("ck.marketdata.Component", {
    metadata: {
      manifest: "json"
    },

    init: function() {
      UIComponent.prototype.init.apply(this, arguments);
      var oDeviceModel = this.getModel("device");
      oDeviceModel.setDefaultBindingMode("OneWay");
      oDeviceModel.setData(Device);
      this.getRouter().initialize();
    },

    getContentDensityClass: function() {
      if (!this._sContentDensityClass) {
        this._sContentDensityClass = Device.support.touch
          ? "sapUiSizeCozy"
          : "sapUiSizeCompact";
      }
      return this._sContentDensityClass;
    }
  });
});
