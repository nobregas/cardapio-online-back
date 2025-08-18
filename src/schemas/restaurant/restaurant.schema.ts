import { z } from "zod";
import { phoneRegex, cnpjRegex, cepRegex } from "../../utils/regex";

export const addressSchema = z.object({
	street: z.string().min(1, "Rua é obrigatória"),
	city: z.string().min(1, "Cidade é obrigatória"),
	state: z.string().length(2, "Estado deve ter 2 caracteres"),
	zipCode: z.string().regex(cepRegex, "CEP deve conter 8 dígitos"),
});

export const paymentMethodsSchema = z.object({
	creditCard: z.boolean(),
	debitCard: z.boolean(),
	pix: z.boolean(),
});

export const paymentSettingsSchema = z.object({
	online: z.object({
		active: z.boolean(),
		methods: paymentMethodsSchema,
	}),
	onDelivery: z.object({
		active: z.boolean(),
		methods: paymentMethodsSchema.extend({
			cash: z.boolean(),
		}),
		needsChange: z.boolean(),
	}),
	pixDetails: z.object({
		key: z.string().min(1, "Chave PIX é obrigatória"),
		keyHolderName: z
			.string()
			.min(1, "Nome do titular da chave PIX é obrigatório"),
	}),
	additionalInstructions: z.string().optional(),
});

export const createRestaurantSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	cnpj: z.string().regex(cnpjRegex, "CNPJ deve conter 14 dígitos"),
	logo: z.url("URL do logo inválida"),
	email: z.email("Email inválido"),
	description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
	phone: z
		.string()
		.regex(phoneRegex, "Telefone deve estar no formato: DDD9XXXXXXXX"),
	address: addressSchema,
	paymentSettings: paymentSettingsSchema,
});

export const updateAddressSchema = addressSchema.partial();
export const updatePaymentSettingsSchema = paymentSettingsSchema.partial();
export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantSchemaType = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantSchemaType = z.infer<typeof updateRestaurantSchema>;
export type AddressSchemaType = z.infer<typeof addressSchema>;
export type PaymentSettingsSchemaType = z.infer<typeof paymentSettingsSchema>;
