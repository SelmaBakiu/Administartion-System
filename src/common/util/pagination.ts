import { Repository, SelectQueryBuilder, FindOptionsWhere, FindOptionsOrder, FindOptionsRelations } from 'typeorm';

export interface PaginationResult<T> {
  data: T[];
  totalPages: number;
  all: number;
}

export async function paginate<T>(
  page: number,
  limit: number,
  repository: Repository<T>,
  filter: FindOptionsWhere<T> = {},
  sort?: FindOptionsOrder<T>
): Promise<PaginationResult<T>> {
  try {
    let queryBuilder: SelectQueryBuilder<T> = repository.createQueryBuilder('entity');

    Object.entries(filter).forEach(([key, value]) => {
      queryBuilder = queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
    });

    if (sort) {
      Object.entries(sort).forEach(([key, value]) => {
        queryBuilder = queryBuilder.addOrderBy(`entity.${key}`, value as 'ASC' | 'DESC');
      });
    }

    const count = await queryBuilder.getCount();

    queryBuilder = queryBuilder
      .skip(page * limit)
      .take(limit);

    const data = await queryBuilder.getMany();
    const totalPages = Math.ceil(count / limit);

    return { data, totalPages, all: count };

  } catch (error) {
    console.error('Pagination error:', error);
    throw new Error('Failed to paginate');
  }
}