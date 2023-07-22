import { SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import TextInput from "../inputs/TextInput";
import './table.css'


interface tableComponentProps<T extends { created_at: string, id: string }, Y = never> {
    data: T[],
    dataKeys: string[],
    header: string[],
    deleteMethod?: (data: T | Y) => void,
    otherMethods?: ((data: T | Y) => void)[]
    otherMethodsText?: string[]
    formatDataMethod?: (d: T[]) => T[]
}

export default function TableComponent<T extends { created_at: string, id: string }, Y = never>({ data, dataKeys, header, deleteMethod, otherMethods, otherMethodsText, formatDataMethod }: tableComponentProps<T, Y>) {

    const [optionsActive, setOptionsActive] = useState('');
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const manageOptions = (id?: string) => {
        id ? (optionsActive === id ? setOptionsActive('') : setOptionsActive(id)) : (optionsActive !== '' ? setOptionsActive('') : null);
    }

    const getFormatedData = () => {
        let formated_data;
        if (formatDataMethod) {
            console.log(formatDataMethod(data))
            formated_data = formatDataMethod(data)
        } else {
            formated_data = data;
        }
        return formated_data
    }

    const handleSearch = () => {

        let formated_data = getFormatedData();

        if (search.trim().length > 0) {
            const searchData = search.trim().toLowerCase();
            const filtered = formated_data.filter((item: T) =>
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
        handleSearch();
    }, [search])

    useEffect(() => {
        if (getFormatedData)
            setFilteredData(getFormatedData());
    }, [])


    return (
        <>
            <div className=" px-4 py-1">
                <TextInput label="Buscar..." placeholder="Digite algo..." value={search} set={setSearch} name="search" id="search" />

            </div>
            <table className="w-full">
                <thead className="select-none bg-slate-500 dark:bg-slate-700 font-semibold flex w-full items-center text-sm p-1">
                    <tr className="w-full flex items-center">
                        {header?.map((t: string, i: number) => <td key={t} className="text-xs w-full text-slate-300">{t.toUpperCase()}</td>)}
                    </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300 w-full flex flex-col">
                    {filteredData.map((d: T, i: number) => (
                        <>
                            <tr key={d.id} className={`bg-slate-300 dark:bg-slate-500 p-1 w-full flex items-center border-b dark:border-slate-700 border-slate-400`}>
                                {dataKeys?.map((key: string) => (
                                    <td key={key} className={`w-full text-xs whitespace-nowrap`}>
                                        {String(d[key as keyof T])}
                                    </td>
                                ))}
                                <td className="w-full whitespace-nowrap">
                                    <button onClick={() => manageOptions(d.id)} className={`${optionsActive !== d.id ? "bg-slate-400 dark:bg-slate-300 dark:text-slate-500 text-slate-100" : "bg-slate-100 text-slate-600"} rounded w-12 text-xs hover:opacity-95 h-4 font-black`}>
                                        Editar
                                    </button>

                                </td>

                            </tr>
                            {optionsActive === d.id && (
                                <td className=" text-xs w-full appear dark:bg-slate-400 bg-slate-200  self-start flex flex-col   ">

                                    {deleteMethod && (
                                        <button className=" bg-slate-100  dark:bg-slate-500 dark:border-slate-600 border ml-2 my-2 w-24 rounded p-2 dark:hover:bg-slate-700 hover:bg-slate-50 py-1 text-start text-red-400 cursor-pointer  " onClick={() => deleteMethod(d)}>
                                            Excluir
                                        </button>
                                    )}
                                    {otherMethods && otherMethodsText && otherMethods.length === otherMethodsText.length && otherMethods.map((m, i) => (
                                        <button className=" bg-slate-100  dark:border-slate-600 dark:bg-slate-500  border ml-2 mb-2 w-24 rounded p-2 dark:hover:bg-slate-700 hover:bg-slate-50 py-1 text-start cursor-pointer" onClick={() => m(d)} key={d.id}>
                                            {otherMethodsText[i]}
                                        </button>
                                    ))}

                                </td>
                            )}
                        </>
                    ))
                    }

                </tbody >
            </table >
        </>
    )
}
