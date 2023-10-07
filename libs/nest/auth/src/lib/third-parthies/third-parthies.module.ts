import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { GlomStrategy, ThirdParthiesModuleOptions } from '../glom-auth.type';
import { FacebookModule } from './facebook/facebook.module';
import { GoogleModule } from './google/google.module';
import { RouterModule } from '@nestjs/core';
import { AUTH_ROLES, GlomAuthSeeder } from '../glom-auth.seed';
import { GlomAuthService } from '../glom-auth.service';

@Module({})
export class ThirdParthiesModule {
  static forRoot({
    roles,
    strategies,
  }: ThirdParthiesModuleOptions): DynamicModule {
    const thirdPartiesModules: {
      strategy: GlomStrategy;
      module: Type<any>;
    }[] = [
      {
        strategy: 'google',
        module: GoogleModule,
      },
      {
        strategy: 'facebook',
        module: FacebookModule,
      },
    ];
    const services: Provider[] = [
      GlomAuthSeeder,
      GlomAuthService,
      {
        provide: AUTH_ROLES,
        useValue: roles,
      },
    ];
    return {
      global: true,
      exports: services,
      providers: services,
      module: ThirdParthiesModule,
      imports: [
        ...thirdPartiesModules
          .filter((_) => strategies.includes(_.strategy))
          .map((_) => _.module),
        RouterModule.register([
          {
            path: 'auth',
            children: [
              {
                path: 'google',
                module: GoogleModule,
              },
              {
                path: 'facebook',
                module: FacebookModule,
              },
            ],
          },
        ]),
      ],
    };
  }
}
