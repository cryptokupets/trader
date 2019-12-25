/* global moment */

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ck/trader/thirdparty/moment-with-locales"
  ],
  function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("ck.trader.controller.Input", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("input")
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
          .setProperty("/type", oQuery && oQuery.type ? oQuery.type : "");
      },

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("main");
      },

      onExecutePress: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        var oModel = this.getView().getModel();
        var sType = oModel.getProperty("/type");
        var oDraft = {
          type: sType,
          exchange: oModel.getProperty("/exchange"),
          currency: oModel.getProperty("/currency"),
          asset: oModel.getProperty("/asset"),
          period: +oModel.getProperty("/period"),
          indicators: JSON.parse(oModel.getProperty("/indicators"))
        };

        if (sType !== "paper") {
          oDraft.begin = moment.utc(oModel.getProperty("/begin")).toISOString();
          oDraft.end = moment
            .utc(oModel.getProperty("/end"))
            .add(1, "d")
            .add(-1, "s")
            .toISOString();
        }

        if (sType) {
          oDraft.initialBalance = +oModel.getProperty("/initialBalance");
          oDraft.code = oModel.getProperty("/code");
        }

        $.post({
          async: true,
          url: "/odata/Session",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(oDraft)
        }).then(function(oData) {
          oRouter.navTo("session", {
            id: oData._id
          });
        });
      }
    });
  }
);
