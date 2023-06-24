import { z } from "zod";

export function validaNome(name: string) {
    return z.string()
        .min(3, { message: "Texto deve haver, ao menos, 3 caracteres." })
        .max(24, { message: "Texto deve haver, no máximo, 24 caracteres." })
        .safeParse(name);
}

export function validaPreco(price: string) {
    return z.string()
        .min(4, { message: "Texto deve haver, no mínimo, 4 caracteres." })
        .max(6, { message: "Texto deve haver, no máximo, 5 caracteres." })
        .safeParse(price);
    
}
