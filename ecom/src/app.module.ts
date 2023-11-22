import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { SellerModule } from './Seller/seller.module';
import { AdminModule } from './admin/admin.module';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';



@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),UsersModule,SellerModule,AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
