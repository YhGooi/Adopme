import { useStore } from '../store/test.store'

import { useState } from "react";




const Home = () => {

    const [inputValue, setInputValue] = useState(0);    

    const bearStore = useStore((state) => state) as any

    function handleChange(e: any) {
        setInputValue(e.target.value);
    }

    function updateBear() {
        bearStore.updateBears(inputValue)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white shadow-lg p-4 rounded-lg">
                <h1 className="font-medium text-2xl">This is a Home Page</h1>
                <p>{ bearStore.bears }</p>
                

                <button onClick={bearStore.increasePopulation}>increment</button>

                {/* <p>{ inputValue }</p> */}
                
                <input type="number" value={inputValue} onChange={handleChange}></input>
                <button onClick={updateBear}>update bear</button>
            </div>
        </div>
    )
}

export default Home