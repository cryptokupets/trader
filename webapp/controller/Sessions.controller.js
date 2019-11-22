sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"],
  function(Controller) {
    "use strict";

    return Controller.extend("ck.trader.controller.Sessions", {
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
  }
);
