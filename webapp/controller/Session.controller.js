/* global moment */

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ck/trader/thirdparty/moment-with-locales"
  ],
  function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("ck.trader.controller.Session", {
      onInit: function() {
        var oComponent = this.getOwnerComponent();
        oComponent
          .getRouter()
          .getRoute("session")
          .attachMatched(this._onRouteMatched, this);
        this.getView().addStyleClass(oComponent.getContentDensityClass());
        this.getView().setModel(new JSONModel());
        this.getView().setModel(new JSONModel(), "chart");
      },

      _onRouteMatched: function(oEvent) {
        var oView = this.getView();
        var sSessionId = oEvent.getParameter("arguments").id;
        var sPath = "/Session('" + sSessionId + "')";
        this._sPath = sPath;

        oView.bindElement({
          model: "data",
          path: sPath
        });

        this._bind(sPath);
      },

      _bind: function(sPath) {
        var oModel = this.getView().getModel();
        return this.getView()
          .getModel("data")
          .bindContext(sPath, null, {
            $expand: "View"
          })
          .requestObject()
          .then(
            function(oData) {
              oModel.setData({
                exchange: oData.exchange,
                currency: oData.currency,
                asset: oData.asset,
                period: oData.period,
                begin: oData.begin.slice(0, 10),
                end: oData.end.slice(0, 10),
                indicators: JSON.stringify(oData.indicators)
              });
              this.getView()
                .getModel("chart")
                .setData({
                  begin: moment.utc(oModel.getProperty("/begin")).toISOString(),
                  end: moment
                    .utc(oModel.getProperty("/end"))
                    .add(1, "d")
                    .toISOString(),
                  candles: oData.View.Candles,
                  indicators: oData.View.Indicators
                });
              return this._draw();
            }.bind(this)
          );
      },

      _draw: function() {
        return new Promise(
          function(resolve) {
            setTimeout(
              function() {
                this.byId("candlestick").refresh();
                var aCharts = this.byId("indicators").getItems();
                for (var i = 0; i < aCharts.length; i++) {
                  aCharts[i].refresh();
                }
                resolve(); // бесполезно
              }.bind(this)
            );
          }.bind(this)
        );
      },

      onBackPress: function() {
        this.getOwnerComponent()
          .getRouter()
          .navTo("sessions");
      },

      onRefreshPress: function() {
        this.getView().getModel("data").refresh();
      },

      onStopPress: function() {
        $.post("/odata" + this._sPath + "/action.stop");
      }
    });
  }
);
