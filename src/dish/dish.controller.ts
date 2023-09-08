import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
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
        return await this.dishService.create(dishData, user, restaurantId)
    }


    @Auth(ValidRoles.OWNER)
    @Get(':restaurantId')
    async findMany(
        @Param('restaurantId') restaurantId: string
    ) {
        return await this.dishService.findMany(restaurantId)
    }

    @Auth()
    @Get(':dishId')
    @DishOwner()
    async findById(
        @GetUser() user: User,
        @Query('restaurant') restaurantId: string,
        // @Param('restaurantId') restaurantId: string,
        @Param('dishId') dishId: string,
    ) {
        return await this.dishService.findById(restaurantId, dishId)
    }

    @Auth()
    @Delete(':dishId')
    @DishOwner()
    async delete(
        @GetUser() user: User,
        @Param('dishId') dishId: string,
        @Query('restaurant') restaurantId: string,
    ) {
        console.log(restaurantId)
        return await this.dishService.delete(restaurantId, dishId, user )
    }

} 