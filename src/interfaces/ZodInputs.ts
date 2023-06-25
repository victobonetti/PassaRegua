import { z } from "zod";

export function validaNome(name: string) {
    return z.string()
        .min(3, { message: "Texto deve haver, ao menos, 3 caracteres." })
        .max(24, { message: "Texto deve haver, no máximo, 24 caracteres." })
        .nonempty()
        .safeParse(name.trim());
}

export function validaPreco(price: string) {
    return z.string()
        .min(4, { message: "Texto deve haver, no mínimo, 4 caracteres." })
        .max(6, { message: "Texto deve haver, no máximo, 5 caracteres." })
        .nonempty()
        .safeParse(price);

}

export function validaTexto(text: string) {
    return z.string()
        .min(6, { message: "Texto deve haver, no mínimo, 6 caracteres." })
        .max(42, { message: "Texto deve haver, no máximo, 24 caracteres." })
        .nonempty()
        .safeParse(text.trim())
}
