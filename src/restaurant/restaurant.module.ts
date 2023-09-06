import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";



@Module({
    controllers: [RestaurantController],
    providers: [RestaurantService],
    imports: [
        PrismaModule,
        AuthModule,
    ],
    exports: [
        RestaurantService
    ]
})
export class RestaurantModule { }