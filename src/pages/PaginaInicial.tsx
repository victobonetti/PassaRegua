export default function PaginaInicial({ feedback }: FeedbackProps) {
    return (
        <h1 className=" text-4xl m-4">Bem-vindo de volta!
            <button onClick={() => feedback(false, "Isso é um feedback")} className=" bg-pink-400 text-black p-4 rounded text-2xl">Aperte aqui pra um feedback pica</button>
            <button onClick={() => feedback(true, "Isso é um feedback")} className=" bg-purple-400 text-black p-4 rounded text-2xl">Aperte aqui pra um feedback paia</button>
        
        </h1>
    )
}