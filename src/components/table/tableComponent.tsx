import { useState } from "react";

interface tableComponentProps<T extends { created_at: string, id: string }> {
    data: T[],
    dataKeys: string[],
    header: string[],
    deleteMethod?: (data: T) => void,
    otherMethods?: ((data: T) => void)[]
    otherMethodsText?: string[]
}

export default function TableComponent<T extends { created_at: string, id: string }>({ data, dataKeys, header, deleteMethod, otherMethods, otherMethodsText }: tableComponentProps<T>) {

    const [optionsActive, setOptionsActive] = useState('');

    const manageOptions = (id: string) => {
        optionsActive == id ? setOptionsActive('') : setOptionsActive(id)
    }

    return (
        <table className="w-full">
            <thead className="select-none bg-slate-400 font-semibold flex w-full items-center text-sm p-1">
                <tr className=" w-full flex items-center">
                    {header?.map((t, i) => <td key={i} className=" text-xs  w-full text-slate-600">{t.toUpperCase()}</td>)}
                </tr>
            </thead>
            <tbody className="text-slate-300 w-full flex flex-col">
                {data.map((d: T, i) => {
                    return (
                        <tr key={d.id} className={` ${ optionsActive == d.id ? "text-emerald-100 bg-emerald-900 border" : "bg-slate-800 odd:bg-slate-700"} p-1 w-full flex items-center `}>
                            {
                                dataKeys?.map((key) => {
                                    return (
                                        <td key={i} className={` w-full text-xs  whitespace-nowrap`}>
                                            {String(d[key as keyof T])}
                                        </td>
                                    )
                                })
                            }
                            <td className=" w-full flex whitespace-nowrap">
                                <button onClick={() => manageOptions(d.id)} className={`${ optionsActive != d.id ? " bg-slate-400 text-slate-100 w-12 rounded" : " bg-slate-100 text-slate-600 w-16 rounded-l"} pl-1.5 text-start text-xs hover:opacity-95 h-4  font-black`}>Editar</button>

                                {
                                    optionsActive == d.id &&
                                    <div className=" text-xs ml-16 flex rounded-r rounded-bl flex-col absolute bg-slate-100 text-slate-600">

                                        <div className=" py-3 pl-1 pr-4 flex flex-col justify-start items-start">
                                            {deleteMethod &&
                                                <button className="text-red-400 cursor-pointer hover:opacity-50" onClick={() => deleteMethod(d)}>Excluir</button>
                                            }

                                            {otherMethods && otherMethodsText && otherMethods.length === otherMethodsText.length && otherMethods.map((m, i) => {
                                                return <button className=" cursor-pointer hover:opacity-50" onClick={() => m(d)}>{otherMethodsText[i]}</button>
                                            })}
                                        </div>
                                    </div>
                                }
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}
