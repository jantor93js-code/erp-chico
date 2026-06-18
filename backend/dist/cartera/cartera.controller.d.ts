import { CarteraService } from './cartera.service';
export declare class CarteraController {
    private readonly carteraService;
    constructor(carteraService: CarteraService);
    findAll(): Promise<{
        facturaId: string;
        numeroFactura: string;
        cliente: string;
        valorFactura: number;
        totalPagado: number;
        saldoPendiente: number;
        estadoPago: string;
        fechaVencimiento: Date;
    }[]>;
    findPendientes(): Promise<{
        facturaId: string;
        numeroFactura: string;
        cliente: string;
        valorFactura: number;
        totalPagado: number;
        saldoPendiente: number;
        estadoPago: string;
        fechaVencimiento: Date;
        diasVencidos: number;
    }[]>;
}
