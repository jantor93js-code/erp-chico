import { IsString, IsOptional, IsUUID, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskEstado, TaskPrioridad } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ enum: TaskEstado, required: false })
  @IsOptional()
  @IsEnum(TaskEstado)
  estado?: TaskEstado;

  @ApiProperty({ enum: TaskPrioridad, required: false })
  @IsOptional()
  @IsEnum(TaskPrioridad)
  prioridad?: TaskPrioridad;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fechaLimite?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  responsableId?: string;
}
