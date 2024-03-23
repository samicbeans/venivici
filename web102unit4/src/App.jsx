import { useState } from 'react'
import './App.css'
// import { useEffect } from 'react'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dogData, setDogData] = useState(null);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [dogImage, setdogImage] = useState('');
  
  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.thedogapi.com/v1/images/search?api_key=${ACCESS_KEY}`);
      const data = await response.json();
      console.log(data);
      if (data && data.length > 0) {
        const dogInfo = data[0];
        if (dogInfo.breeds && dogInfo.breeds.length > 0) {
          if(!(bannedAttributes.includes(dogInfo.breeds[0]?.breed_group)|| bannedAttributes.includes(dogInfo.breeds[0]?.weight.metric))){
            setDogData(dogInfo);
            setdogImage(dogInfo.url);
          }
        } 
        else {
          fetchData();
        }
      } else {
        console.error('Empty response received from the API.');
      }
    } catch (error) {
      console.error('Error fetching dog data:', error);
    }
  };

  const handleFetchClick = () => {
    fetchData();
  };


  const displayData = () => {
    handleFetchClick();
  };

  const handleBanAttribute = (attribute) => {
    setBannedAttributes([...bannedAttributes, attribute]);
  };

  const removeBanAttribute = (attribute) => {
    setBannedAttributes(bannedAttributes.filter(item => item !== attribute));
  }

  return (
    <>
      <div className='main-container'>
      <h1> Discover Dogs on this giant Earth!</h1>
        <button onClick={displayData}>Discover</button>
        <div className='banlist-container'>
        <h2>Currently banned attributes:</h2>
        <ul className='banlist'>
          {bannedAttributes.map((attribute, index) => (
            <li key={index}className="button-like" onClick={() => removeBanAttribute(attribute)}>
            {attribute} </li>
          ))}
        </ul>
      </div>
        {dogData && dogData.breeds && dogData.breeds.length > 0 && (
        <div className='dog-display'>
          <img className='dog-img' src={dogImage} alt={dogData.breeds[0].name} />
          <p>Click on an attribute to add it to the banlist.</p>
          <p>Breed Name: {dogData.breeds[0].name}</p>
          <button onClick={() => handleBanAttribute(dogData.breeds[0].bred_for)}>Bred for: {dogData.breeds[0].bred_for}</button>
          <button onClick={() => handleBanAttribute(dogData.breeds[0].breed_group)}>Breed Group: {dogData.breeds[0].breed_group}</button>
          <button onClick={() => handleBanAttribute(dogData.breeds[0].weight.metric)}>{dogData.breeds[0].weight.metric} pounds</button>
        </div>
      )}
      </div>
    </>
  )
}

  

export default App
