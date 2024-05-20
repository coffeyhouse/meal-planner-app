import React, { useState, useEffect } from 'react';
import NavBar from '../common/NavBar';
import PageContainer from '../layout/PageContainer';
import MealCard from '../MealCard';
import { PiSlidersHorizontal } from "react-icons/pi";
import { searchItems } from '../../utils/search';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';

function Meals() {
    const [meals, setMeals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        fetch('/api/meals')
            .then(response => response.json())
            .then(data => setMeals(data))
            .catch(error => console.error('Error fetching meals:', error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMeals = searchItems(meals, ['name'], searchQuery);

    return (
        <PageContainer>
            <PageContainer.Header>
                <NavBar title="Meals" />
                <div className='flex gap-2'>
                    <input
                        type="text"
                        className='px-3 py-2 border border-black/20 rounded-xl grow text-sm'
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className='bg-[#70B9BE] rounded-xl px-3' onClick={()=> setIsModalOpen(true)}>
                        <PiSlidersHorizontal className='text-lg text-white' />
                    </button>
                </div>
            </PageContainer.Header>
            <PageContainer.Content>

                <div className="grid grid-cols-2 gap-4">
                    {filteredMeals.map(meal => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                    <Link to="/recipe-builder" className='rounded-2xl bg-white p-3 flex flex-col gap-2 shadow-lg shadow-gray-200'>
                        <div className={`flex p-2 items-start justify-end h-[100px] w-[100%] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("https://pbs.twimg.com/media/CHM5quRXIAAV8H7.png")] rounded-2xl`}>
                        </div>
                        <p className='font-bold text-sm'>Add a meal</p>
                        <div className='flex gap-1 items-center'>
                            <div className={`h-[20px] w-[20px] rounded-full bg-black/10`}> </div>
                            <p className='text-xs text-black/30 font-medium'>Make it tasty</p>
                        </div>
                    </Link>
                </div>
            </PageContainer.Content>
            {isModalOpen && (
                <Modal title="Meal filter" onClose={()=> setIsModalOpen(false)}>
                    <p>There'll be some filters here of some sort.</p>
                </Modal>
            )
            }
        </PageContainer>
    );
}

export default Meals;
