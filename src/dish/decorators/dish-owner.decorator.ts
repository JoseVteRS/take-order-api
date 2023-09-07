// decorators/dish-restaurant-owner.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const META_DISH = 'dishRestaurantOwner';

export const DishRestaurantOwner = () => SetMetadata(META_DISH, true);