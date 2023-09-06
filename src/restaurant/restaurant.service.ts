import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Restaurant, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class RestaurantService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(createRestaurantDto: any, user: User, tenantId: string) {
        try {
            const restaurant = await this.prisma.restaurant.create({
                data: {
                    ...createRestaurantDto,
                    userId: user.id,
                    tenantId: tenantId
                }
            })
            return restaurant
        } catch (error) {
            return {
                message: error.message,
                statusCode: error.status
            }
        }
    }

    async findMany(user: User): Promise<Restaurant[] | any> {
        try {
            const restaurants = await this.prisma.restaurant.findMany({
                where: {
                    userId: user.id,
                    tenantId: user.tenantId
                }
            })
            if (!restaurants) throw new NotFoundException()
            return restaurants
        } catch (error) {
            return {
                message: error.message,
                statusCode: error.status
            }
        }
    }

    async findById(id: string, user: User) {
        try {
            const restaurant = await this.prisma.restaurant.findUnique({
                where: {
                    id: id,
                    userId: user.id
                }
            })
            if (!restaurant) throw new NotFoundException()
            return restaurant
        } catch (error) {
            return {
                message: error.message,
                statusCode: error.status
            }
        }
    }

    async updateById(id: string, user: User, updateRestaurant: Prisma.RestaurantUpdateInput) {
        try {
            const updatedRestaurant = await this.prisma.restaurant.update({
                where: {
                    id,
                    userId: user.id
                },
                data: {
                    ...updateRestaurant
                }
            })
            return updatedRestaurant
        } catch (error) {
            return {
                message: error.message,
                statusCode: error.status
            }
        }
    }

}