import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Product from "../interfaces/Product";



export default function PaginaProdutos({ feedback }: FeedbackProps) {

    const [resposta, setResposta] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const data: Product[] = await invoke('find_all_products', {});
                setResposta(data);
            } catch (error) {
                console.error("Erro ao buscar os produtos:", error);
            }
        };
        fetchData();
    }, []);



    return (
        <>
        <tbody className=" text-slate-300  w-full table-auto flex flex-col ">
        <thead className=" select-none bg-slate-400 font-semibold py-4 flex w-full text-sm ">
                        <tr className="flex w-full">
                            <td className="pl-5 text-slate-600 w-1/3 ">PRODUTO</td>
                            <td className="pl-5 text-slate-600 w-1/3 ">PREÇO</td>
                            <td className="pl-5 text-slate-600 w-1/3 "></td>
                        </tr>
                    </thead>

            {resposta?.length < 1  && <h1 className=" w-full bg-slate-800 p-4 text-2xl">Não foram encontrados registros.</h1>}

            {resposta?.map((data) => {
                return (
                    <tr className=" w-full flex justify-evenly bg-slate-800  odd:bg-slate-700">
                        <td className=" font-semibold text-center w-1/3 p-5 text-sm whitespace-nowrap ">
                            {data.name}
                        </td>
                        <td className=" font-semibold text-center w-1/3 p-5 text-sm whitespace-nowrap">
                            {`R$${Number(data.price).toFixed(2)}`}
                        </td>
                        <td className=" text-center w-1/3 p-4  text-sm whitespace-nowrap">
                            <button className=" transition-all hover:bg-transparent hover:text-neutral-300 border border-neutral-300  bg-neutral-300 text-neutral-700 font-semibold px-2 py-1 rounded">Editar</button>
                            <button className="ml-2 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-900 font-semibold px-2 py-1 rounded">Excluir</button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
            <div className=" justify-center p-2 flex ">
                <Link to={'/usuarios/novo'}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar novo usuário</button></Link>
            </div></>
    )
}