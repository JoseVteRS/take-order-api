import { UseGuards, applyDecorators } from "@nestjs/common";
import { DishOwnerGuard } from "../guards/dish-owner.guard";
import { DishRestaurantOwner } from "./dish-owner.decorator";

export function DishOwner() {
    return applyDecorators(
        DishRestaurantOwner(),
        UseGuards(DishOwnerGuard)
    )
}