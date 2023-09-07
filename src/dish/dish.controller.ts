import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { DishService } from "./dish.service";
import { Prisma, User } from "@prisma/client";
import { Auth } from "src/auth/decorators/auth.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { ValidRoles } from "src/auth/interfaces/valid-roles";
import { DishRestaurantOwner } from "./decorators/dish-owner.decorator";
import { DishOwner } from "./decorators/dish.decorator";



@Controller('dish')
export class DishController {
    constructor(
        private readonly dishService: DishService
    ) { }

    @Auth(ValidRoles.OWNER)
    @Post(':restaurantId')
    async create(
        @Param('restaurantId') restaurantId: string,
        @Body() dishData: Prisma.DishCreateInput,
        @GetUser() user: User,
    ) {
        return this.dishService.create(dishData, user, restaurantId)
    }


    @Auth(ValidRoles.OWNER)
    @Get(':restaurantId')
    async findMany(
        @Param('restaurantId') restaurantId: string
    ) {
        return this.dishService.findMany(restaurantId)
    }

    @Auth()
    @Get(':dishId')
    @DishOwner()
    async findById(
        @GetUser() user: User,
        @Query('restaurant') restaurant: string,
        @Param('restaurantId') restaurantId: string,
        @Param('dishId') dishId: string,
    ) {
        return this.dishService.findById(restaurantId, dishId)
    }

} 