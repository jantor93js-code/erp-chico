import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  impacto?: string;

  @IsString()
  @IsOptional()
  probabilidad?: string;

  @IsString()
  @IsOptional()
  mitigacion?: string;

  @IsString()
  @IsOptional()
  responsable?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}
