import { invoke } from "@tauri-apps/api";
import Account from "../interfaces/Account";
import Product from "../interfaces/Product";
import { User } from "../interfaces/User";

export default class fetchService {
    static fetchUsers = async () => {
        let data_users: User[] = await invoke('find_all_users', {})
        return data_users;
    }

    static fetchAccounts = async () => {
        let data_accounts: Account[] = await invoke('find_all_accounts', {})
        return data_accounts;
    }

    static fetchProducts = async () => {
        let data_products: Product[] = await invoke('find_all_products', {})
        return data_products;
    }
}