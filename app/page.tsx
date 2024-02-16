'use client';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

interface Person {
  name : string;
  birth_year : string;
  eye_color : string;
  gender : string;
  hair_color : string;
  height : string;
  mass : string;
  skin_color : string;
  homeworld : string;
  films : Array<string>;
  species : Array<string>;
  starships : Array<string>;
  vehicles : Array<string>;
  url : string;
  created : string;
  edited : string;
}

interface CharacterDetailsProps {
  person: Person | null;
  onClose: () => void;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ person, onClose }) => {
  if (!person) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={"people/"+ person.url.split('/')[5] + ".jpg"}></img>
        <h2>{person.name}</h2>
        <p>Year Of Birh: {person.birth_year}</p>
        <p>Eye color: {person.eye_color}</p>
        <p>Gender: {person.gender}</p>
        <p>Hair Color: {person.hair_color}</p>
        <p>Height: {person.height}</p>
        <p>Mass: {person.mass}</p>
        <p>Skin color: {person.skin_color}</p>
        <p>Homeworld: {person.homeworld}</p>
        <p>Films:</p>
        {person.films.map(f => <li>{f}</li>)}
        <p>Spieces:</p>
        {person.species.map(s => <li>{s}</li>)}
        <p>Starships:</p>
        {person.starships.map(s => <li>{s}</li>)}
        <p>Vehicles:</p>
        {person.vehicles.map(v => <li>{v}</li>)}
        <p>URL: {person.url}</p>
        <p>Created: {person.created}</p>
        <p>Edited: {person.edited}</p>
      </div>
    </div>
  );
};

const Loader: React.FC = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

const Home = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchPeople = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        const data = await response.json();
        setPeople(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, [page]);

  const handlePageChange = (newPage : any) => {
    setPage(newPage.selected + 1);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
  };

  return (
    <>
    <div>
      {isLoading && <Loader />}
        <div id="galery">
            {people.map(p =>
            <div className='personCard' key={p.url.split('/')[5]}>
                <a onClick={() => handlePersonClick(p)}>
                    <img src={"people/"+ p.url.split('/')[5] + ".jpg"}></img>
                    <p>{p.name}</p>
                </a>
            </div>)}
        </div>

        {/* Pagination */}
        <ReactPaginate
          className='react-paginate'
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageChange}
          pageCount={9}
          previousLabel="Previous"
        />
    </div>

    <CharacterDetails person={selectedPerson} onClose={handleCloseModal} />
    </>
  )
}

export default Home
