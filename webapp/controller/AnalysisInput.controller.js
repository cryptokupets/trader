/* global moment */

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ck/trader/thirdparty/moment-with-locales"
  ],
  function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("ck.trader.controller.AnalysisInput", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("analysisInput")
          .attachMatched(this._onRouteMatched, this);
        var oView = this.getView();
        oView.addStyleClass(oComponent.getContentDensityClass());
        oView.setModel(new JSONModel());
        oView.setModel(new JSONModel(), "view");
      },

      _onRouteMatched: function(oEvent) {
        var aArguments = oEvent.getParameter("arguments");
        var oQuery = aArguments["?query"];
        this.getView()
          .getModel()
          .setProperty("/type", oQuery ? oQuery.type : "");
      },

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
            type: oModel.getProperty("/type"),
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
            indicators: JSON.parse(oModel.getProperty("/indicators")),
            initialBalance: +oModel.getProperty("/initialBalance"),
            code: oModel.getProperty("/code")
          })
        }).then(function(oData) {
          oRouter.navTo("analysisOutput", {
            id: oData._id
          });
        });
      }
    });
  }
);
