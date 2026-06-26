import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from "class-validator";

export class CreateInitiativeDto {

  @IsString()
  @IsNotEmpty()
  programId: string;

  @IsString()
  @IsOptional()
  responsableId?: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  avance?: number;

}