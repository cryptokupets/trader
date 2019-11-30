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
        this.getView().setModel(new JSONModel(), "chart");
      },

      _onRouteMatched: function(oEvent) {
        this._bind("/Session('" + oEvent.getParameter("arguments").id + "')");
      },

      _bind: function(sPath) {
        var oModel = this.getView().getModel();
        return this.getView()
          .getModel("data")
          .bindContext(sPath)
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

              return $.post({
                async: true,
                url: "/odata/getData()",
                headers: {
                  "Content-Type": "application/json"
                },
                data: JSON.stringify({
                  exchange: oData.exchange,
                  currency: oData.currency,
                  asset: oData.asset,
                  period: oData.period,
                  begin: oData.begin,
                  end: oData.end,
                  indicators: JSON.stringify(oData.indicators)
                })
              });
            }.bind(this)
          )
          .then(
            function(oBuffer) {
              this.getView()
                .getModel("chart")
                .setData({
                  begin: moment.utc(oModel.getProperty("/begin")).toISOString(),
                  end: moment
                    .utc(oModel.getProperty("/end"))
                    .add(1, "d")
                    .toISOString(),
                  candles: oBuffer.value.map(function(e) {
                    return e.candle;
                  }),
                  indicators: oBuffer.value[
                    oBuffer.value.length - 1
                  ].indicators.map(function(oIndicator, iIndicatorIndex) {
                    return {
                      series: oIndicator.map(function(oValue, iValueIndex) {
                        // UNDONE
                        return {
                          values: oBuffer.value.map(function(b) {
                            return {
                              time: b.candle.time,
                              value: b.indicators[0][0] || 0
                            };
                          })
                        };
                      })
                    };
                  })
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
          .navTo("analysisForm");
      }
    });
  }
);
