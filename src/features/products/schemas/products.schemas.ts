import { z } from 'zod'

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().min(1).optional(),
})

export type ProductFiltersFormData = z.infer<typeof productFiltersSchema>
