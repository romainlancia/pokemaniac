import React from "react"
import { POKEMON_TYPES_COLOR } from "consts"

const PokemonTypeBadge = ({ type }: { type: string }) => {
    return (
        <div className="rounded border p-[3px] font-bold text-white uppercase font-sans w-[66px] text-xs leading-normal m-[1px]" style={{ backgroundColor: POKEMON_TYPES_COLOR[type as keyof typeof POKEMON_TYPES_COLOR] }}>
            {type}
        </div>
    )
}

export default PokemonTypeBadge
