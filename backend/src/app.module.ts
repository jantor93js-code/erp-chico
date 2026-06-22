import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ClientesModule } from './clientes/clientes.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ConductoresModule } from './conductores/conductores.module';
import { FacturasModule } from './facturas/facturas.module';
import { PagosModule } from './pagos/pagos.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { DetalleServiciosModule } from './detalle-servicios/detalle-servicios.module';
import { EvidenciasModule } from './evidencias/evidencias.module';
import { CarteraModule } from './cartera/cartera.module';
import { GastosOperativosModule } from './gastos-operativos/gastos-operativos.module';
import { ReportesModule } from './reportes/reportes.module';
import { PmoModule } from './modules/pmo/pmo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    VehiculosModule,
    PedidosModule,
    ClientesModule,
    ServiciosModule,
    ConductoresModule,
    FacturasModule,
    PagosModule,
    DashboardModule,
    CotizacionesModule,
    DetalleServiciosModule,
    EvidenciasModule,
    CarteraModule,
    GastosOperativosModule,
    ReportesModule,
    PmoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}