import { z } from "zod";
import { phoneRegex } from "../../utils/regex";

export const loginSchema = z.object({
	email: z.email("Email Invalido").min(1, "Email é obrigatório"),
	password: z
		.string()
		.min(6, "Senha deve ter pelo menos 6 caracteres")
		.max(50, "Senha muito longa"),
});

export const registerSchema = z
	.object({
		name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
		email: z.email("Email Invalido").min(1, "Email é obrigatório"),
		phone: z.string().regex(phoneRegex, "Telefone inválido").optional(),
		password: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres")
			.max(50, "Senha muito longa"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
