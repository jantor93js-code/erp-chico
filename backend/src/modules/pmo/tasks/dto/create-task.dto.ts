import { IsString, IsOptional, IsUUID, IsNotEmpty, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskEstado, TaskPrioridad, TaskTipo } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  codigo?: string;

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
  fechaInicio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fechaLimite?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  responsableId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TaskTipo)
  tipo?: TaskTipo;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fuente?: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;
}
