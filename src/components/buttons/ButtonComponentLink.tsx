import { Link } from "react-router-dom";

enum colors {
    "cyan",
    "emerald",
    "red"
}

export default function ButtonComponentLink({ text, path, color, method }: { text: string, path?: string, color: colors, method?: () => void }) {
    return (
        // '/usuarios/novo'
        <>
            {path && !method &&
                <Link to={path}><button type="submit" className={` transition-all hover:bg-transparent hover:text-${colors[color]}-300 border border-${colors[color]}-300  bg-${colors[color]}-300 text-${colors[color]}-900 font-semibold px-4 py-2 rounded text-lg`}>{text}</button></Link>
            }

            {!path &&
                <button onClick={method} type="submit" className={` transition-all hover:bg-transparent hover:text-${colors[color]}-300 border border-${colors[color]}-300  bg-${colors[color]}-300 text-${colors[color]}-900 font-semibold px-4 py-2 rounded text-lg`}>{text}</button>
            }
        </>
    )
}