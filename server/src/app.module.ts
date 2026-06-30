// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DatabaseService } from './database/database.service';
import { AppResolver } from './app.resolver';
import { StudentsModule } from './students/students.module';
import { DatabaseModule } from './database/database.module';
import { CoursesModule } from './courses/courses.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    // --- GraphQL Initialization ---
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-First Approach: NestJS khud schema file banayega is location par
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Browser mein testing UI (Playground) enable karne ke liye
      playground: true,
    }),
    StudentsModule,
    CoursesModule,
    UploadModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [DatabaseService, AppResolver],
})
export class AppModule {}
