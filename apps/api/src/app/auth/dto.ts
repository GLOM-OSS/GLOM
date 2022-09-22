import { IsEmail, IsString } from 'class-validator';

export class NewPasswordDto {
  @IsString()
  reset_password_id: string;

  @IsString()
  new_password: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;
}
