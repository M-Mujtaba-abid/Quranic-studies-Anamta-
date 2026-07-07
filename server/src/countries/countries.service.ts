import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EnrollmentMode } from '@prisma/client';

@Injectable()
export class CountriesService {
  constructor(private readonly database: DatabaseService) {}

  async findByEnrollmentMode(mode: EnrollmentMode) {
    return await this.database.country.findMany({
      where: {
        supportedModes: {
          has: mode,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
