import { Body, Controller, Get, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { LoginDto } from '../models/login-dto';
import { LoginMessage } from '../models/login-message';
import { UpdateUserDto } from '../models/update-user-dto';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller({ version: '1', path: 'user' })
export class UserController {

    constructor(private authService: AuthService, private userService: UserService) { }

    @Get('login/:walletAddress')
    @ApiParam({ name: 'walletAddress', description: 'Should be a valid address belonging to a user.' })
    @ApiOperation({ summary: 'Message will be returned which needs be signed for logging in on the connecting device.' })
    @ApiResponse({ status: 200, description: 'UUID message.', type: LoginMessage })
    async getLoginMessage(@Param('walletAddress') walletAddress: string) {
        return await this.authService.generateMessage(walletAddress);
    }

    @Post('login')
    @ApiBody({ type: LoginDto })
    @ApiOperation({ summary: 'Verifies signature with the users public key.' })
    @ApiResponse({ status: 200, description: 'JWT Token' })
    async login(@Body() login: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
        const jwtToken = await this.authService.signIn(login.address, login.signature);
        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
        res.setCookie('access_token', jwtToken, {
            sameSite: 'lax',
            secure: false,
            httpOnly: true,
            maxAge: 24 * 3600,
            path: '/',
        });
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Returns own user details.' })
    @ApiResponse({ status: 200, description: 'User details', type: UpdateUserDto })
    async getUserInfo(@Request() req): Promise<UpdateUserDto> {
        const user = await this.userService.findByAddress(req.user.address);
        return user;
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Updates own user data' })
    @ApiResponse({ status: 200, description: 'User details', type: UpdateUserDto })
    async updateUserInfo(@Request() req, @Body() data: UpdateUserDto): Promise<UpdateUserDto> {
        return this.userService.update({
            where: {
                address: req.user.address,
            },
            data: {
                email: data.email,
                name: data.name,
                role: data.role,
                lockEnabled: data.lockEnabled,
                modifiedAt: new Date(),
            }
        })
    }
}
