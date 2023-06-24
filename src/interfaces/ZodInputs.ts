import { z } from "zod";

export function validaNome(name: string) {
    return z.string()
        .min(3, { message: "Texto deve haver, ao menos, 3 caracteres." })
        .max(24, { message: "Texto deve haver, no máximo, 24 caracteres." })
        .safeParse(name);
}

export function validaPreco(price: string) {
    return z.string()
        .max(8, { message: "Texto deve haver, no máximo, 8 caracteres." })
        .parse(name);
    
}
