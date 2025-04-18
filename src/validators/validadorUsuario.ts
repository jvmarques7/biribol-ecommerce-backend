import { z } from "zod";

export const atualizarEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Formato de e-mail inválido."),
});

export const atualizarNomeSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres.")
    .max(100, "Nome muito longo.")
    .trim(),
});

// Você pode ir adicionando aqui mais schemas: senha, telefone, cpf etc...
