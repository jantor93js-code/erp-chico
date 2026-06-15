import { IsEmail, IsString, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}