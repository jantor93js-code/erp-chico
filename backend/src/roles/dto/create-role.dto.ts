import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Director Comercial' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: { view: true, edit: false } })
  @IsObject()
  @IsNotEmpty()
  permisos: any;
}