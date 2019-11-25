/* global moment */

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ck/trader/thirdparty/moment-with-locales"
  ],
  function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("ck.trader.controller.AnalysisShow", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("analysisShow")
          .attachMatched(this._onRouteMatched, this);
        this.getView().addStyleClass(oComponent.getContentDensityClass());
        this.getView().setModel(new JSONModel());
      },

      _onRouteMatched: function(oEvent) {
        this._bind("/Session('" + oEvent.getParameter("arguments").id + "')");
      },

      _bind: function(sPath) {
        console.log(sPath);
        var oModel = new JSONModel();
        var oView = this.getView();
        oView.bindElement({
          path: "data>" + sPath,
          events: {
            dataReceived: function() {
              console.log(1);
              var oBindingContext = oView.getBindingContext("data");
              console.log(oBindingContext);
            }
          }
        });
        console.log(2);
      },

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("main");
      }
    });
  }
);
