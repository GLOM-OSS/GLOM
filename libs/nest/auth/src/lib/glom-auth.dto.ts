import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Gender, Lang } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    description: 'Valid user email',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @ApiProperty({
    description: 'Strong password',
  })
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsString()
  @ApiProperty({
    description: 'User first name',
  })
  first_name: string;

  @IsString()
  @ApiProperty({
    description: 'User last name',
  })
  last_name: string;

  @IsEnum(Lang)
  @IsOptional()
  @ApiProperty({ enum: Lang })
  preferred_lang: Lang;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({
    description: 'Valid user phone number',
  })
  phone_number?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'User date of birth',
  })
  birth_date?: Date;

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({
    description: 'User gender',
    enum: Gender,
    example: Gender.Male,
  })
  gender?: Gender;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Valid user address',
  })
  address?: string;
}

export class ResetPasswordDto {
  @IsUUID()
  @ApiProperty({
    description: 'Reset password id return from `/reset-password`',
  })
  reset_password_id: string;

  @IsString()
  @ApiProperty({
    description: 'New password. It must be a strong password',
  })
  @IsStrongPassword()
  new_password: string;
}

export class ResetPasswordID {
  @IsUUID()
  @ApiProperty({
    description: 'Generated reset password id',
  })
  reset_password_id: string;
}

export class UserEntity extends OmitType(SignUpDto, ['password']) {
  @IsUUID()
  @ApiProperty({
    description:
      'User role. The default role is `Client`. Each role gives direct access to a particular origin(allow subdomains).',
    example: randomUUID(),
  })
  role_id: string;

  @IsUUID()
  @ApiProperty({
    description: 'User login id',
    example: randomUUID(),
  })
  login_id: string;

  @IsUUID()
  @ApiProperty({
    description: 'User person id',
    example: randomUUID(),
  })
  person_id: string;

  @IsEnum(Lang)
  @ApiProperty({
    description: 'User preffered language.',
    default: 'en',
    enum: Lang,
  })
  preferred_lang: Lang;

  @IsNumber()
  @ApiProperty({
    description: 'Account creation datetime.',
    example: new Date(),
  })
  created_at: Date;
}

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({ description: 'Current password.' })
  current_password: string;

  @IsString()
  @ApiProperty({
    description: 'New password. It must be a strong password',
  })
  @IsStrongPassword()
  new_password: string;
}
