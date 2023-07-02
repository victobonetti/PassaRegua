import { SetStateAction, useEffect, useState } from "react";
import TextInput from "../inputs/TextInput";
import './table.css'
import React from 'react';


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
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const manageOptions = (id?: string) => {
        id ? (optionsActive === id ? setOptionsActive('') : setOptionsActive(id)) : (optionsActive !== '' ? setOptionsActive('') : null);
    }

    const handleSearch = () => {
        if (search.trim().length > 1) {
            const searchData = search.trim().toLowerCase();
            const filtered = data.filter((item: T) =>
                Object.values(item).some((search) =>
                    String(search).toLowerCase().includes(searchData)
                )
            );
            setFilteredData(filtered);

        } else {
            setFilteredData(data);
        }
    };

    useEffect(() => {
        handleSearch()
    }, [search])

    return (
        <>
            <TextInput label="Buscar..." placeholder="Digite algo..." value={search} set={setSearch} name="search" id="search" />
            <table onClick={() => manageOptions()} className="w-full">
                <thead className="select-none bg-slate-400 font-semibold flex w-full items-center text-sm p-1">
                    <tr className="w-full flex items-center">
                        {header?.map((t, i) => <td key={i} className="text-xs w-full text-slate-600">{t.toUpperCase()}</td>)}
                    </tr>
                </thead>
                <tbody className="text-slate-300 w-full flex flex-col">
                    {filteredData.map((d: T, i) => (
                        <div key={d.id}>
                            <tr className={`bg-slate-800 odd:bg-slate-700 p-1 w-full flex items-center`}>
                                {dataKeys?.map((key) => (
                                    <td key={key} className={`w-full text-xs whitespace-nowrap`}>
                                        {String(d[key as keyof T])}
                                    </td>
                                ))}
                                <td className="w-full whitespace-nowrap">
                                    <button onClick={() => manageOptions(d.id)} className={`${optionsActive !== d.id ? "bg-slate-400 text-slate-100" : "bg-slate-100 text-slate-600"} rounded w-12 text-xs hover:opacity-95 h-4 font-black`}>
                                        Editar
                                    </button>
                                </td>
                            </tr>
                            {optionsActive === d.id && (
                                <>
                                    <tr className="w-full flex self-end z-10 text-xs text-slate-500">
                                        {dataKeys?.map(() => (
                                            <td className="w-full"></td>
                                        ))}
                                        <td className="flex w-full">
                                            <div className="rounded-b w-20 appear bg-slate-200 self-start flex flex-col justify-start items-start py-3 pl-1 pr-4">
                                                {deleteMethod && (
                                                    <button className="text-start text-red-400 cursor-pointer hover:opacity-50 border-b w-full border-slate-300" onClick={() => deleteMethod(d)}>
                                                        Excluir
                                                    </button>
                                                )}
                                                {otherMethods && otherMethodsText && otherMethods.length === otherMethodsText.length && otherMethods.map((m, i) => (
                                                    <button className="text-start border-b w-full border-slate-300 cursor-pointer hover:opacity-50" onClick={() => m(d)} key={i}>
                                                        {otherMethodsText[i]}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr></tr>
                                </>
                            )}
                        </div>
                    ))}
                </tbody>
            </table>
        </>
    )
}
