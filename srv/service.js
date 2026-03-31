const cds = require('@sap/cds')
 
module.exports = cds.service.impl(async function () {

    this.on('filtroMateriais', async (req) => {
        
        const { Material } = this.entities;
        
        const{ Qtde } = req.data;

        if(!Qtde)
            return req.error(400,'A quantidade de registros não foi informada.');

        const iQtde = Qtde;
           
        const cMateriais = await SELECT.from(Material).limit(iQtde).orderBy('ID');

        return cMateriais ;

    })


    this.on('criarMaterial', async (req) => {

        const { Material } = this.entities;

        const { NumMat, Nome, Descr } = req.data

        // 1. Validação dos campos obrigatórios
        if (!NumMat || !Nome || !Descr) {
            return req.error(400, 'Todos os campos são obrigatórios: NumMat, Nome e Descr.')
        }

        // 2. Verificar se NumMat já existe
        const materialExistente = await SELECT.one
            .from(Material)
            .where({ NumMat })

        if (materialExistente) {
            return req.error(400, `Material com NumMat ${NumMat} já está cadastrado.`)
        }

        // 3. Buscar último ID
        const ultimoMaterial = await SELECT.one
            .from(Material)
            .columns('ID')
            .orderBy({ ID: 'desc' })

        const novoID = ultimoMaterial ? ultimoMaterial.ID + 1 : 1

        // 4. Inserir novo material
        await INSERT.into(Material).entries({
            ID: novoID,
            NumMat,
            Nome,
            Descr
        })

        return `Material cadastrado com sucesso. ID gerado: ${novoID}`
    })


  
})
 