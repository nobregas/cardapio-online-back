import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
	description: z
		.string()
		.min(1, "Descrição é obrigatória")
		.max(200, "Descrição muito longa"),
	order: z
		.number()
		.int("Ordem deve ser um número inteiro")
		.min(0, "Ordem deve ser maior ou igual a 0"),
	image: z.url("URL da imagem inválida"),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;
