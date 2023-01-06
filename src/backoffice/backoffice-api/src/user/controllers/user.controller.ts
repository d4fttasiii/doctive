import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';
import { AuthService } from '@/auth/services/auth.service';
import { Body, Controller, Get, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { LoginDto } from '../models/login-dto';
import { LoginMessage } from '../models/login-message';
import { UpsertUserDto as UpsertUserDto } from '../models/upsert-user-dto';
import { UserDto, UserListDto } from '../models/user-dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller({ version: '1', path: 'user' })
export class UserController {

    constructor(private authService: AuthService, private userService: UserService) { }

    @Get('login/:walletAddress')
    @ApiParam({ name: 'walletAddress', description: 'Should be a valid address belonging to a user.' })
    @ApiOperation({ summary: 'Message will be returned which needs be signed for logging in on the connecting device.' })
    @ApiResponse({ status: 200, description: 'UUID message.', type: LoginMessage })
    async getLoginMessage(@Param('walletAddress') walletAddress: string): Promise<LoginMessage> {
        return {
            message: await this.authService.generateMessage(walletAddress),
        };
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

    @Get('own')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Returns own user details.' })
    @ApiResponse({ status: 200, description: 'User details', type: UserDto })
    async getOwnUser(@Request() req): Promise<UserDto> {
        const user = await this.userService.findByAddress(req.user.walletAddress);
        return user;
    }

    @Put('own')
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: UpsertUserDto })
    @ApiOperation({ summary: 'Updates own user data' })
    @ApiResponse({ status: 200, description: 'User details', type: UserDto })
    async updateOwnUser(@Request() req, @Body() data: UpsertUserDto): Promise<UserDto> {
        return this.userService.update({
            where: {
                walletAddress: req.user.walletAddress,
            },
            data: data,
        })
    }

    @Get(':take/:skip')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lists users' })
    @ApiResponse({ status: 200, description: 'List of users', type: UserDto })
    async getAllUser(@Param('take') take: string, @Param('skip') skip: string): Promise<UserListDto[]> {
        return await this.userService.list(
            take ? parseInt(take, 10) : 50,
            skip ? parseInt(skip, 10) : 0);
    }

    @Get(':walletAddress')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Returns user details.' })
    @ApiResponse({ status: 200, description: 'User details', type: UserDto })
    async getUser(@Param('walletAddress') walletAddress: string): Promise<UserDto> {
        const user = await this.userService.findByAddress(walletAddress);
        return user;
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: UpsertUserDto })
    @ApiOperation({ summary: 'Creates new user' })
    @ApiResponse({ status: 200, description: 'User details', type: UserDto })
    async createUser(@Body() data: UpsertUserDto): Promise<UserDto> {
        return await this.userService.create({
            walletAddress: data.walletAddress,
            email: data.email,
            name: data.name,
            role: data.role,
            lockEnabled: data.lockEnabled,
        });
    }

    @Put(':walletAddress')
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: UpsertUserDto })
    @ApiOperation({ summary: 'Updates user data' })
    @ApiResponse({ status: 200, description: 'User details', type: UserDto })
    async updateUser(@Param('walletAddress') walletAddress: string, @Body() data: UpsertUserDto): Promise<UserDto> {
        return this.userService.update({
            where: {
                walletAddress: walletAddress,
            },
            data: data,
        })
    }
}
