
export class Vehiculo {
    constructor(id, modelo, anoFab, velMax){
        this.id=id;
        this.modelo=modelo;
        this.anoFab=anoFab;
        this.velMax=velMax;
    }
}

export class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia){
        super(id, modelo, anoFab, velMax);
        this.altMax=altMax;
        this.autonomia=autonomia;
    }
}

export class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue){
        super(id, modelo, anoFab, velMax);
        this.cantPue=cantPue;
        this.cantRue=cantRue;
    }
}
