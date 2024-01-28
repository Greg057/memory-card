import { useState, useEffect } from "react"

const NUMBER_POKEMONS = 5

export default function Card () {
    const [pokemons, setPokemons] = useState([])

    async function setUpPokemons (dataArr) {
        const newPokemon = await Promise.all(dataArr.map(async pokemon => {
            const pokemonImage = await getPokemonImage(pokemon.url)
            console.log(pokemon.name + pokemonImage)
            return {name: pokemon.name, image: pokemonImage}
        }))
        setPokemons(newPokemon)
    }

    function getPokemonImage (url) { 
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(data => resolve(data.sprites.front_default))
                .catch(err => reject(err))
        })
    }

    useEffect(() => {
    
        async function fetchPokemons () {
            const dataArr = []
            const promises = [];
           
                for (let i = 0; i < NUMBER_POKEMONS; i++) {
                    let id = Math.floor(Math.random() * 1025) + 1
                    const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(res => res.json())
                        .then(data => dataArr.push(data.forms[0]))
                    
                        promises.push(promise)
                }
                await Promise.all(promises)
                return dataArr
        }
        fetchPokemons().then(dataArr => setUpPokemons(dataArr))
                   
    }, [])

    return (
        <div>
            {pokemons.length < NUMBER_POKEMONS ? <h2>{pokemons.length}</h2> : 
                pokemons.map((pokemon, i) => 
                    <div key={i} className="pokemon">
                        <h3>{pokemon.name}</h3>
                        <img src={pokemon.image}/>
                    </div>
                )
            }
        </div>
    )
}