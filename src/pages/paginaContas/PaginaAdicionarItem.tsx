import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Product from "../../interfaces/Product";
import { invoke } from "@tauri-apps/api";
import Account from "../../interfaces/Account";
import Item from "../../interfaces/Item";
import { Link, useNavigate, useParams } from "react-router-dom";
import { table } from "console";
import { FeedbackContext } from "../../routes/appRouter";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";


interface selectedProduct {
    product: Product,
    quantity: number
}

export default function PaginaAdicionarItem() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const [resposta, setResposta] = useState<Product[]>([]);
    const [selected, setSelected] = useState<selectedProduct[]>([])
    const [account, setAccount] = useState<Account>();
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [itemErr, setItemErr] = useState('');

    const { id } = useParams();

    let navigate = useNavigate();

    const createItems = async () => {
        manageLoading(true)
        try {
            await Promise.all(
                selected.map(async (s) => {
                    let name = s.product.name;
                    let quantity = s.quantity;
                    let price = s.product.price;
                    let accountId = id;
                    let productId = s.product.id;
                    await invoke('create_item', { name, quantity, price, accountId, productId });
                })
            );
            navigate(`/contas/items/${id}`);
        }
        catch (e) {
            createFeedback(true, String(e));
            manageLoading(false);
        }
    };

    const updateTotal = () => {
        let n = 0;
        selected.map((s) => {
            n += s.quantity * Number(s.product.price)
        })
        setTotal(n);
    }

    const selectProduct = (product: Product) => {
        if (Number(product.price) + total > 1000) {
            createFeedback(true, 'Valor máximo excedido (R$1000.00).')
        } else {

            let has_product = false;

            let data = selected.map((p) => {
                if (p.product.id != product.id) {
                    return p;
                } else {
                    p.quantity += 1;
                    has_product = true;
                    return p;
                }
            })

            if (!has_product || selected.length == 0) {
                data.push({ product: product, quantity: 1 })
            }
            console.log(data)
            setSelected(data);
        }
    }

    const spliceProduct = (product: selectedProduct) => {
        let data = selected;
        data = data.filter((p) => {
            return p.product.id != product.product.id
        })
        setSelected(data);
    }

    const fetchData = async (): Promise<void> => {
        try {
            let accountId = id;
            const p: Product[] = await invoke('find_all_products', {});
            setResposta(p);
            const a: Account = await invoke('find_account_by_id', { accountId })
            setAccount(a);
        } catch (e) {
            createFeedback(true, String(e));
        } finally {
            manageLoading(false);
        }
    };

    useLayoutEffect(() => {
        manageLoading(true);
    }, [])

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateTotal()
    }, [selected])

    return (
        <div className=" w-full h-full flex flex-col items-center ">
            <h1 className=" my-8 text-4xl text-slate-300">Selecionar produtos </h1>
            <div className=" flex w-full">
                <div className=" p-4 w-3/5 flex flex-col items-center justify-center">
                    <span className=" mb-2 text-slate-400 text-xs">Digite um produto, e então clique em "adicionar" para coloca-lo em seu carrinho.</span>
                    <input placeholder="Buscar produto..." autoComplete="none" onChange={e => setSearch(e.target.value)} className=" w-full mb-2 shadow appearance-none border rounded py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="name" />
                    <table className="h-96 dark:border-none border border-slate-300 text-slate-700 dark:text-slate-300  bg-slate-200 dark:bg-slate-500 overflow-hidden w-full">
                        {resposta?.map((p) => {
                            if (p.name.toLowerCase().includes(search.toLowerCase()) || search.trim().length == 0) {
                                return (
                                    <tr className=" dark:border-none border-b border-slate-300  w-full flex justify-evenly items-center dark:bg-slate-800  odd:dark:bg-slate-700" key={String(p.id)}>
                                        <td className="  w-1/3 p-2 flex whitespace-nowrap ">{p.name}</td>
                                        <td className="  w-1/3 p-2 flex whitespace-nowrap ">R${Number(p.price).toFixed(2)}</td>
                                        <td className="  w-1/3 p-2 flex whitespace-nowrap "><ButtonComponentLink text={"Adicionar"} color={0} method={() => selectProduct(p)} />
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                    </table>
                </div>
                <div className=" p-4 w-2/5 flex flex-col items-center h-full  ">
                    <span className=" mb-2 text-slate-400 text-xs">Aqui aparecem os produtos selecionados e sua quantidade.</span>

                    <div className=" rounded flex items-center justify-center mb-2 h-9 w-full dark:bg-slate-300 text-center text-slate-600">Carrinho</div>
                    <div className=" dark:border-none border border-slate-300 bg-slate-200 dark:bg-slate-800 h-96 w-full overflow-y-scroll">
                        <table className=" w-full"> <thead className=" select-none dark:bg-slate-400 font-semibold flex w-full text-sm ">
                            <tr className=" dark:border-none border border-slate-300  flex w-full">
                                <td className="  p-2 text-slate-600 dark:text-slate-300 w-1/3 text-sm flex whitespace-nowrap">PRODUTO</td>
                                <td className="  p-2 text-slate-600 dark:text-slate-300 w-1/3 text-sm flex whitespace-nowrap">PREÇO</td>
                                <td className="  p-2 text-slate-600 dark:text-slate-300 w-1/3 text-sm flex whitespace-nowrap">QUANTIDADE</td>
                            </tr>
                        </thead>
                            {selected?.map((s) => {
                                return (<tr className=" text-slate-700 dark:text-slate-300 w-full flex justify-evenly border-b border-slate-300 dark:border-slate-600" key={String(s.product.id)}>
                                    <td className="  w-1/3 p-2 flex whitespace-nowrap ">{s.product.name}</td>
                                    <td className="  w-1/3 p-2 flex whitespace-nowrap ">R${Number(s.product.price).toFixed(2)}</td>
                                    <td className="  w-1/3 p-2 flex whitespace-nowrap ">{s.quantity} <span onClick={() => spliceProduct(s)} className=" ml-4 bg-red-400 text-red-900 px-2 rounded cursor-pointer font-black">x</span></td>
                                </tr>)
                            })}
                        </table>
                    </div>
                </div>
            </div>
            <div className=" flex justify-between w-full self-start">
                <button onClick={() => createItems()} className=" ml-4 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-900 font-semibold px-4 py-2 rounded text-xl">Confirmar</button>

                <div className=" mr-4 h-16 w-36  text-red-400 text-2xl flex flex-col items-center justify-center">
                    <span className=" mb-2 text-slate-400 text-xs">Valor total dos itens:</span>
                    <span className=" border rounded px-2 py-1"> R${total.toFixed(2)}</span>
                    <span className=" mb-2 text-xs text-red-500">{itemErr}</span>

                </div>
            </div>
            <Link className=" mt-2 ml-4 self-start text-slate-400 underline cursor-pointer " to={'/contas'}><p >Voltar</p></Link>

        </div>

    )
}