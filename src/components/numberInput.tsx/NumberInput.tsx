export default function NumberInput({updateVal, clearVal}: {updateVal:(n:number) => void, clearVal:()=>void}){
    return(
        <div className=" self-center mt-4 w-48  bg-slate-950 rounded">
        <div className=" flex ">
            <div onClick={() => updateVal(7)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">7</div>
            <div onClick={() => updateVal(8)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">8</div>
            <div onClick={() => updateVal(9)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">9</div>
        </div>
        <div className=" flex ">
            <div onClick={() => updateVal(4)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">4</div>
            <div onClick={() => updateVal(5)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">5</div>
            <div onClick={() => updateVal(6)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">6</div>
        </div>
        <div className=" flex ">
            <div onClick={() => updateVal(1)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">1</div>
            <div onClick={() => updateVal(2)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">2</div>
            <div onClick={() => updateVal(3)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">3</div>
        </div>
        <div className="flex ">
            <div onClick={() => updateVal(0)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">0</div>
            <div onClick={clearVal} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-28 bg-slate-300">Limpar</div>
        </div>
    </div>
    )
}