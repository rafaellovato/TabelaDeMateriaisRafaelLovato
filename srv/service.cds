using aulas from '../db/schema';

service MaterialSrv{

    entity Material as projection on aulas.Material;

    function filtroMateriais(Qtde : Integer) returns array of Material;


    action criarMaterial(
        NumMat : Integer,
        Nome   : String(250),
        Descr  : String(300)
    ) returns String;


}