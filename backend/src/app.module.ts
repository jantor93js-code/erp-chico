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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}