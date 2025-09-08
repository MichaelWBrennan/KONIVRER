import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "username123" })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: "SecureP@ssw0rd", minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: "John", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ example: "Doe", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;
}

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email address or username",
  })
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ example: "SecureP@ssw0rd" })
  @IsString()
  password: string;
}

export class TokenRefreshDto {
  @ApiProperty({ example: "jwt_refresh_token_here" })
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: "reset_token_here" })
  @IsString()
  token: string;

  @ApiProperty({ example: "NewSecureP@ssw0rd", minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: "verification_token_here" })
  @IsString()
  token: string;
}

export class OAuthLoginDto {
  @ApiProperty({ example: "oauth_token_here" })
  @IsString()
  token: string;
}
