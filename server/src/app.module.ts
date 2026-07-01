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
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentModule } from './payments/payment.module';
import { PaymentSettingModule } from './payment-settings/payment-setting.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { DashboardModule } from './dashboard/dashboard.module';

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
      context: ({ req, res }) => ({ req, res }),
    }),
    StudentsModule,
    CoursesModule,
    UploadModule,
    AuthModule,
    UsersModule,
    EnrollmentsModule,
    PaymentModule,
    PaymentSettingModule,
    ContactUsModule,
    TestimonialsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [DatabaseService, AppResolver],
})
export class AppModule {}
