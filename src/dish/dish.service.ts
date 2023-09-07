import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class DishService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    private async checkRestaurantOwner(tenantId: string, restaurantId: string) {
        try {
            const restaurant = await this.prisma.restaurant.findFirst({
                where: {
                    id: restaurantId,
                    tenantId
                }
            })
            console.log(!!restaurant)

            return !!restaurant

        } catch (error) {
            throw new InternalServerErrorException()
        }
    }


    async create(dishData: Prisma.DishCreateInput, user: User, restaurantId: string) {
        try {
            const isRestaurantOwner = await this.checkRestaurantOwner(user.tenantId, restaurantId)
            if (!isRestaurantOwner)
                throw new NotFoundException()

            const dish = await this.prisma.dish.create({
                data: {
                    ...dishData,
                    tenant: { connect: { id: user.tenantId } },
                    restaurant: { connect: { id: restaurantId } },
                }
            })
            return dish
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async findMany(restaurantId: string) {
        try {
            const dishes = await this.prisma.dish.findMany()
            if (!dishes) throw new NotFoundException()
            return dishes
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async findById(restaurantId: string, dishId: string) {
        try {
            const dish = await this.prisma.dish.findUnique({
                where: { id: dishId, restaurantId }
            })

            return dish
        } catch (error) {

        }
    }

    async update(updateData: Prisma.DishUpdateInput, user: User, restaurantId: string, dishId: string) {
        try {
            const updatedDish = await this.prisma.dish.update({
                where: { id: dishId, restaurantId },
                data: {
                    ...updateData
                }
            })

            return updatedDish
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async delete(restaurantId: string, dishId: string) {
        try {
            await this.prisma.dish.delete({
                where: { id: dishId, restaurantId },
            })

            return true
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}