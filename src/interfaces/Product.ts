export default interface Product {
    id: string,
    name: string,
    price: number | string,
    created_at:string,
    updated_at?:string,
}