sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("materialmn.controller.ListaMaterial", {
        onInit() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter
                .getTarget("TargetListaMaterial") // Sempre alterar o Target
                .attachDisplay(this.handleRouteMatched, this);             
        },

        handleRouteMatched: function () {
            this.createModel();  
            //this.getTableCapacity();  
        },


        createModel: function () {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({
                    variavelInput: 1,
                    tableMaterial: []
                }),
                "oModelTable"
            );

            this.onBuscarMateriais(10);
        },
 
        



        onBuscarMateriais: function (iQtde) {
           
            fetch("/odata/v4/material-srv/filtroMateriais(Qtde=" + iQtde + ")")
                    .then(r => r.json())
                    .then(oData => {
                        this.getView()
                            .getModel("oModelTable")
                            .setProperty("/tableMaterial", oData.value);
            });
        },

        onFiltrar: function(){
            const iQtde = this.getView()
                              .getModel("oModelTable")
                              .getProperty("/variavelInput");

            this.onBuscarMateriais(iQtde);
            
        }        
    });
});