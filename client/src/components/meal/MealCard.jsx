import React from 'react';
import { Link } from 'react-router-dom';
import { RxPlus, RxHeartFilled } from "react-icons/rx";

const authors = [
    {
        name: "Pinch of Nom",
        image: "https://m.media-amazon.com/images/I/71G-Y+X7YWL._CR0,0,2000,2000_._FMpng_.png"
    },
    {
        name: "Mob Kitchen",
        image: "https://scontent-lhr8-1.xx.fbcdn.net/v/t39.30808-1/304549882_504165881714798_4234327993987256087_n.png?stp=dst-png_p200x200&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=sp_6q0i2d9kQ7kNvgFU1k1H&_nc_ht=scontent-lhr8-1.xx&oh=00_AYDblXwksiQiUpEmM4ifVjMQd1gfJPX1kYO4iKvLRJ72rQ&oe=665132F1"
    },
    {
        name: "Jamie Oliver",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwnorN9eomTca_P11XUCxbcgS6Tx70tOq1knlKzUjnJg&s"
    },
    {
        name: "Hairy Bikers",
        image: "https://yt3.googleusercontent.com/ytc/AIdro_kNKY9_CM5nd57Zk3CXR-smMP0zmLE5oP5oUUBPx1S-OXU=s900-c-k-c0x00ffffff-no-rj"
    },
    {
        name: "Salty Marshmallow",
        image: "https://img.freepik.com/premium-vector/marshmallow-cartoon-mascot-food-vector-illustration_388759-503.jpg"
    },
];

function getRandomAuthor() {
    const randomIndex = Math.floor(Math.random() * authors.length);
    return authors[randomIndex];
}

function MealCard({ meal, action }) {
    const { name, image } = getRandomAuthor();

    const imageUrl = meal.imageUrl ? `http://localhost:5000${meal.imageUrl}` : `https://picsum.photos/300?random=${meal.id}`;

    if (action === "add") {
        return (
            <div className='rounded-2xl bg-white p-2 flex gap-3 shadow-lg shadow-gray-200 items-center'>
                <div className={`flex p-2 items-start justify-end h-[70px] w-[85px] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("${imageUrl}")] rounded-2xl`}>
                </div>
                <div className='flex flex-col gap-1 grow'>
                    <p className='font-bold text-sm'>{meal.name}</p>
                    <div className='flex gap-1 items-center'>
                        <div className={`h-[20px] w-[20px] rounded-full bg-cover bg-center bg-no-repeat 
                    bg-[url("${image}")]`} alt={name}> </div>
                        <p className='text-xs text-black/30 font-medium'>{name}</p>
                    </div>
                </div>
                <button className='bg-[#353535] text-white rounded-lg w-6 h-6 flex items-center justify-center text-sm mx-2'><RxPlus /></button>
            </div>
        );
    }

    return (
        <Link to={`/recipe-builder/${meal.id}`} className='rounded-2xl bg-white p-3 flex flex-col gap-2 shadow-lg shadow-gray-200'>
            <div className={`flex p-2 items-start justify-end h-[100px] w-[100%] 
                    bg-cover bg-center bg-no-repeat 
                    bg-[url("${imageUrl}")] rounded-2xl`}>
                <div className='bg-white p-1 rounded-lg text-[#FA691A]'><RxHeartFilled /></div>
            </div>
            <p className='font-bold text-sm'>{meal.name}</p>
            <div className='flex gap-1 items-center'>
                <div className={`h-[20px] w-[20px] rounded-full bg-cover bg-center bg-no-repeat 
                    bg-[url("${image}")]`} alt={name}> </div>
                <p className='text-xs text-black/30 font-medium'>{name}</p>
            </div>
        </Link>
    );
}

export default MealCard;
