import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getResumen(): Promise<{
        clientes: number;
        pedidos: number;
        servicios: number;
        conductores: number;
        facturas: number;
        totalPagado: number;
    }>;
}
