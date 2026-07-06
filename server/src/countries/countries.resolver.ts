import { Args, Query, Resolver } from '@nestjs/graphql';
import { Country } from './models/country.model';
import { CountriesService } from './countries.service';
import { EnrollmentMode } from '@prisma/client';

@Resolver(() => Country)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query(() => [Country], { name: 'countries' })
  async getCountries(
    @Args('enrollmentMode', { type: () => EnrollmentMode })
    enrollmentMode: EnrollmentMode,
  ) {
    return await this.countriesService.findByEnrollmentMode(enrollmentMode);
  }
}
