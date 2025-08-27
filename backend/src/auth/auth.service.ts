import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { User } from "../users/entities/user.entity";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { UserRole } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(
        "User with this email or username already exists"
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role: UserRole.PLAYER,
      isEmailVerified: false,
      emailVerificationToken,
      preferences: {
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          tournament: true,
          deck: true,
        },
        privacy: {
          showProfile: true,
          showDecks: true,
          showStats: true,
        },
      },
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(email, emailVerificationToken);

    return {
      message:
        "Registration successful. Please check your email to verify your account.",
      user: this.sanitizeUser(savedUser),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { emailOrUsername, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      message: "Login successful",
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout(userId: string) {
    // Increment token version to invalidate all existing tokens
    await this.userRepository.increment({ id: userId }, "tokenVersion", 1);

    return { message: "Logout successful" };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user);

      return {
        message: "Token refreshed successfully",
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["decks", "tournaments"],
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      user: this.sanitizeUser(user),
      stats: {
        totalDecks: user.decks?.length || 0,
        totalTournaments: user.tournaments?.length || 0,
        // TODO: Add more comprehensive stats
      },
    };
  }

  async googleLogin(token: string) {
    // TODO: Implement Google OAuth verification
    throw new BadRequestException("Google OAuth not implemented yet");
  }

  async discordLogin(token: string) {
    // TODO: Implement Discord OAuth verification
    throw new BadRequestException("Discord OAuth not implemented yet");
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return {
        message:
          "If an account exists with that email, a reset link has been sent.",
      };
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetTokenExpiry;
    await this.userRepository.save(user);

    // TODO: Send password reset email
    // await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message:
        "If an account exists with that email, a reset link has been sent.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (
      !user ||
      !user.passwordResetExpiry ||
      user.passwordResetExpiry < new Date()
    ) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user
    user.passwordHash = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    user.tokenVersion += 1; // Invalidate existing tokens

    await this.userRepository.save(user);

    return { message: "Password reset successful" };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException("Invalid verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    return { message: "Email verified successfully" };
  }

  async resendVerification(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return {
        message:
          "If an account exists with that email, a verification email has been sent.",
      };
    }

    if (user.isEmailVerified) {
      return { message: "Email is already verified." };
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    await this.userRepository.save(user);

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(email, emailVerificationToken);

    return {
      message:
        "If an account exists with that email, a verification email has been sent.",
    };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private sanitizeUser(user: User) {
    const {
      passwordHash,
      emailVerificationToken,
      passwordResetToken,
      passwordResetExpiry,
      ...sanitized
    } = user;
    return sanitized;
  }

  async validateUser(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return null;
    }

    return user;
  }
}
