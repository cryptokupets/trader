/* global moment */

sap.ui.define(
  ["sap/ui/core/mvc/Controller", "ck/trader/thirdparty/moment-with-locales"],
  function(Controller) {
    "use strict";

    return Controller.extend("ck.trader.controller.AnalysisShow", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("analysisShow")
          .attachMatched(this._onRouteMatched, this);
        this.getView().addStyleClass(oComponent.getContentDensityClass());
      },

      _onRouteMatched: function(oEvent) {},

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("main");
      }
    });
  }
);
