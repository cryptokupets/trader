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
        console.log(this.getView().getModel());
      },

      _bind: function(sPath) {
        this.getView()
          .getModel("data")
          .bindContext(sPath)
          .requestObject()
          .then(
            function(oData) {
              this.getView()
                .getModel()
                .setData({
                  exchange: oData.exchange,
                  currency: oData.currency,
                  asset: oData.asset,
                  period: oData.period,
                  begin: oData.begin,
                  end: oData.end
                });
            }.bind(this)
          );
      },

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("main");
      }
    });
  }
);
