sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
  "use strict";

  return Controller.extend("ck.trader.controller.Sessions", {
    onInit: function() {
      var oComponent = this.getOwnerComponent();
      this.getView().addStyleClass(oComponent.getContentDensityClass());
    },

    onRowSelectionChange: function(oEvent) {
      this.getOwnerComponent()
        .getRouter()
        .navTo("session", {
          id: oEvent.getParameter("rowContext").getProperty("_id")
        });
    },

    onBackPress: function() {
      this.getOwnerComponent()
        .getRouter()
        .navTo("main");
    }
  });
});
