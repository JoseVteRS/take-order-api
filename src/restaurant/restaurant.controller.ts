import { Body, Controller, Get, Param, Post, Patch } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { Auth } from "src/auth/decorators/auth.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { ValidRoles } from "src/auth/interfaces/valid-roles";
import { RestaurantService } from "./restaurant.service";


@Controller('restaurant')
export class RestaurantController {
    constructor(
        private restaurantService: RestaurantService
    ) { }

    @Auth(ValidRoles.OWNER)
    @Post('create')
    async create(
        @Body() createUserInput: Prisma.RestaurantCreateInput,
        @GetUser() user: User,
    ) {
        return this.restaurantService.create(createUserInput, user, user.tenantId)
    }

    @Auth(ValidRoles.OWNER)
    @Get()
    async findMany(
        @GetUser() user: User,
    ) {
        return this.restaurantService.findMany(user)
    }

    @Auth(ValidRoles.OWNER)
    @Get('/:id')
    async findById(
        @GetUser() user: User,
        @Param('id') id: string
    ) {
        return this.restaurantService.findById(id, user)
    }


    @Auth(ValidRoles.OWNER)
    @Patch('/:id')
    async updateById(
        @GetUser() user: User,
        @Param('id') id: string,
        @Body() updateData: Prisma.RestaurantUpdateInput
    ) {
        return this.restaurantService.updateById(id, user, updateData)
    }
}