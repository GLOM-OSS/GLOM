import { DynamicModule, Module, Type } from '@nestjs/common';
import { GlomStrategy } from '../glom-auth.type';
import { FacebookModule } from './facebook/facebook.module';
import { GoogleModule } from './google/google.module';
import { RouterModule } from '@nestjs/core';

@Module({})
export class ThirdParthiesModule {
  static forRoot({
    strategies,
  }: {
    strategies: GlomStrategy[];
  }): DynamicModule {
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
    return {
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
