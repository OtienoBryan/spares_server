import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const staff = await this.authService.validateStaff(loginDto.email, loginDto.password);
    return this.authService.login(staff);
  }

  @Get('admin/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('admin/validate')
  async validateToken(@Body() body: { token: string }) {
    const user = await this.authService.validateToken(body.token);
    if (!user) {
      throw new Error('Invalid token');
    }
    return { user };
  }
}
