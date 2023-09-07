// guards/dish-owner.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { META_DISH } from '../decorators/dish-owner.decorator';


@Injectable()
export class DishOwnerGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const dishId = request.params.dishId; 
        const restaurantId = request.query.restaurant
        const restaurantIdParams = request.params.restaurantId;
    

        const isDishRestaurantOwner = this.reflector.get<boolean>(
            META_DISH,
            context.getHandler(),
        );

        if (!isDishRestaurantOwner) {
            return true;
        }

       
        const dish = await this.prisma.dish.findUnique({
            where: { id: dishId, restaurantId: restaurantId },
        });
        return !!dish;
    }
}