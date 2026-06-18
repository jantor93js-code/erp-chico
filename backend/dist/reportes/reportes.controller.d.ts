import { ReportesService } from './reportes.service';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    financiero(): Promise<{
        ingresos: number;
        gastos: number;
        utilidad: number;
        rentabilidad: number;
    }>;
    conductoresTop(): Promise<{
        conductorId: string;
        nombre: string;
        servicios: number;
    }[]>;
    clientesTop(): Promise<{
        cliente: string;
        facturacion: unknown;
    }[]>;
}
