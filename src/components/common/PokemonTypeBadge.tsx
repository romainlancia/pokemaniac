import React from "react"
import { PokemonTypeColor } from "../../types"

const POKEMON_TYPES: PokemonTypeColor = {
    normal: "#ABAA99",
    fire: "#FF4422",
    water: "#3399FF",
    electric: "#FFCC33",
    grass: "#77CC56",
    ice: "#66CCFF",
    fighting: "#BB5544",
    poison: "#A95699",
    ground: "#DDBB55",
    flying: "#8998FF",
    psychic: "#FF5599",
    bug: "#AABB23",
    rock: "#BAAA66",
    ghost: "#6666BB",
    dragon: "#7766EE",
    dark: "#775544",
    steel: "#A9AABB",
    fairy: "#EE99EE"
}

const PokemonTypeBadge = ({ type }: { type: string }) => {
    return (
        <div className="rounded border p-[3px] font-bold text-white uppercase font-sans w-[66px] text-xs leading-normal m-[1px]" style={{ backgroundColor: POKEMON_TYPES[type as keyof typeof POKEMON_TYPES] }}>
            {type}
        </div>
    )
}

export default PokemonTypeBadge
