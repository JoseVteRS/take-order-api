import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { DishService } from "./dish.service";
import { DishController } from "./dish.controller";
import { AuthModule } from "src/auth/auth.module";


@Module({
    controllers: [DishController],
    providers: [DishService],
    imports: [
        PrismaModule,
        AuthModule
    ],
    exports: [
        DishModule
    ]
})
export class DishModule { }