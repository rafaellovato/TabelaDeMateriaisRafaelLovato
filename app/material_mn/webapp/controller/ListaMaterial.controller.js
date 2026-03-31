sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";
    let novoMaterialDialog;

    return Controller.extend("materialmn.controller.ListaMaterial", {
        onInit() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter
                .getTarget("TargetListaMaterial") // Sempre alterar o Target
                .attachDisplay(this.handleRouteMatched, this);             
        },

        handleRouteMatched: function () {
            this.createModel(); 
            this.onBuscarMateriais(10); 
        },


        createModel: function () {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({
                    variavelInput: 1,
                    tableMaterial: [],
                    novoMaterialDialog: {
                        NumMat: 0,
                        Nome: "",
                        Descr:""
                    }
                }),
                "oModelTable"
            );

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
            
        },
        
        onNovo: function(){
            //Abrir o dialog
            if (!novoMaterialDialog) {
                novoMaterialDialog = sap.ui.xmlfragment("materialmn.view.novoMaterial", this);
                this.getView().addDependent(novoMaterialDialog);
            }
            novoMaterialDialog.open();            
        },
        
        onFecharDialog: function(){
            novoMaterialDialog.close();            
        },
        
        onCriarMaterial: function(){
            const oDialogData = this.getView()
                    .getModel("oModelTable")
                    .getProperty("/novoMaterialDialog"); 
                    
            // 1. Validação dos campos obrigatórios
            if (!oDialogData.NumMat || !oDialogData.Nome || !oDialogData.Descr) {
                MessageBox.error("Todos os campos são obrigatórios: NumMat, Nome e Descr.");
                return;      
            }
            
            //2. Chamada da action criarMaterial
            fetch("/odata/v4/material-srv/criarMaterial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    NumMat: oDialogData.NumMat,
                    Nome: oDialogData.Nome,
                    Descr: oDialogData.Descr
                })
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.error?.message || "Erro ao criar material");
                        });
                    }
                    return response.json();
                })
                .then((result) => {

                    MessageBox.success(result.value || "Material criado com sucesso!");

                    novoMaterialDialog.close();

                    //Limpar campos do dialog
                    this.getView()
                        .getModel("oModelTable")
                        .setProperty("/novoMaterialDialog", {
                            NumMat: 0,
                            Nome: "",
                            Descr: ""
                        });

                    //Recarregar a lista de materiais
                    const iQtde = this.getView()
                        .getModel("oModelTable")
                        .getProperty("/variavelInput");

                    this.onBuscarMateriais(iQtde);
                })
                .catch((error) => {
                    MessageBox.error(error.message);
                });
                             
        }    

    });
});