import { z } from "zod";

export function validaNome(name: string) {
    return z.string().trim()
        .min(3, { message: "Texto deve haver, ao menos, 3 caracteres." })
        .max(24, { message: "Texto deve haver, no máximo, 24 caracteres." })
        .nonempty()
        .safeParse(name);
}

export function validaPreco(price: string) {
    return z.string().trim()
        .min(4, { message: "Texto deve haver, no mínimo, 4 caracteres." })
        .max(6, { message: "Texto deve haver, no máximo, 5 caracteres." })
        .nonempty()
        .safeParse(price);

}

export function validaTexto(text: string) {
    return z.string().trim()
        .min(6, { message: "Texto deve haver, no mínimo, 6 caracteres." })
        .max(42, { message: "Texto deve haver, no máximo, 24 caracteres." })
        .nonempty()
        .safeParse(text)
}
export function validaCpf(text: string) {
    const sanitizedText = text.replace(/[-e]/gi, "");

    return z.string()
        .trim()
        .min(11, { message: "CPF deve ter no mínimo 11 caracteres." })
        .max(11, { message: "CPF deve ter no máximo 11 caracteres." })
        .nonempty({ message: "CPF não pode ser vazio." })
        .safeParse(sanitizedText);
}


export function validaPhone(text: string) {
    const sanitizedText = text.replace(/[-e]/gi, "");
    return z.string().trim()
        .min(10, { message: "Telefone deve ter 10 - 11 caracteres." })
        .max(11, { message: "Telefone deve ter 10 - 11 caracteres." })
        .nonempty()
        .safeParse(sanitizedText);
}

