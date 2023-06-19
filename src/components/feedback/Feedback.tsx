import { useEffect, useState } from "react"
import './feedback.css'
import FeedbackInterface from "./FeedbackInterface";

export function Feedback({ isError, text, closeSelf }: { isError: boolean, text: string, closeSelf: (props:FeedbackInterface) => void }): JSX.Element {

    const [playFadeOut, setPlayFadeOut] = useState(false);
    const [closed, setCloses] = useState(false)

    let timeout: NodeJS.Timeout;
    let secondTimeout: NodeJS.Timeout;

    useEffect(() => {
        timeout = setTimeout(() => {
            setPlayFadeOut(true);
        }, 5000);

        secondTimeout = setTimeout(() => {
            close()
        }, 5400);

        return () => {
            clearTimeout(timeout);
            clearTimeout(secondTimeout);
        };
    }, [closeSelf]);

    const close = () => {
        clearTimeout(timeout);
        clearTimeout(secondTimeout);
        closeSelf({isErr: isError, text: text});
    }

    return (
        <>
            <div className={`${playFadeOut ? 'modal-fade-out' : 'modal-fade-in'} ${closed ? 'hidden' : ' '} overflow-hidden w-96 `}>
                <div className={`border  ${isError ? ' border-red-500 bg-red-500 text-red-100' : 'border-emerald-500 bg-emerald-500 text-emerald-100'} shadow-inner my-2 rounded `}>
                    <div className=" flex justify-between items-center px-4 py-1">
                        <h3 className=" text-lg font-semibold">{isError ? 'Oops!' : 'Sucesso!'}</h3>
                        {/* <button onClick={() => close()} className=" relative bottom-2 text-lg font-bold">x</button> */}
                    </div>
                    <div className=" px-4 py-2">
                        <p className=" text-sm">{text}</p>
                    </div>
                    <p className=" modal-redux rounded-b-full mt-2 bg-slate-200 h-1 text-black" ></p>
                </div>
            </div >
        </>
    )
}