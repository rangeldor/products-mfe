import { createSerializer, parseAsString, parseAsInteger } from 'nuqs'

export const parsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString,
  minPrice: parseAsString,
  maxPrice: parseAsString,
}

export const serializeSearchParams = createSerializer(parsers)
