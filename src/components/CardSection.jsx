import { useState, useEffect } from "react"
import Card from "./Card"
import { v4 as uuidv4 } from 'uuid';


export default function CardSection () {
    const [pokemons, setPokemons] = useState([])
    const [pokemonsCliked, setPokemonsClicked] = useState([])
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [isGameOver, setIsGameOver] = useState(false)

    const NUMBER_POKEMONS = 10

    async function setUpPokemons (dataArr) {
        const newPokemon = await Promise.all(dataArr.map(async pokemon => {
            const pokemonImage = pokemon.sprites.front_default
            const pokemonId = uuidv4()
            let pokemonName = pokemon.name.replace("-", " ")
            pokemonName = pokemonName[0].toUpperCase() + pokemonName.slice(1)
            return {id: pokemonId, name: pokemonName, image: pokemonImage}
        }))
        setPokemons(newPokemon)
    }

    useEffect(() => {
        setPokemonsClicked([])

        async function fetchPokemons () {
            const dataArr = []
            const promises = [];
            const IDs = []
            const totalNumberPokemons = 493 //until Generation IV included
           
                for (let i = 0; i < NUMBER_POKEMONS; i++) {
                    let uniqueId = false
                    let id
                    while (uniqueId !== true) {
                        id = Math.floor(Math.random() * totalNumberPokemons) + 1
                        if (!IDs.find(idElement => idElement === id)) {
                            uniqueId = true
                            IDs.push(id)
                        }
                    }
                    
                    const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(res => res.json())
                        .then(data => dataArr.push(data))
                    
                        promises.push(promise)
                }
                await Promise.all(promises)
                return dataArr
        }

        fetchPokemons().then(dataArr => setUpPokemons(dataArr))

    }, [isGameOver])

    function handleClick (name) {
        if (pokemonsCliked.includes(name)) {
            gameOver("lost")
        } else {
            setPokemonsClicked([...pokemonsCliked, name])
            setScore(score + 1)
            score >= highScore && setHighScore(score + 1)
            shuffleArray()
        } 
        if (pokemonsCliked.length + 1 === pokemons.length) {
            gameOver("win")
        }
    }

    function gameOver(gameOutcome) {
        gameOutcome === "lost" && setScore(0)
        setIsGameOver(!isGameOver)
    }

    function shuffleArray () {
        const newPokemons = [...pokemons]
        for (let i = newPokemons.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [newPokemons[i], newPokemons[j]] = [newPokemons[j], newPokemons[i]];
        }
        newPokemons.forEach(pokemon => pokemon.id = uuidv4())
        setPokemons(newPokemons)
    }

    return (
        <div className="main-container">
            <div className="score">
                <h3>Score: {score}</h3>
                <h3>High Score: {highScore}</h3>
            </div>
            <div style={{fontSize: "28px", color: "white"}}>Do not click on the same Pokemon twice!</div>
            <div style={{margin: "12px 0", fontWeight: 600, color: "white"}}>{pokemonsCliked.length} / {pokemons.length}</div>
            {pokemons.length < NUMBER_POKEMONS ? <h2>Loading...</h2> : 
                <div className="card-section">
                    {pokemons.map((pokemon) =>
                        <Card pokemon={pokemon} key={pokemon.id} onClick={handleClick}/>
                    )}
                </div>
            }
            <div className="credits-background">background by @Wind_Light on Reddit</div>
        </div>
    )
}