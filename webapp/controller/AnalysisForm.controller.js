/* global moment */

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ck/trader/thirdparty/moment-with-locales"
  ],
  function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("ck.trader.controller.AnalysisForm", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("analysisForm")
          .attachMatched(this._onRouteMatched, this);
        this.getView().addStyleClass(oComponent.getContentDensityClass());
        this.getView().setModel(new JSONModel());
      },

      _onRouteMatched: function() {},

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("main");
      },

      onExecutePress: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        var oModel = this.getView().getModel();
        $.post({
          async: true,
          url: "/odata/Session",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            exchange: oModel.getProperty("/exchange"),
            currency: oModel.getProperty("/currency"),
            asset: oModel.getProperty("/asset"),
            period: +oModel.getProperty("/period"),
            begin: moment.utc(oModel.getProperty("/begin")).toISOString(),
            end: moment
              .utc(oModel.getProperty("/end"))
              .add(1, "d")
              .add(-1, "s")
              .toISOString(),
            indicators: JSON.parse(oModel.getProperty("/indicators"))
          })
        }).then(function(oData) {
          oRouter.navTo("analysisShow", {
            id: oData._id
          });
        });
      }
    });
  }
);
