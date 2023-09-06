import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync, compareSync } from "bcryptjs"
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async create(createUser: Prisma.UserCreateInput) {
        try {
            const { password, ...userData } = createUser

            const user = await this.prisma.user.create({
                data: {
                    ...createUser,
                    tenant: { create: { name: userData.name } },
                    password: hashSync(password, 10)
                }
            })
            delete user.password;

            return {
                ...user,
                token: this.getJwtToken({ id: user.id, tenant: { id: user.tenantId } })
            };

        } catch (error) {
            this.handleDBErrors(error)
        }
    }


    async login(loginUser: LoginUserDto) {
        const { email, password } = loginUser

        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { email: true, password: true, id: true, tenantId: true }
        })

        if (!user) throw new UnauthorizedException('Credentials are not valid')
        if (!compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid')

        delete user.password
        delete user.email

        return {
            ...user,
            token: this.getJwtToken({ id: user.id, tenant: { id: user.tenantId } })
        }

    }

    async checkAuthStatus(user: User) {
        return {
            ...user,
            token: this.getJwtToken({ id: user.id, tenant: { id: user.tenantId } })
        };
    }



    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }


    private handleDBErrors(error: any): never {
        if (error.code === '23505')
            throw new BadRequestException(error.detail);
        console.log(error)
        throw new InternalServerErrorException('Please check server logs');
    }
}