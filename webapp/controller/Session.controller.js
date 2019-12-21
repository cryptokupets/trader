/* global moment */

sap.ui.define(
  ["sap/ui/core/mvc/Controller", "ck/trader/thirdparty/moment-with-locales"],
  function(Controller) {
    "use strict";

    return Controller.extend("ck.trader.controller.Session", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("session")
          .attachMatched(this._onRouteMatched, this);
        this.getView().addStyleClass(oComponent.getContentDensityClass());
      },

      _onRouteMatched: function(oEvent) {
        var oView = this.getView();
        var sSessionId = oEvent.getParameter("arguments").id;

        oView.bindElement({
          model: "data",
          path: "/Session('" + sSessionId + "')"
        });
      },

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("sessions");
      }
    });
  }
);
